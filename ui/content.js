$(document).ready(function () {

var modes = ['Demo','Exercise','Assignment'];
console.log(modes);
$('#modes').attr('data-mode','None');
for( var l in modes ) {
  console.log(modes[l]);
  //$('#tab-labels').append('<a class="tab-label" data-mode="'+labels[l]+'">'+labels[l]+'</a>');
  $('<article class="mode" id="'+modes[l]+'-Mode" data-mode="'+modes[l]+'"><heading class="title-bar"><div class="tab-label" data-mode="'+modes[l]+'" data-mode-action="set"><h2>'+modes[l]+' Mode</h2></div><img class="mode-exit" data-mode="'+modes[l]+'" src="back.png"></heading><div class="mode-container"><main class="mode-main"></main></div></article>').insertBefore('#mode-insertion-point');
}
$('.mode .tab-label').each(function () {
  $(this).click(function() {
    if( $(this).attr('data-mode-action') == 'set' ) {
      //set_mode($(this).attr('data-mode'));
      $(this).attr('data-mode-action','none');
      window.location.hash = '#' + $(this).attr('data-mode');
    }
    else if( $(this).attr('data-mode-action') == 'unset' ) {
      set_mode('None');
      $(this).attr('data-mode-action','set');
    }
  });
});
$('.mode-exit').click(function() {
  //set_mode('None');
  window.location.hash = '#None';
  $('.tab-label[data-mode='+$(this).attr('data-mode')+']').attr('data-mode-action','set');
});

fillDemo();
fillExercise();
fillAssignment();

var joints = {
  headp: 'Head Pitch', heady: 'Head Yaw',
  rshlr: 'Right Shoulder Roll', rshlp: 'Right Shoulder Pitch',
  relbr: 'Right Elbow Roll', relby: 'Right Elbow Yaw',
  rwriy: 'Right Wrist Yaw', rhand: 'Right Hand',
  lshlr: 'Left Shoulder Roll', lshlp: 'Left Shoulder Pitch',
  lelbr: 'Left Elbow Roll', lelby: 'Left Elbow Yaw',
  lwriy: 'Left Wrist Yaw', lhand: 'Left Hand',
};
for( var j in joints ) {
  console.log(j);
  var joint = joints[j];
  console.log(joint);
  $('#nao-joints-show').append('<label class="show-slide-label" for="'+j+'-show">'+joint+'</label>');
  $('#nao-joints-show').append('<br/>');
  $('#nao-joints-show').append('<input type="range" data-joint-name="'+j+'" class="show-slide" name="'+j+'-show" id="'+j+'-show" value="'+Math.floor(Math.random() * 101)+'" min="0" max="100" readonly>');
  $('#nao-joints-show').append('<br/>');
  $('#nao-joints-edit').append('<label class="edit-slide-label" for="'+j+'-show">'+joint+'</label>');
  $('#nao-joints-edit').append('<br/>');
  $('#nao-joints-edit').append('<input type="range" data-joint-name="'+j+'" class="edit-slide" name="'+j+'-edit" id="'+j+'-edit" value="'+Math.floor(Math.random() * 101)+'" min="0" max="100">');
  $('#nao-joints-edit').append('<br/>');
}

$('.show-slide').each(function() {
  $(this).mouseenter(function() {
    $('#nao-diagram-img').attr('src','nao_joints_'+$(this).attr('data-joint-name')+'.jpg');
  });
  $(this).mouseleave(function() {
    $('#nao-diagram-img').attr('src','nao_joints_none.jpg');
  });
});
$('.edit-slide').each(function() {
  $(this).mouseenter(function() {
    $('#nao-diagram-img').attr('src','nao_joints_'+$(this).attr('data-joint-name')+'.jpg');
  });
  $(this).mouseleave(function() {
    $('#nao-diagram-img').attr('src','nao_joints_none.jpg');
  });
});

$(window).hashchange(function() {
  var mode = window.location.hash.substr(1);
  if( mode == "" )
    window.location.hash = '#None'
  else
    set_mode(mode);
});
$(window).hashchange();

});

