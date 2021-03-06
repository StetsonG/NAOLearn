$( document )
    .ready(
        function() {

          var modes = [
              'Demo', 'Exercise', 'Assignment'
          ];
          // console.log( modes );
          $( '#modes' ).attr( 'data-mode', 'None' );
          for( var l in modes ) {
            // console.log( modes[l] );
            // $('#tab-labels').append('<a class="tab-label"
            // data-mode="'+labels[l]+'">'+labels[l]+'</a>');
            $(
                '<article class="mode" id="'
                    + modes[l]
                    + '-Mode" data-mode="'
                    + modes[l]
                    + '"><heading class="title-bar"><div class="tab-label" data-mode="'
                    + modes[l]
                    + '" data-mode-action="set"><h2>'
                    + modes[l]
                    + ' Mode</h2></div><img class="mode-exit" data-mode="'
                    + modes[l]
                    + '" src="back.png"></heading><div class="mode-container"><main class="mode-main"></main></div></article>' )
                .insertBefore( '#mode-insertion-point' );
          }
          $( '.mode .tab-label' ).each( function() {

            $( this ).click( function() {

              if( $( this ).attr( 'data-mode-action' ) == 'set' ) {
                // set_mode($(this).attr('data-mode'));
                $( this ).attr( 'data-mode-action', 'none' );
                window.location.hash = '#' + $( this ).attr( 'data-mode' );
              }
              else if( $( this ).attr( 'data-mode-action' ) == 'unset' ) {
                set_mode( 'None' );
                $( this ).attr( 'data-mode-action', 'set' );
              }
            } );
          } );
          $( '.mode-exit' ).click(
              function() {

                // set_mode('None');
                window.location.hash = '#None';
                $(
                    '.tab-label[data-mode=' + $( this ).attr( 'data-mode' )
                        + ']' ).attr( 'data-mode-action', 'set' );
              } );
          
          fill_demo();
          fill_exercise();
          fill_assignment();
          
          var joints = get_joints_list();
          for( var j in joints ) {
            // console.log( j );
            var joint = joints[j][0];
            var jointind = joints[j][1];
            var jointran = get_joint_range( jointind );
            var state = "";
            if( jointran == null ) {
              state = "-disabled"
              jointran = [
                  'none', 0, 1, 1
              ];
            }
            else {
            }
            // console.log( joint );
            $( '#nao-joints-show' ).append(
                '<label class="show-slide-label" for="' + j + '-show">' + joint
                    + '</label>' );
            $( '#nao-joints-show' ).append( '<br/>' );
            $( '#nao-joints-show' )
                .append(
                    '<div style="display:inline-block; position:relative;"><input type="range" data-joint-name="'
                        + j
                        + '" data-joint-index="'
                        + jointind
                        + '" class="show-slide" name="'
                        + j
                        + '-show" id="'
                        + j
                        + '-show" value="0" min="0" max="'
                        + jointran[3]
                        + '"><div class="show-mask" data-joint-name="'
                        + j
                        + '" style="position:absolute; left:0; right:0; top:0; bottom:0;"></div></div>' );
            $( '#nao-joints-show' ).append( '<br/>' );
            $( '#nao-joints-edit' ).append(
                '<label class="edit-slide-label" for="' + j + '-show">' + joint
                    + '</label>' );
            $( '#nao-joints-edit' ).append( '<br/>' );
            var edit = $( '<input type="range" data-edited="false" data-joint-name="'
                + j
                + '" data-joint-index="'
                + jointind
                + '" class="edit-slide'
                + state
                + '" name="'
                + j
                + '-edit" id="'
                + j
                + '-edit" value="0" min="0" max="' + jointran[3] + '">' );
            if( jointind == -1 ) {
              var cont = $( '<div style="display:inline-block; position:relative;"></div>' );
              var mask = $( '<div class="edit-mask" data-joint-name="'
                  + j
                  + '" style="position:absolute; left:0; right:0; top:0; bottom:0;"></div>' );
              cont.append( edit );
              cont.append( mask );
              $( '#nao-joints-edit' ).append( cont );
            }
            else
              $( '#nao-joints-edit' ).append( edit );
            $( '#nao-joints-edit' ).append( '<br/>' );
          }
          
          $( '.show-mask' ).each(
              function() {

                $( this ).mouseenter(
                    function() {

                      $( '#nao-diagram-img' ).attr(
                          'src',
                          'nao_joints_' + $( this ).attr( 'data-joint-name' )
                              + '.jpg' );
                    } );
                $( this ).mouseleave( function() {

                  $( '#nao-diagram-img' ).attr( 'src', 'nao_joints_none.jpg' );
                } );
              } );
          $( '.edit-mask' ).each(
              function() {

                $( this ).mouseenter(
                    function() {

                      $( '#nao-diagram-img' ).attr(
                          'src',
                          'nao_joints_' + $( this ).attr( 'data-joint-name' )
                              + '.jpg' );
                    } );
                $( this ).mouseleave( function() {

                  $( '#nao-diagram-img' ).attr( 'src', 'nao_joints_none.jpg' );
                } );
              } );
          $( '.edit-slide' ).each(
              function() {

                $( this ).mouseenter(
                    function() {

                      $( '#nao-diagram-img' ).attr(
                          'src',
                          'nao_joints_' + $( this ).attr( 'data-joint-name' )
                              + '.jpg' );
                    } );
                $( this ).mouseleave( function() {

                  $( '#nao-diagram-img' ).attr( 'src', 'nao_joints_none.jpg' );
                } );
                $( this ).change(
                    function( event ) {

                      var jp = $( this ).val();
                      console.log( "slidestop: " + jp );
                      $( this ).attr( 'data-edited', 'true' );
                      var ji = $( this ).attr( 'data-joint-index' );
                      var jointran = get_joint_range( ji );
                      var position = jp / jointran[3]
                          * ( jointran[2] - jointran[1] ) + jointran[1];
                      console.log( "position: " + position );
                      command_joint_position( ji, position );
                    } );
              } );
          
          $( window ).hashchange( function() {

            var mode = window.location.hash.substr( 1 );
            if( mode == "" )
              window.location.hash = '#None'
            else
              set_mode( mode );
          } );
          $( window ).hashchange();
          
        } );

