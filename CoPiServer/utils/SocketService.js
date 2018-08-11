const WebSocketServer = require("websocket").server;
let clients = [];

const init = server => {
  const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  wsServer.on("request", function(request) {
    console.log(new Date() + " Connection from origin " + request.origin + ".");
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;

    connection.on("close", function(connection) {
      console.log(
        new Date() + " Peer " + connection.remoteAddress + " disconnected."
      );

      clients.splice(index, 1);
    });
  });
};

const emit = (subject, message) => {
  var json = JSON.stringify({ subject: subject, data: message });
  for (var i = 0; i < clients.length; i++) {
    clients[i].sendUTF(json);
  }
};

module.exports = { init, emit };
