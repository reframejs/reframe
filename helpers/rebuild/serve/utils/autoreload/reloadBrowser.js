const WebSocket = require('ws');

module.exports = reloadBrowser;

const PORT = 3218;
let reloadSocket;

function reloadBrowser() {
    if( ! reloadSocket ) {
        reloadSocket = new WebSocket.Server({port: PORT});
    }
    broadcast(reloadSocket, 'RELOAD');
}

function broadcast(socket, data) {
  socket.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(data);
      }
  });
}
