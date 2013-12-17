// A Server listens for websocket connections. It maintains exactly two live clients.
// Whatever client 1 sends is streamed to client 2, and vice versa.
// If a third client joins, the oldest client is kicked out.
//
// TODO
// Seems no way to recognize disconnects coming from client? socketDisconnected never receives a recognisable socket.
var Server = {};
Server.PORT = 80;
Server.socketQueue = [];
Server.MAX_QUEUE_SIZE = 2;

Server.acceptConnection = function(socket)
{
  console.log('+ new connection received');

  socket.on('disconnect', Server.socketDisconnected);

  // closure to hook up to a function with an extra parameter w00t
  socket.on('message', function(incomingData) {
    Server.receiveData(socket, incomingData);
  });

  Server.socketQueue.push(socket);
  if (Server.socketQueue.length > Server.MAX_QUEUE_SIZE)
  {
    console.log('new socket exceeds server limit of ' + Server.MAX_QUEUE_SIZE);
    var discarded = Server.socketQueue.shift();
    discarded.disconnect();
    console.log('discarded oldest socket, new queue size: ' + Server.socketQueue.length);
  }
}

Server.receiveData = function(socket, received)
{
  if (Server.socketQueue.length == 2)
  {
    console.log('socket ' + Server.socketQueue.indexOf(socket) + ' received: ' + received);  
  }
  else
  {
    console.log('ignoring data from socket ' + Server.socketQueue.indexOf(socket) + ', number of clients: ' + Server.socketQueue.length);
  }
}

Server.socketDisconnected = function(socket)
{
  // FIXME the passed socket is NEVER in the queue, even if a recognised client performed socket.disconnect()
  var socketIndex = Server.socketQueue.indexOf(socket);
  if (socketIndex != -1)
  {
    // FIXME is never invoked
    Server.socketQueue.splice(socketIndex, 1);
    console.log('removed socket from queue after client disconnected');
  }
  else
  {
    console.log('received disconnect event but socket was not in queue');
  }
}

var io = require('socket.io').listen(Server.PORT);
io.set('log level', 1); // reduce debug
io.sockets.on('connection', Server.acceptConnection);
console.log('listening on port ' + Server.PORT);