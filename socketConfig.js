const { io } = require("socket.io-client");

const socket = io("http://turbosrc-egress-router:4007/", {
  path: '/vote-client/socket.io',
  transportOptions: {
    polling: {
      extraHeaders: {
        'my-custom-header': 'abcd'
      }
    }
  },
  transports: ['websocket'], // <---- Add this line
  secure: false,  // ensure secure connection
});

socket.on("connect", () => console.log('socket id:', socket.id))
socket.on("disconnect", () => console.log('socket disconnected'))

module.exports = { socket }
