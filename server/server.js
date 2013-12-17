var PORT = 80;
var io = require('socket.io').listen(PORT);

console.log('listening on port ' + PORT);

io.sockets.on('connection', function (socket)
{
  console.log('connection received');
  
  socket.on('message', function (received)
  {
    // include number hints with +
    var x = +received.split(' ')[0];
    x += 200;
    var z = +received.split(' ')[1];
    z += 200;
    socket.send(x + ' ' + z);
  });

  socket.on('disconnect', function ()
  {
    console.log('disconnected');
  });
});