$(document).ready(function () {

var labels = ['Demo','Exercise','Assignment'];
console.log(labels);
$('#modes').attr('data-mode','None');
for( var l in labels ) {
  console.log(labels[l]);
  //$('#tab-labels').append('<a class="tab-label" data-mode="'+labels[l]+'">'+labels[l]+'</a>');
  $('<article class="mode" id="'+labels[l]+'-Mode" data-mode="'+labels[l]+'"><div class="title-bar"><div class="tab-label" data-mode="'+labels[l]+'" data-mode-action="set"><h2>'+labels[l]+' Mode</h2></div><img class="mode-exit" data-mode="'+labels[l]+'" src="exit.gif"></div><main class="mode-main"></main></article>').insertBefore('#mode-insertion-point');
}
$('.mode .tab-label').each(function () {
  $(this).click(function() {
    if( $(this).attr('data-mode-action') == 'set' ) {
      set_mode($(this).attr('data-mode'));
      $(this).attr('data-mode-action','none');
    }
    else if( $(this).attr('data-mode-action') == 'unset' ) {
      set_mode('None');
      $(this).attr('data-mode-action','set');
    }
  });
});
$('.mode-exit').click(function() {
  set_mode('None');
  $('.tab-label[data-mode='+$(this).attr('data-mode')+']').attr('data-mode-action','set');
});

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
  $('#nao-joints-show').append('<input type="range" data-joint-name="'+j+'" class="show-slide" name="'+j+'-show" id="'+j+'-show" value="'+Math.floor(Math.random() * 101)+'" min="0" max="100">');
  $('#nao-joints-show').append('<br/>');
  $('#nao-joints-edit').append('<label class="edit-slide-label" for="'+j+'-show">'+joint+'</label>');
  $('#nao-joints-edit').append('<br/>');
  $('#nao-joints-edit').append('<input type="range" data-joint-name="'+j+'" class="edit-slide" name="'+j+'-edit" id="'+j+'-edit" value="'+Math.floor(Math.random() * 101)+'" min="0" max="100">');
  $('#nao-joints-edit').append('<br/>');
}

$('.edit-slide').each(function() {
  $(this).mouseenter(function() {
    $('#nao-diagram-img').attr('src','nao_joints_'+$(this).attr('data-joint-name')+'.jpg');
  });
  $(this).mouseleave(function() {
    $('#nao-diagram-img').attr('src','nao_joints_none.jpg');
  });
});

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
        queue: false
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
      $('#'+mode+'-Mode').an
      $('#'+p_mode+'-Mode').animate({
        'width': '3.5in',
        'height': '3em',
        'margin': '.5in',
      },{
        duration: dur,
        queue: false
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
    }
    $('#modes').attr('data-mode',mode);
  }
}