function set_mode( mode ) {

  var p_mode = $( '#modes' ).attr( 'data-mode' );
  // console.log( p_mode + ' to ' + mode );
  if( p_mode != mode ) {
    var dur = 1500;
    if( p_mode == 'None' ) {
      $( '#modes' ).animate( {
        'flex-grow' : '1'
      }, {
        duration : dur
      } );
      $( '#nao-joints' ).animate( {
        'width' : '40%'
      }, {
        duration : dur,
        queue : false,
        start : function() {

          $( this ).css( 'display', 'flex' );
        },
        complete : function() {

          $( '#nao-joints h2' ).css( 'display', 'block' );
          $( '#nao-joints .inner' ).css( 'display', 'flex' );
        }
      } );
      $( '#' + mode + '-Mode' ).animate( {
        'width' : '100%',
        'height' : '100%',
        'margin' : '0'
      }, {
        duration : dur,
        queue : false,
        complete : function() {

          $( '#' + mode + '-Mode .mode-main' ).css( 'display', 'block' );
        }
      } );
      $( '#' + mode + '-Mode .mode-exit' ).fadeIn( {
        duration : dur,
        queue : false
      } );
      $( '.mode' ).each(
          function() {

            if( $( this ).attr( 'data-mode' ) != mode ) {
              $( '#' + $( this ).attr( 'data-mode' ) + '-Mode .tab-label h2' )
                  .hide();
              $( this ).animate( {
                'width' : '0',
                'height' : '0',
                'margin' : '0'
              }, {
                duration : dur,
                queue : false,
                complete : function() {

                  $( this ).css( {
                    'display' : 'none'
                  } );
                }
              } );
            }
          } );
    }
    else if( mode == 'None' ) {
      $( '#modes' ).animate( {
        'flex-grow' : '0',
        'padding' : '.2em'
      }, {
        duration : dur
      } );
      $( '#nao-joints' ).animate( {
        'width' : '0'
      }, {
        duration : dur,
        queue : false,
        start : function() {

          $( '#nao-joints h2' ).css( 'display', 'none' );
          $( '#nao-joints .inner' ).css( 'display', 'none' );
        },
        complete : function() {

          $( this ).css( 'display', 'none' );
        }
      } );
      $( '#' + p_mode + '-Mode' ).animate( {
        'width' : '3.5in',
        'height' : '3em',
        'margin' : '.5in',
      }, {
        duration : dur,
        queue : false,
        start : function() {

          $( '#' + p_mode + '-Mode .mode-main' ).css( 'display', 'none' );
        }
      } );
      $( '#' + p_mode + '-Mode .mode-exit' ).fadeOut( {
        duration : dur,
        queue : false
      } );
      $( '.mode' ).each(
          function() {

            if( $( this ).attr( 'data-mode' ) != mode )
              $( this ).css( {
                'display' : 'flex'
              } ).animate(
                  {
                    'width' : '3.5in',
                    'height' : '3em',
                    'margin' : '.5in'
                  },
                  {
                    duration : dur,
                    queue : false,
                    complete : function() {

                      $(
                          '#' + $( this ).attr( 'data-mode' )
                              + '-Mode .tab-label h2' ).show();
                    }
                  } );
          } );
    }
    else {
      $( '#' + p_mode + '-Mode .tab-label h2' ).css( 'display', 'none' );
      $( '#' + p_mode + '-Mode' ).animate( {
        'width' : '0',
        'height' : '0',
        'margin' : '0',
      }, {
        duration : dur,
        start : function() {

          $( '#' + p_mode + '-Mode .mode-main' ).css( 'display', 'none' );
        },
        complete : function() {

          $( this ).css( {
            'display' : 'none'
          } );
        }
      } );
      $( '#' + p_mode + '-Mode .mode-exit' ).fadeOut( {
        duration : dur,
        queue : false
      } );
      $( '#' + mode + '-Mode .tab-label h2' ).css( 'display', 'block' );
      $( '#' + mode + '-Mode' ).css( 'display', 'flex' );
      $( '#' + mode + '-Mode' ).animate( {
        'width' : '100%',
        'height' : '100%',
        'margin' : '0'
      }, {
        duration : dur,
        queue : false,
        complete : function() {

          $( '#' + mode + '-Mode .mode-main' ).css( 'display', 'block' );
        }
      } );
      $( '#' + mode + '-Mode .mode-exit' ).fadeIn( {
        duration : dur,
        queue : false
      } );
    }
    $( '#modes' ).attr( 'data-mode', mode );
    if( mode == 'None' )
      stop_execution();
    else
      start_execution();
    if( mode == 'Exercise' ) {
      $( '#nao-joints-edit' ).css( 'display', 'block' );
    }
    else
      $( '#nao-joints-edit' ).css( 'display', 'none' );
  }
}

