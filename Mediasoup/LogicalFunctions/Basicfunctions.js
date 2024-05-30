const mediasoup = require("mediasoup");
const os = require("os");

async function createWorker() {
  const numCores = os.cpus().length;

  const worker = await mediasoup.createWorker({
    logLevel: "debug",
    logTags: ["rtp", "srtp", "rtcp"],
    rtcMinPort: 2000,
    rtcMaxPort: 2200,
  });

  console.log(`worker pid ${worker.pid}`);

  worker.on("died", (error) => {
    console.error("mediasoup worker has died");
    setTimeout(() => process.exit(1), 2000);
  });

  return worker;
}

async function createWebRtcTransport(router) {
  return new Promise(async (resolve, reject) => {
    try {
      const webRtcTransport_options = {
        listenIps: [
          {
            ip: "0.0.0.0",
            announcedIp: process.env.IP,
          },
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      };

      let transport = await router.createWebRtcTransport(
        webRtcTransport_options
      );
      console.log(`transport id: ${transport.id}`);

      transport.on("dtlsstatechange", (dtlsState) => {
        if (dtlsState === "closed") {
          transport.close();
        }
      });

      transport.on("close", () => {
        console.log("transport closed");
      });

      resolve(transport);
    } catch (error) {
      reject(error);
    }
  });
}

async function pipeProducersBetweenRouters({
  producerIds,
  sourceRouter,
  targetRouter,
  alreadyPipedProducersforcheck,
}) {
  // if (!alreadyPipedProducersforcheck.has(producerIds)) {
  if (sourceRouter === targetRouter) {
    return;
  }
  try {
    if (!alreadyPipedProducersforcheck.has(producerIds)) {
      alreadyPipedProducersforcheck.add(producerIds);

      console.log(producerIds, "producerId");

      if (producerIds == undefined) {
        return;
      }
      Roomfull = true;
      console.log("room is now full", Roomfull);

      const { pipeConsumer, pipeProducer } = await sourceRouter.pipeToRouter({
        producerId: producerIds,
        router: targetRouter,
      });

      console.log(
        `Successfully piped producer ${producerIds} to target router`
      );
      // console.log("ID of producer", pipeProducer.id);
      console.log("ID of consumer", pipeConsumer.id);
      // Track piped producer to avoid duplicate attempts

      // Handle producer close events
      pipeConsumer.on("transportclose", () => {
        console.log(`Consumer for producer ${producerIds} closed`);
        pipeConsumer.close();
      });
      pipeProducer.on("producerclose", () => {
        console.log(`Producer ${producerIds} closed`);
        pipeProducer.close();
      });
      pipeProducer.on("transportclose", () => {
        console.log(`Producer ${producerIds} closed`);
        pipeProducer.close();
      });

      console.log("Between in", pipeConsumer);
      return pipeConsumer.id, pipeProducer;
    }
  } catch (error) {
    console.error(`Error piping producer ${producerIds}: ${error.message}`);
    alreadyPipedProducersforcheck.delete(producerIds);
    Roomfull = false;
  }
  // }
}

module.exports = {
  createWorker,
  createWebRtcTransport,
  pipeProducersBetweenRouters,
};
// const createWebRtcTransport = async (router) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const webRtcTransport_options = {
//         listenIps: [
//           {
//             ip: "127.0.0.1",
//           },
//         ],
//         enableUdp: true,
//         enableTcp: true,
//         preferUdp: true,
//       };

//       let transport = await router.createWebRtcTransport(
//         webRtcTransport_options
//       );
//       console.log(`transport id: ${transport.id}`);

//       transport.on("dtlsstatechange", (dtlsState) => {
//         if (dtlsState === "closed") {
//           transport.close();
//         }
//       });

//       transport.on("close", () => {
//         console.log("transport closed");
//       });

//       resolve(transport);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
