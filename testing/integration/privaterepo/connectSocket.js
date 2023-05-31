const assert = require('assert');
const {
        socket
      } = require('../../../socketConfig')

      socket.on("connect", () => console.log('socket id:', socket.id))
      socket.disconnect()
// describe('Connect Socket', function () {
//     it("should connect to the socket", async function () {

//     let resConnectSocket;


//     assert.equal(
// 	resConnectSocket,
// 	"socket connected",
//     "Fail to connect socket"
//     );
//     })
//       });
