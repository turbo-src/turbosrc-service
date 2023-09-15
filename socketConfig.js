const { io } = require("socket.io-client");

const socket = io("http://turbosrc-egress-router:4007/", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
}
  );

socket.on("connect", () => console.log('socket id:', socket.id))
socket.on("disconnect", () => console.log('socket disconnected'))

  module.exports = { socket }
