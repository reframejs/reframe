const io = require('socket.io-client');

//module.exports = install;
install();

function install(port=3218) {
    const socket = io('http://localhost:'+port);
    socket.on('autoreload', function(){
        document.location.reload();
    });
}
