const { io } = require('socket.io-client');

/* 
   This file mimics the client side socket for testing. In production, chrome-extension is the client
   and egress-router/service is the server. In the tests, there is no client, so we have the below to simulate
   a client connecting and test that our socket is working.
*/

const socket = io('http://turbosrc-egress-router:4007/', {
  path: '/vote-client/socket.io',
  transportOptions: {
    polling: {
      extraHeaders: {
        'my-custom-header': 'abcd'
      }
    }
  },
  transports: ['websocket'], // <---- Add this line
  secure: false // ensure secure connection
});

socket.on('connect', () => {
  console.log('Socket connection established');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

module.exports = { socket };