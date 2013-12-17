var PORT = 80;
var io = require('socket.io').listen(PORT);

console.log('listening on port ' + PORT);

io.sockets.on('connection', function (socket)
{
  console.log('connection received');
  
  socket.on('message', function (received)
  {
    console.log('message received:');
    console.log(received);
  });

  socket.on('disconnect', function ()
  {
    console.log('disconnected');
  });
});