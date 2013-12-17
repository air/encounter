var Net = {};

Net.HOST = atob('NTAuMTkuMTg0LjIyOA==');
Net.PORT = 80;

Net.init = function()
{
  var socket = io.connect('http://' + Net.HOST + ':' + Net.PORT);
  socket.on('connect', function ()
  {
    console.log('connected to host: ' + Net.HOST);
    socket.send('hello from client');

    socket.on('message', function (received) {
    console.log(received);
    });
  });
}
