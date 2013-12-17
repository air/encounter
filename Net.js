var Net = {};

Net.HOST = "dummy-host";
Net.PORT = "80";

Net.init = function()
{
  var socket = io.connect('http://' + Net.HOST + ':' + Net.PORT);
  socket.on('connect', function ()
  {
    socket.send('hello from client');

    socket.on('message', function (received) {
    console.log(received);
    });
  });
}