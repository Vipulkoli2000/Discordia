const { io } = require("./index.js");
// const { publisher, subscriber } = require("./redisClient"); // Import Redis clients
const chatcontroller = require("./controller/chatController");
const Threadchatcontroller = require("./controller/Threadchatcontroller");
const Usercontroller = require("./controller/usercontroller");
var cookie = require("cookie");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Subscribe to Redis channels when a user joins a channel
    socket.on("join_channel", (channelId) => {
      console.log(channelId);
      socket.join(channelId);
      console.log(`User ${socket.id} joined channel ${channelId}`);
    });

    socket.on("send_message", async (data) => {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const jwt = cookies.jwt;
      if (!jwt) throw new Error("JWT not found");

      const base64Url = jwt.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(
        Buffer.from(base64, "base64").toString()
      );

      if (!decodedPayload.userId) throw new Error("Invalid JWT payload");
      try {
        if (data.reciever) {
          const Directmessage = await Usercontroller.sendMessage(
            data,
            decodedPayload.userId
          );
          io.to(decodedPayload.userId).emit("New-directmessage", Directmessage);
          io.to(data.reciever).emit("New-directmessage", Directmessage);
        }

        if (data.channel) {
          let = chat = await chatcontroller.sendMessage(
            data,
            decodedPayload.userId
          );

          io.to(data.channel).emit("new_message", chat);
          // Publish message to Redis channel instead of directly emitting it
          // publisher.publish("message", JSON.stringify(chat));
          return;
        }
        if (data.threadId) {
          const cookies = cookie.parse(socket.handshake.headers.cookie || "");
          const jwt = cookies.jwt;
          const decodedPayload = JSON.parse(atob(jwt.split(".")[1]));
          user = decodedPayload.userId;

          let chat = await Threadchatcontroller.sendMessage(
            data,
            decodedPayload.userId
          );
          io.to(data.threadId).emit("new_message", chat);

          // Publish message to Redis channel
          // publisher.publish("message", JSON.stringify(chat));
          return;
        }
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", error.message);
      }
    });

    // Handle incoming messages from Redis and emit to respective channels
    // subscriber.subscribe("message", (channel, message1) => {
    //   if (!channel) {
    //     return;
    //   }
    //   console.log(message1, channel, "asdasd");
    //   const message = JSON.parse(channel);
    //   console.log(`Message received from channel ${message.channel}`);

    //   io.to(message.channel).emit("new_message", message);
    // });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      // Consider unsubscribing from channels to clean up resources
    });
  });
};
