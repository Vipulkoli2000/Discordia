// socket.js
import io from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("https://yashportfoliohub.site", {
      withCredentials: true,
      secure: true,
    });
    console.log("Connecting socket...");
  }
};

export const getSocket = () => {
  if (!socket) {
    console.log("Socket not connected");
    connectSocket();
  }
  return socket;
};
