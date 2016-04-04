$(document).ready(function () {

WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
WEB_SOCKET_DEBUG = true;

host = '';

// Socket.io specific code
var socket = io.connect(host, {
  'reconnect': true,
  'reconnection delay': 500,
});

socket.on('speed', function(data) {
    // Add received data point to the graph
    d1 = d1.slice(1);
    d1.push(data);
    plot.setData([{data: enumerate(d1)}]);
    plot.draw();

    // Update text field with new pressure value
    $('#pressure').text(data);
    
    // Change connection status from "Connecting..." to "Connected" when first data value comes through
    if (!connected) {
      $('#status').text("Connected");
      connected = true;
    }
});

});
