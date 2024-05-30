// const redis = require("redis");
// const { createClient } = require("redis");

// const client = createClient({
//   socket: {
//     // 172.17.0.1

//     host: "127.0.0.1",
//     port: 6379,
//     no_ready_check: true,
//   },
// });

// const publisher = client.duplicate();
// publisher.on("error", (err) => console.error(err));

// const subscriber = client.duplicate();
// subscriber.on("error", (err) => console.error(err));

// (async () => {
//   await publisher.connect();
//   await subscriber.connect();
// })();

// module.exports = { publisher, subscriber };
