const WebSocket = require('ws');
const assert_warning = require('reassert/warning');
const {colorWarning} = require('@brillout/cli-theme');

module.exports = reloadBrowser;

const PORT = 3218;
let reloadSocket;

function reloadBrowser() {
    if( ! reloadSocket ) {
        reloadSocket = new WebSocket.Server({port: PORT});
    }
    improveErrorHandling(reloadSocket);
    broadcast(reloadSocket, 'RELOAD_BROWSER');
}

function broadcast(socket, data) {
  socket.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(data);
      }
  });
}

function improveErrorHandling(reloadSocket) {
    reloadSocket.on("error", err => {
        if( ! ((err||{}).message||'').includes('EADDRINUSE') ) {
            throw err;
        }
        assert_warning(
            false,
            colorWarning("Autoreload will not work."),
            "Because the port "+PORT+" is already in use."
        );
    });
}