function fill_demo() {

  var mode = $( '#Demo-Mode' );
  var main = $( '#Demo-Mode .mode-main' );
  main
      .append( '<p>In Demo mode, you can select one one the demos below to run on the NAO. Status messages we be displayed in the Execution section and the current position of all the joints are shown in the sliders to the left.</p>' );
  add_selection( main, 'Demo', 'Demos', get_demo_list() );
  main.append( '<div class="spacer"></div>' );
  add_execution( main, 'Demo' );
}

function fill_exercise() {

  var mode = $( '#Exercise-Mode' );
  var main = $( '#Exercise-Mode .mode-main' );
  text = $( '<section class="mode-main-text"></section>' );
  text.append( '<p>In Exercise mode, you can enter commands to control the '
      + 'NAO. Status messages we be displayed in the Execution section '
      + 'and the current position of all the joints are shown in the '
      + 'sliders to the left.  You can also control the joints with the '
      + 'white sliders.</p>' );
  text.append( '<p>The available commands are: </p>' );
  var list = $( '<ul></ul>' );
  list.append( '<li>set JOINTNAME ANGLE</li>' );
  list.append( '<li>open JOINTNAME ANGLE</li>' );
  list.append( '<li>close JOINTNAME ANGLE</li>' );
  list.append( '<li>say TEXT</li>' );
  text.append( list );
  text.append( '<p>TEXT is any string and does not need to be quoted. '
      + 'ANGLE is in radians. The accepted values for JOINTNAME and '
      + 'their accepted values for ANGLE are listed below.</p>' );
  var joints = get_joint_ranges();
  var tab = $( '<table><table>' );
  tab
      .append( '<tr><th>Joint Name</th><th>Minimum Angle</th><th>Maximum Angle</th></tr>' );
  var j = 0;
  while( j < 12 ) {
    range = joints[j++ ];
    var row = $( '<tr></tr>' );
    row.append( '<td>' + range[0] + '</td>' );
    row.append( '<td>' + range[1] + '</td>' );
    row.append( '<td>' + range[2] + '</td>' );
    tab.append( row );
  }
  text.append( tab );
  main.append( text );
  add_entry( main, 'Exercise' );
  main.append( '<div class="spacer"></div>' );
  add_execution( main, 'Exercise' );
}

