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

  Server.socketQueue.push(socket);

  if (Server.socketQueue.length == 1)
  {
    console.log('only one client connected, waiting for new connections');
  }
  else if (Server.socketQueue.length > Server.MAX_QUEUE_SIZE)
  {
    console.log('new client exceeds server limit of ' + Server.MAX_QUEUE_SIZE);
    var discarded = Server.socketQueue.shift();
    discarded.disconnect();
    console.log('discarded oldest client, new queue size: ' + Server.socketQueue.length);
  }

  if (Server.socketQueue.length == 2)
  {
    Server.socketQueue[0].removeAllListeners('message');
    Server.socketQueue[1].removeAllListeners('message');

    // FIXME this direct approach doesn't work - not sure why
    //Server.socketQueue[0].on('message', Server.socketQueue[1].send);
    //Server.socketQueue[1].on('message', Server.socketQueue[0].send);
    
    Server.socketQueue[0].on('message', function(data) { Server.socketQueue[1].send(data); });
    Server.socketQueue[1].on('message', function(data) { Server.socketQueue[0].send(data); });
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
    console.log('- removed socket from queue after client disconnected');
  }
  else
  {
    console.log('- received disconnect event but socket was not in queue');
  }
}

// main
var io = require('socket.io').listen(Server.PORT);
io.set('log level', 1); // reduce debug
io.set('origins', 'http://air.github.io:*');
io.sockets.on('connection', Server.acceptConnection);
console.log('listening on port ' + Server.PORT);
