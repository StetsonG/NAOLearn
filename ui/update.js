$(document).ready(function () {

WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
WEB_SOCKET_DEBUG = true;

host = 'http://localhost:3001';

// Socket.io specific code
var socket = io.connect(host, {
  'reconnect': true,
  'reconnection delay': 500,
});

jointsran = {
  headp: [-1,1,100], heady: [-1,1,100],
  rshlr: [-1,1,100], rshlp: [-1,1,100],
  relbr: [-1,1,100], relby: [-1,1,100],
  rwriy: [-1,1,100], rhand: [-1,1,100],
  lshlr: [-1,1,100], lshlp: [-1,1,100],
  lelbr: [-1,1,100], lelby: [-1,1,100],
  lwriy: [-1,1,100], lhand: [-1,1,100],
};

socket.on('JointPosition', function(data) {
    // Add received data point to the graph
    pos = JSON.parse(data);
    for( var joint in pos ) {
      console.log(joint);
      var jointpos = pos[joint];
      var jointran = jointsran[joint];
      jointpos = jointran[2] * ( jointpos - jointran[0] ) / ( jointran[1] - jointran[0] );
      console.log(jointpos);
      $(j+'-show').attr('value',jointpos);
    }
});

});

function resubscribe_join_position() {
  socket.emit('JointPosition','subscribe');
}

function subscribe_join_position() {
  socket.emit('JointPosition','subscribe');
  socket.on('JointPositionExpired', resubscribe_join_position);
}

function resubscribe_camera() {
  socket.emit('Camera','subscribe');
}

subscribe_camera() {
  socket.emit('Camera','subscribe');
  socket.on('JointPositionExpired', resubscribe_camera);
}
