process.env.DEBUG = "mediasoup*";
const mediasoup = require("mediasoup");
const { AwaitQueue } = require("awaitqueue");
const os = require("os");
const promClient = require("prom-client");
const axios = require("axios");
var pidusage = require("pidusage");

const {
  createWorker,
  createWebRtcTransport,
  pipeProducersBetweenRouters,
} = require("./LogicalFunctions/Basicfunctions");

// function getCpuInfo() {
//   return os.cpus().map((cpu) => {
//     const times = cpu.times;
//     return {
//       idle: times.idle,
//       total: Object.keys(times).reduce((acc, key) => acc + times[key], 0),
//     };
//   });
// }

// function calculateCpuUsage(startMeasurements, endMeasurements) {
//   return startMeasurements.map((start, i) => {
//     const end = endMeasurements[i];
//     const idleDiff = end.idle - start.idle;
//     const totalDiff = end.total - start.total;
//     const usagePercentage =
//       totalDiff === 0 ? 0 : 100 * (1 - idleDiff / totalDiff);
//     return Number(usagePercentage.toFixed(2));
//   });
// }

// // Sample usage
// let startMeasurements = getCpuInfo();

setInterval(() => {
  // let endMeasurements = getCpuInfo();
  // let usagePercentages = calculateCpuUsage(startMeasurements, endMeasurements);
  // console.log("CPU Usage (%):", usagePercentages);
  // // Send this data to your broker here
  // // e.g., sendCpuUsageData(usagePercentages);
  // startMeasurements = endMeasurements; // Prepare for the next interval
}, 1000); // Every second

// function generatePrimes(n) {
//   const primes = [];
//   for (let num = 2; num <= n; num++) {
//       let isPrime = true;
//       for (let i = 2; i <= Math.sqrt(num); i++) {
//           if (num % i === 0) {
//               isPrime = false;
//               break;
//           }
//       }
//       if (isPrime) {
//           primes.push(num);
//       }
//   }
//   return primes;
// }

// const n = 100000; // Adjust the range as per your requirement
// setInterval(() => {
//     generatePrimes(n);
//     generatePrimes(n);
//     generatePrimes(n);
//     generatePrimes(n);
//     generatePrimes(n);

// }, 100);

