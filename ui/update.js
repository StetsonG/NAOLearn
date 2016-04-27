function start_execution() {

  WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
  WEB_SOCKET_DEBUG = true;
  commandSocket = io.connect( 'nao.fgcu.edu:8080/Command', {
    'reconnect' : true,
    'reconnection delay' : 500,
  } );
  positionSocket = io.connect( 'nao.fgcu.edu:8080/JointPosition', {
    'reconnect' : true,
    'reconnection delay' : 500,
  } );
  console.log( 'starting execution' );
  commandSocket.on( 'status', execution_status );
  positionSocket.on( 'positionUpdate', update_joint_position );
  console.log( 'execution startes' );
}

function stop_execution() {

  commandSocket.removeListener( 'status', execution_status );
  positionSocket.removeListener( 'positionUpdate', update_joint_position );
}

function execution_status( data ) {

  $( $( '#modes' ).attr( 'data-mode' ) + '-Execution-Text' ).append(
      data + '<br/>&gt;&gt;' );
}

function update_joint_position( data ) {

  jointsran = [
      [
          'heady', -2.0857, 2.0857, 100
      ], [
          'headp', -0.6720, 0.6720, 100
      ], [
          'lshlp', -2.0857, 2.0857, 100
      ], [
          'lshlr', -0.3142, 1.3265, 100
      ], [
          'lelby', -2.0857, 2.0857, 100
      ], [
          'lelbr', -1.5446, -0.0349, 100
      ], [
          'lwriy', -1.8238, 1.8238, 100
      ],
      // ['lhand',-1,1,100],
      [
          'rshlp', -2.0857, 2.0857, 100
      ], [
          'rshlr', -0.3142, 1.3265, 100
      ], [
          'relby', -2.0857, 2.0857, 100
      ], [
          'relbr', -1.5446, -0.0349, 100
      ], [
          'rwriy', -1.8238, 1.8238, 100
      ],
  // ['rhand',-1,1,100]
  ];
  // console.log( data );
  for( var joint in data ) {
    var jointpos = data[joint];
    var jointran = jointsran[joint];
    // console.log( jointran[0] + ': ' + jointpos );
    jointpos = Math.floor( jointran[3] * ( jointpos - jointran[1] )
        / ( jointran[2] - jointran[1] ) );
    // console.log(jointpos);
    $( '#' + jointran[0] + '-show' ).attr( 'value', jointpos );
    var edit = $( '#' + jointran[0] + '-edit' );
    if( edit.attr('data-edited') == 'false' )
      edit.attr( 'value', jointpos );
  }
}

function command_joint_position( joint, position ) {

  window.setTimeout( function() {

    commandSocket.emit( 'movejoint', joint + ',' + position )
  }, 2000 );
}

function resubscribe_join_position() {

  socket.emit( 'JointPosition', 'subscribe' );
}

function subscribe_join_position() {

  socket.emit( 'JointPosition', 'subscribe' );
  socket.on( 'JointPositionExpired', resubscribe_join_position );
}

function resubscribe_camera() {

  socket.emit( 'Camera', 'subscribe' );
}

function subscribe_camera() {

  socket.emit( 'Camera', 'subscribe' );
  socket.on( 'JointPositionExpired', resubscribe_camera );
}
