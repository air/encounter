var Net = {};

Net.HOST = atob('NTAuMTkuMTg0LjIyOA==');
Net.PORT = 80;
Net.socket = null;

Net.init = function()
{
  Net.socket = io.connect('http://' + Net.HOST + ':' + Net.PORT);

  Net.socket.on('connect', function () {
    console.log('net connected to host: ' + Net.HOST);
    Net.socket.on('message', Net.receive);
  });
}

Net.receive = function(received)
{
  var position = received.split(' ');
  Enemy.position.x = position[0];
  Enemy.position.z = position[1];
}

Net.update = function(timeDeltaMillis)
{
  Net.socket.send(Player.position.x + ' ' + Player.position.z);
}