function fill_assignment() {

  var mode = $( '#Assignment-Mode' );
  var main = $( '#Assignment-Mode .mode-main' );
  main
      .append( '<p>In Assignment mode, you can select one one the scripts below to run on the NAO. You can view, create, edit and upload scripts. Status messages we be displayed in the Execution section and the current position of all the joints are shown in the sliders to the left.  You can also control the joints with the white sliders.</p>' );
  add_script( main, 'Assignment' );
  main.append( '<div class="spacer"></div>' );
  add_execution( main, 'Assignment' );
}

function create_demo(name) {
  var demo = $('<div class="demo-row"></div>');
  demo.append('<p>'+name+'</p>');
  run = $('<img src="play.png" width="30" height="30" />');
  run.click(function() {
    var xmlhttp = new XMLHttpRequest();
    var url = name+".sst";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            send_command(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  });
  demo.append(run);
  return demo;
}

function get_demo_list() {

  var demos = ['open-pose','clap','fgcu-band'];
  var items = [];
  for( var i in demos ) {
    items[i] = create_demo(demos[i]);
    console.log(items[i].html());
  }
  return items;
}

function add_selection( main, mode, types, items ) {

  selection = $( '<section id="' + mode + '-Selection"></section>' );
  available = $( '<h2>Available ' + types + '</h2>' );
  for( var i in items ) {
    var item = items[i];
    available.append( item );
  }
  selection.append( available );
  main.append( selection );
}

function add_execution( main, mode ) {

  execution = $( '<section id="' + mode + '-Execution"></section>' );
  execution.append( '<h2>Execution</h2>' );
  execution.append( '<code class="execution-text" id="' + mode
      + '-Execution-Text">&gt;&gt;</code>' );
  main.append( execution );
}

function add_entry( main, mode ) {

  entry = $( '<section id="' + mode + '-Entry"></section>' );
  entry.append( '<h2>Command Prompt</h2>' );
  prompt = $( '<form id="' + mode + '-Entry-Form" class="entry-form"></form>' );
  prompt.append( '<input class="entry-prompt" id="' + mode
      + '-Entry-Prompt" type="text"/>' );
  prompt.append( '<input class="entry-submit" type="submit" value="submit"/>' );
  prompt.submit( function() {

    send_command( $( '#' + mode + '-Entry-Prompt' ).val() );
    $( '#' + mode + '-Entry-Prompt' ).val( '' );
  } );
  entry.append( prompt );
  main.append( entry );
}

function add_script( main, mode ) {

  entry = $( '<section id="' + mode + '-Script"></section>' );
  entry.append( '<h2>Command Prompt</h2>' );
  prompt = $( '<form id="' + mode + '-Script-Form" class="script-form"></form>' );
  prompt.append( '<textarea class="script-prompt" id="' + mode
      + '-Script-Prompt" rows="20" cols="50" type="text"></textarea>' );
  prompt.append( '<input class="script-submit" type="submit" value="submit"/>' );
  prompt.submit( function() {

    send_command( $( '#' + mode + '-Script-Prompt' ).val() );
    $( '#' + mode + '-Script-Prompt' ).val( '' );
  } );
  entry.append( prompt );
  main.append( entry );
}