function set_mode(mode) {
  var p_mode = $('#modes').attr('data-mode');
  console.log(p_mode+' to '+mode);
  if( p_mode != mode ) {
    var dur = 1500;
    if( p_mode == 'None' ) {
      $('#modes').animate({
        'flex-grow': '1'
      },{
        duration: dur
      });
      $('#nao-joints').animate({
        'width': '40%'
      },{
        duration: dur,
        queue: false,
        start: function() {
          $(this).css('display','flex');
        },
        complete: function() {
          $('#nao-joints h2').css('display','block');
          $('#nao-joints .inner').css('display','flex');
        }
      });
      $('#'+mode+'-Mode').animate({
        'width': '100%',
        'height': '100%',
        'margin': '0'
      },{
        duration: dur,
        queue: false,
        complete: function() {
          $('#'+mode+'-Mode .mode-main').css('display','block');
        }
      });
      $('#'+mode+'-Mode .mode-exit').fadeIn({
        duration: dur,
        queue: false
      });
      $('.mode').each(function () {
        if( $(this).attr('data-mode') != mode ) {
          $('#'+$(this).attr('data-mode')+'-Mode .tab-label h2').hide();
          $(this).animate({
            'width': '0',
            'height': '0',
            'margin': '0'
          },{
            duration: dur,
            queue: false,
            complete: function() {
              $(this).css({
                'display': 'none'
              });
            }
          });
        }
      });
    }
    else if( mode == 'None' ) {
      $('#modes').animate({
        'flex-grow': '0',
        'padding': '.2em'
      },{
        duration: dur
      });
      $('#nao-joints').animate({
        'width': '0'
      },{
        duration: dur,
        queue: false,
        start: function() {
          $('#nao-joints h2').css('display','none');
          $('#nao-joints .inner').css('display','none');
        },
        complete: function() {
          $(this).css('display','none');
        }
      });
      $('#'+p_mode+'-Mode').animate({
        'width': '3.5in',
        'height': '3em',
        'margin': '.5in',
      },{
        duration: dur,
        queue: false,
        start: function() {
          $('#'+p_mode+'-Mode .mode-main').css('display','none');
        }
      });
      $('#'+p_mode+'-Mode .mode-exit').fadeOut({
        duration: dur,
        queue: false
      });
      $('.mode').each(function () {
        if( $(this).attr('data-mode') != mode )
          $(this).css({
            'display': 'flex'
          }).animate({
            'width': '3.5in',
            'height': '3em',
            'margin': '.5in'
          },{
            duration: dur,
            queue: false,
            complete: function() {
              $('#'+$(this).attr('data-mode')+'-Mode .tab-label h2').show();
            }
          });
      });
    }
    else {
      $('#'+p_mode+'-Mode .tab-label h2').css('display','none');
      $('#'+p_mode+'-Mode').animate({
        'width': '0',
        'height': '0',
        'margin': '0',
      },{
        duration: dur,
        start: function() {
          $('#'+p_mode+'-Mode .mode-main').css('display','none');
        },
        complete: function() {
          $(this).css({
            'display': 'none'
          });
        }
      });
      $('#'+p_mode+'-Mode .mode-exit').fadeOut({
        duration: dur,
        queue: false
      });
      $('#'+mode+'-Mode .tab-label h2').css('display','block');
      $('#'+mode+'-Mode').css('display','flex');
      $('#'+mode+'-Mode').animate({
        'width': '100%',
        'height': '100%',
        'margin': '0'
      },{
        duration: dur,
        queue: false,
        complete: function() {
          $('#'+mode+'-Mode .mode-main').css('display','block');
        }
      });
      $('#'+mode+'-Mode .mode-exit').fadeIn({
        duration: dur,
        queue: false
      });
    }
    $('#modes').attr('data-mode',mode);
    if( mode == 'Exercise' )
      $('#nao-joints-edit').css('display','block');
    else
      $('#nao-joints-edit').css('display','none');
  }
}

function fillDemo() {
  var mode = $('#Demo-Mode');
  var main = $('#Demo-Mode .mode-main');
  main.append('<p>In Demo mode, you can select one one the demos below to run on the NAO. Status messages we be displayed in the Execution section and the current position of all the joints are shown in the sliders to the left.</p>');
  addSelection(main,'Demo','Demos');
  main.append('<div class="spacer"></div>');
  addExecution(main,'Demo');
}

function fillExercise() {
  var mode = $('#Exercise-Mode');
  var main = $('#Exercise-Mode .mode-main');
  main.append('<p>In Exercise mode, you can enter commands to control the NAO. Status messages we be displayed in the Execution section and the current position of all the joints are shown in the sliders to the left.  You can also control the joints with the white sliders.</p>');
  addEntry(main,'Exercise');
  main.append('<div class="spacer"></div>');
  addExecution(main,'Exercise');
}

function fillAssignment() {
  var mode = $('#Assignment-Mode');
  var main = $('#Assignment-Mode .mode-main');
  main.append('<p>In Assignment mode, you can select one one the scripts below to run on the NAO. You can view, create, edit and upload scripts. Status messages we be displayed in the Execution section and the current position of all the joints are shown in the sliders to the left.  You can also control the joints with the white sliders.</p>');
  addSelection(main,'Assignment','Scripts');
  main.append('<div class="spacer"></div>');
  addExecution(main,'Assignment');
}

function addSelection(main,mode,types) {
  selection = $('<section id="'+mode+'-Selection"></section>');
  selection.append('<h2>Available '+types+'</h2>');
  main.append(selection);
}

function addExecution(main,mode) {
  execution = $('<section id="'+mode+'-Execution"></section>');
  execution.append('<h2>Execution</h2>');
  execution.append('<code class="execution-text" id="'+mode+'-Execution-Text">&gt;&gt;</code>');
  main.append(execution);
}

function addEntry(main,mode) {
  entry = $('<section id="'+mode+'-Entry"></section>');
  entry.append('<h2>Command Prompt</h2>');
  prompt = $('<form></form>');
  prompt.append('<input class="entry-prompt" style="width: 100%;" id="'+mode+'-Entry-Prompt" type="text"/>');
  entry.append(prompt);
  main.append(entry);
}
