const PORT = 3218;
const DEBUG = false;
let isEnabled;

connect();

function connect() {
    const socket = new WebSocket('ws://localhost:'+PORT);

    socket.onmessage = ev => {
        DEBUG && console.log('m');
        if( ev.data === 'RELOAD_BROWSER' ) {
            reloadBrowser();
        }
    };

    socket.onopen = () => {
        DEBUG && console.log('o');
        console.log("Auto-reload enabled.");
        if( isEnabled === false ) {
            reloadBrowser();
        }
        isEnabled = true;
    };

    // Automatically Reconnect when no connection
    // Source: https://stackoverflow.com/questions/22431751/websocket-how-to-automatically-reconnect-after-it-dies
    socket.onclose = () => {
        DEBUG && console.log('c');
        setTimeout(function() {
            connect();
        }, 1000);
    };

    socket.onerror = () => {
        DEBUG && console.log('e');
        if( isEnabled !== false ) {
            console.warn("Auto-reload disabled.");
        }
        isEnabled = false;
        socket.close();
    };
}

function reloadBrowser() {
    document.location.reload();
}
