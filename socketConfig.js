const { io } = require("socket.io-client");

const socket = io("http://localhost:4000/", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
}
  );

socket.on("connect", () => console.log('socket id:', socket.id))
socket.on("disconnect", () => console.log('socket disconnected'))

  module.exports = { socket }