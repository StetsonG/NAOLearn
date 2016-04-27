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
  imageSocket = io.connect( 'nao.fgcu.edu:8080/Camera', {
    'reconnect' : true,
    'reconnection delay' : 500,
  } );
  console.log( 'starting execution' );
  commandSocket.on( 'status', execution_status );
  positionSocket.on( 'positionUpdate', update_joint_position );
  imageSocket.on( 'image', update_image );
  console.log( 'execution startes' );
}

function update_image( data ) {

  // console.log("Image Received");
  $( "#nao-camera img" ).attr( 'src', 'data:image/jpg;base64,' + data );
}

function stop_execution() {

  commandSocket.removeListener( 'status', execution_status );
  positionSocket.removeListener( 'positionUpdate', update_joint_position );
  imageSocket.removeListener( 'image', update_image );
  commandSocket.disconnect();
  positionSocket.disconnect();
  imageSocket.disconnect();
}

function execution_status( data ) {

  $( '#' + $( '#modes' ).attr( 'data-mode' ) + '-Execution-Text' ).append(
      data + '<br/>&gt;&gt;' );
  console.log( data );
}

function update_joint_position( data ) {

  // console.log( data );
  for( var joint in data ) {
    if( joint < 12 ) {
      var jointpos = data[joint];
      var jointran = get_joint_range( joint );
      jointpos = Math.floor( jointran[3] * ( jointpos - jointran[1] )
          / ( jointran[2] - jointran[1] ) );
      $( '#' + jointran[4] + '-show' ).val( jointpos );
      var edit = $( '#' + jointran[4] + '-edit' );
      if( edit.attr( 'data-edited' ) == 'false' )
        edit.val( jointpos );
      // console.log( jointran[0] + ": " + jointpos );
    }
  }
}

function command_joint_position( joint, position ) {

  window.setTimeout( function() {

    if( joint < 12 )
      commandSocket
          .emit( 'movejoint', get_joint_name( joint ) + ',' + position );
    else
      commandSocket.emit( 'simplescript', ( position == 0 ? 'open' : 'close' )
          + ' ' + get_joint_name( joint ) );
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

function send_command( text ) {

  console.log( text );
  commandSocket.emit( 'simplescript', text );
}