module.exports = async function (io) {
  const roomQueue = new AwaitQueue();

  let worker;
  let workermap = new Map();
  let rooms = new Map(); // { roomName1: { Router, rooms: [ sicketId1, ... ] }, ...}
  let peers = new Map(); // { socketId1: { roomName1, socket, transports = [id1, id2,] }, producers = [id1, id2,] }, consumers = [id1, id2,], peerDetails }, ...}
  let transports = new Map(); // [ { socketId1, roomName1, transport, consumer }, ... ]
  let producers = []; // [ { socketId1, roomName1, producer, }, ... ]
  let consumers = []; // [ { socketId1, roomName1, consumer, }, ... ]
  let Peerstrack = [];
  let alreadyPipedProducersforcheck = new Set();
  let alreadyPipedProducer = new Set();
  let Roomfull = false;
  let Currentindex = 0;
  let Remoteindex = 0;
  const participantRouterMap = new Map();
  const producerRouterMap = new Map();
  let Trakpiped = new Map();
  const mediaCodecs = [
    {
      kind: "audio",
      mimeType: "audio/opus",
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: "video",
      mimeType: "video/VP9",
      clockRate: 90000,
      parameters: {
        "x-google-start-bitrate": 1000,
      },
    },
  ];

  async function createWorkers() {
    const numCores = os.cpus().length;

    for (let i = 0; i < numCores; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: "debug",
        logTags: ["rtp", "srtp", "rtcp"],
        rtcMinPort: 2000 + i * 100, // Adjust port range for each worker
        rtcMaxPort: 2100 + i * 100,
      });

      // Listen for worker death.
      worker.on("died", () => {
        console.error(`mediasoup worker ${worker.pid} has died`);
        setTimeout(() => process.exit(1), 2000);
      });

      // After worker creation, create a router for this worker.
      const router = await worker.createRouter({ mediaCodecs });

      // Initialize the worker's load to 0, store the worker and its router.
      workermap.set(i, { worker, router });
      ChangeRouterindex(0);
      console.log(
        `Worker created with PID: ${worker.pid}, and its router initialized.`
      );
    }
  }

  await createWorkers();
  function ChangeRouterindex(index) {
    Currentindex = index;
    return Currentindex;
  }
  function FetchCurrentindex() {
    return Currentindex;
  }

  const createRoom = async (roomName, socketId, i) => {
    return roomQueue.push(async () => {
      let room = rooms.get(roomName);

      let peers = [];
      if (!room) {
        const router = await workermap.get(i).router;
        room = { router, peers: new Set([socketId]) };
        rooms.set(roomName, room);
      } else {
        room.peers.add(socketId);
      }

      console.log(`This is Room Router ${room.router} ${rooms}`);

      return room.router;
    });
  };
  function getSourceRouterForProducer(producerId) {
    const routerIndex = producerRouterMap.get(producerId);
    if (routerIndex !== undefined) {
      return workermap.get(routerIndex).router;
    } else {
      console.error("Producer not associated with any router.");
      return null;
    }
  }

  async function pipeExistingProducersToTargetRouter(socket) {
    console.log("We in here");
    for (let producerData of producers) {
      if (!producerData.producer.id) continue;
      const sourceRouterindex = producerRouterMap.get(producerData.producer.id);
      const sourceRouter = workermap.get(sourceRouterindex).router;
      console.log("pipetoall ", sourceRouter);
      if (alreadyPipedProducersforcheck.has(producerData.producer.id)) {
        return;
      }
      if (!sourceRouter) continue;
      let targetRouter;
      if (Currentindex === 1) {
        targetRouter = workermap.get(0).router;
      } else {
        targetRouter = workermap.get(1).router;
      }
      console.log("Insideia ", targetRouter);
      const producerSocket = peers.get(producerData.socketId).socket;

      if (targetRouter === sourceRouter) continue;
      if (alreadyPipedProducersforcheck.has(producerData.producer.id)) {
        console.log("this is already poped");
      }

      // Check if the producer is not already piped to this target router
      if (!alreadyPipedProducersforcheck.has(producerData.producer.id)) {
        const { pipeConsumer, pipeProducer } =
          await pipeProducersBetweenRouters({
            producerIds: producerData.producer.id,
            sourceRouter,
            targetRouter,
            alreadyPipedProducersforcheck,
          });
        console.log(pipeProducer);
        if (!pipeProducer || !pipeConsumer) continue;
        // await Broadcast(pipeConsumer, Currentindex);
        await socket.emit("new-producer-piped", {
          producerId: pipeConsumer,
          targetRouterindex: Currentindex,
        });
        Trakpiped.set(pipeConsumer, targetRouter);
        alreadyPipedProducer.add(pipeConsumer);
      }
    }
  }

  // Now, pipe the new participant's producer to all other routers

  const getTransport = (socketId) => {
    for (let [transportId, transportData] of transports.entries()) {
      if (transportData.socketId === socketId && !transportData.consumer) {
        return transportData.transport;
      }
    }
    console.error(`Transport not found for socket ID: ${socketId}`);
    return null;
  };

  const informConsumers = (roomName, socketId, id, socket) => {
    console.log(`just joined, id ${id} ${roomName}, ${socketId}`);

    producers.forEach((producerData) => {
      if (
        producerData.socketId !== socketId &&
        producerData.roomName === roomName
      ) {
        if (peers.has(producerData.socketId)) {
          const producerSocket = peers.get(producerData.socketId).socket;
          console.log("Inform", producerData.producer.id, id);
          socket.broadcast.emit("new-producer", {
            producerId: id,
            targetRouterindex: 0,
          });

          pipeProducer(id, producerSocket, socket);
        } else {
          console.log(`Producer not found in peers: ${producerData.socketId}`);
        }
      }
    });
  };
  const pipeProducer = async (producerId, producerSocket, socket) => {
    if (alreadyPipedProducersforcheck.has(producerId)) return;
    try {
      let targetRouterIndex;
      if (Currentindex === 1) {
        const sourceRouterIndex = producerRouterMap.get(producerId);
        const sourceRouter = workermap.get(sourceRouterIndex).router;

        const targetRouter = workermap.get(0).router;
        if (sourceRouter === targetRouter) return;
        if (!alreadyPipedProducersforcheck.has(producerId)) {
          const { pipeConsumer, pipeProducer } =
            await pipeProducersBetweenRouters({
              producerIds: producerId,
              sourceRouter,
              targetRouter,
              alreadyPipedProducersforcheck,
              producerSocket,
            });
          await pipeProducer.on("transportclose", () => {
            console.log("transport for this producer closed ");
            pipeProducer.close();
          });

          if (pipeConsumer === null || pipeConsumer === undefined) {
            return;
          }
          console.log("event is being triggered", pipeConsumer);

          await io.emit("new-producer-piped", {
            producerId: pipeConsumer.id,
            targetRouterindex: Currentindex,
          });
          Trakpiped.set(pipeConsumer, targetRouter);

          alreadyPipedProducer.add(pipeConsumer);
        }
        return;
      } else {
        targetRouterIndex = 1;
      }
      console.log("in pipeProducer", producerId);
      const sourceRouterIndex = producerRouterMap.get(producerId);
      if (sourceRouterIndex === undefined) {
        console.error(`Producer ${producerId} not associated with any router.`);
        return;
      }
      if (sourceRouterIndex === targetRouterIndex) {
        console.log(`Producer ${producerId} already in the target router.`);
        return;
      }
      const sourceRouter = workermap.get(sourceRouterIndex).router;
      const targetRouter = workermap.get(targetRouterIndex).router;

      const { pipeConsumer, pipeProducer } = await pipeProducersBetweenRouters({
        producerIds: producerId,
        sourceRouter,
        targetRouter,
        alreadyPipedProducersforcheck,
        producerSocket,
      });

      await pipeProducer.on("transportclose", () => {
        console.log("transport for this producer closed ");
        pipeProducer.close();
      });

      if (pipeConsumer === null || pipeConsumer === undefined) {
        return;
      }
      console.log("event is being triggered", pipeConsumer);

      await producerSocket.emit("new-producer-piped", {
        producerId: pipeConsumer.id,
        targetRouterindex: Currentindex,
      });
      Trakpiped.set(pipeConsumer, targetRouter);

      alreadyPipedProducer.add(pipeConsumer.id);

      Roomfull = true;
    } catch (error) {
      console.error("Error in processing:", error.message);
      Roomfull = false;
    }
  };

  io.on("connection", (socket) => {
    console.log(`peer joined ${socket.id}`);
    socket.emit("connection-success", { socketID: socket.id });

    const removeItems = (items, socketId, type) => {
      if (!Array.isArray(items)) {
        console.error("items is not an array");
        return items;
      }

      items.forEach((item) => {
        if (item.socketId === socket.id) {
          item[type].close();
        }
      });

      items = items.filter((item) => item.socketId !== socket.id);

      return items;
    };

    const addTransport = async (transport, roomName, consumer) => {
      transports.set(transport.id, {
        socketId: socket.id,
        transport,
        roomName,
        consumer,
      });

      let peer = peers.get(socket.id);

      await peer?.transports?.push(transport.id);
      peers.set(socket.id, peer);
    };
    const addProducer = async (producer, roomName, kind) => {
      producers = [
        ...producers,
        { socketId: socket.id, producer, roomName, kind },
      ];
      console.log(producer.id);

      let peer = peers.get(socket.id);
      peer.producers.push(producer.id);
      peers.set(socket.id, peer);
    };

    const addConsumer = (consumer, roomName) => {
      consumers = [...consumers, { socketId: socket.id, consumer, roomName }];

      let peer = peers.get(socket.id);
      peer.consumers.push(consumer.id);
      peers.set(socket.id, peer);
    };

    socket.on("joinRoom", async ({ roomName }, callback) => {
      let router1;
      let router2;
      let rtpCapabilities;

      console.log("Status of room", Roomfull);
      router1 = await createRoom(roomName, socket.id, 0);
      router2 = await createRoom(roomName, socket.id, 1);
      const Routers = [router1.rtpCapabilities, router2.rtpCapabilities];
      participantRouterMap.set(socket.id, Currentindex);

      if (Remoteindex > 10) {
        ChangeRouterindex(1);
      }
      peers.set(socket.id, {
        socket,
        roomName,
        transports: [],
        producers: [],
        consumers: [],
        peerDetails: {
          name: "",
          isAdmin: false,
        },
      });
      let rpa = router1.rtpCapabilities;
      Remoteindex += 1;
      callback({
        Routers,
        Currentindex,
      });
    });
    socket.on("getRouterindex", async ({ producerid }, callback) => {
      console.log(producerid);
      callback({
        index: 1,
      });
    });

    socket.on("transport-connect", ({ dtlsParameters }) => {
      console.log("DTLS PARAMS... ", { dtlsParameters });

      getTransport(socket.id).connect({ dtlsParameters });
    });

    socket.on(
      "createWebRtcTransport",
      async ({ consumer, RouterId }, callback) => {
        const peer = peers.get(socket.id);
        if (!peer) {
          console.error(`No peer found for socket ID: ${socket.id}`);
          return; // or handle this case as appropriate for your application
        }
        const roomName = peer.roomName;

        // router = rooms.get(roomName).router;

        let router = workermap.get(Currentindex).router;

        await createWebRtcTransport(router)
          .then(
            (transport) => {
              callback({
                params: {
                  id: transport.id,
                  iceParameters: transport.iceParameters,
                  iceCandidates: transport.iceCandidates,
                  dtlsParameters: transport.dtlsParameters,
                },
              });

              // add transport to Peer's properties
              addTransport(transport, roomName, consumer);
            },
            (error) => {
              console.log(error);
            }
          )
          .then(
            console.log(
              `Transport Kind is ${consumer ? "Consumer" : "producer"}`
            )
          );
      }
    );

    socket.on("getProducers", async (callback) => {
      const roomName = peers.get(socket.id)?.roomName;
      console.log(producers);
      let producerList = [];
      await Promise.all(
        producers.map(async (producerData) => {
          if (
            producerData.socketId !== socket.id &&
            producerData.roomName === roomName
          ) {
            producerList.push(producerData.producer.id);
          }
        }),
        pipeExistingProducersToTargetRouter(socket)

        // alreadyPipedProducer.forEach((producer) => {
        //   producerList.push(producer);
        // })
      );

      console.log(typeof producerList); // Logging the type of producerList

      callback(producerList);
    });

    socket.on(
      "transport-produce",
      async ({ kind, rtpParameters, appData }, callback) => {
        const peer = peers.get(socket.id);
        if (!peer) {
          console.log(`Peer does not exist for socket ID: ${socket.id}`);
          return callback({ error: "Peer not found." });
        }
        return roomQueue.push(async () => {
          try {
            let producer;

            producer = await getTransport(socket.id).produce({
              kind,
              rtpParameters,
            });
            const Currentindex = participantRouterMap.get(socket.id);
            producerRouterMap.set(producer.id, Currentindex);

            const roomName = peers.get(socket.id).roomName;

            const transport = getTransport(socket.id);
            if (!transport) {
              console.error("Transport not found.");
              return;
            }

            addProducer(producer, roomName, kind);

            informConsumers(roomName, socket.id, producer.id, socket);

            console.log("Producer ID: ", producer.id, producer.kind);

            producer.on("transportclose", () => {
              console.log("transport for this producer closed ");
              producer.close();
            });

            console.log(producers.length);

            callback({
              id: producer.id,
              producersExist: producers.length > 1 ? true : false,
            });
          } catch (error) {
            console.log(error);
          }
        });
      }
    );

    socket.on(
      "transport-recv-connect",
      async ({ dtlsParameters, serverConsumerTransportId }) => {
        const consumerTransport = transports.get(
          serverConsumerTransportId
        )?.transport;

        if (consumerTransport) {
          await consumerTransport.connect({ dtlsParameters });
        } else {
          console.log(`${consumerTransport} not a transport`);
        }
      }
    );

    function removeItemsFromCollections(socketId) {
      producers = producers.filter((p) => p.socketId !== socketId);
      consumers = consumers.filter((c) => c.socketId !== socketId);
      transports = transports.filter((t) => t.socketId !== socketId);

      peers.delete(socketId);
      console.log(`Cleaned up resources for ${socketId}`);
    }

    socket.on(
      "consume",
      async (
        { rtpCapabilities, remoteProducerId, serverConsumerTransportId },
        callback
      ) => {
        try {
          const roomName = peers.get(socket.id).roomName;
          let router;
          if (alreadyPipedProducer.has(remoteProducerId)) {
            router = Trakpiped.get(remoteProducerId);
          } else {
            router = workermap.get(Currentindex).router;
          }

          console.log("Remote", router);
          let consumerTransport = transports.get(
            serverConsumerTransportId
          )?.transport;

          // check if the router can consume the specified producer
          if (
            router.canConsume({
              producerId: remoteProducerId,
              rtpCapabilities,
            })
          ) {
            console.log("consumercan consume");
            // transport can now consume and return a consumer
            const consumer = await consumerTransport.consume({
              producerId: remoteProducerId,
              rtpCapabilities,
              paused: true,
            });

            socket.on(
              "new-screen-share-producer",
              ({ producerId, roomName }) => {
                console.log(
                  `New screen share producer: ${producerId} in room: ${roomName}`
                );

                // Broadcast this producer ID to all other clients in the same room, except the sender
                io.emit("new-screen-share", { producerId });
              }
            );

            socket.on(
              "consumer-resume",
              async ({ serverConsumerId, producerId }) => {
                const { consumer } = consumers.find(
                  (consumerData) =>
                    consumerData.consumer.id === serverConsumerId
                );
                if (!consumer) return;
                if (producerId) {
                  producers.forEach(async (producerData) => {
                    if (producerData.producer.id === producerId) {
                      await producerData.producer.resume();
                    }
                  });
                }

                await consumer?.resume();
              }
            );
            socket.on(
              "consumer-pause",
              async ({ serverConsumerId, producerId }) => {
                console.log(serverConsumerId, producerId);
                const { consumer } = consumers.find(
                  (consumerData) =>
                    consumerData.consumer.id === serverConsumerId
                );
                await consumer.pause();

                producers.forEach(async (producerData) => {
                  if (producerData.producer.id === producerId) {
                    await producerData.producer.pause();
                  }
                });
              }
            );
            socket.on("consumer-close", ({ serverConsumerId }) => {
              const { consumer } = consumers.find(
                (consumerData) => consumerData.consumer.id === serverConsumerId
              );
              consumer.close();
            });
            socket.on("producer-close", ({ producerId }) => {
              producers.forEach((producerData) => {
                if (producerData.producer.id === producerId) {
                  producerData.producer.close();
                }
              });
            });

            if (consumer.paused) {
              console.log("Consumer is currently paused");
            }

            if (consumer.closed) {
              console.log("Consumer is closed");
            }

            consumer.on("transportclose", () => {
              console.log("transport close from consumer");
            });

            consumer.on("producerclose", () => {
              console.log("producer of consumer closed");
              socket.emit("producer-closed", { remoteProducerId });

              consumerTransport.close([]);
              transports = transports.filter(
                (transportData) =>
                  transportData.transport.id !== consumerTransport.id
              );
              consumer.close();
              consumers = consumers.filter(
                (consumerData) => consumerData.consumer.id !== consumer.id
              );
            });

            addConsumer(consumer, roomName);

            const params = {
              id: consumer.id,
              producerId: remoteProducerId,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
              serverConsumerId: consumer.id,
            };

            callback({ params });
          }
        } catch (error) {
          console.log(error.message);
          callback({
            params: {
              error: error,
            },
          });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("peer disconnected");
      producers = producers.filter((p) => p.socketId !== socket.id);
      consumers = consumers.filter((c) => c.socketId !== socket.id);
      transports = removeItems(transports, socket.id, "transport");
      consumers
        .filter((c) => c.socketId === socket.id)
        .forEach((c) => {
          c.consumer.close();
        });
      console.log(Peerstrack);
      if (peers.get(socket.id)) {
        const roomName = peers.get(socket.id).roomName;

        peers.delete(socket.id);
      }
    });
  });
};
