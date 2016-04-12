$(document).ready(function () {

var labels = ['Demo','Exercise','Assignment'];
console.log(labels);
$('#modes').append('<p class="html-variable" id="current-mode"></p>');
for( var l in labels ) {
  console.log(labels[l]);
  $('#tab-labels').append('<a class="tab-label" data-mode="'+labels[l]+'">'+labels[l]+'</a>');
  $('<article class="mode" id="'+labels[l]+'-Mode"><h2>'+labels[l]+' Mode</h2></article>').insertBefore('#mode-insertion-point');
}
set_mode('Exercise');
$('#tab-labels .tab-label').each(function () {
  $(this).click(function() {
    set_mode($(this).attr('data-mode'));
  });
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
  $('#nao-joints-show').append('<input type="range" class="show-slide" name="'+j+'-show" id="'+j+'-show" value="'+Math.floor(Math.random() * 101)+'" min="0" max="100">');
  $('#nao-joints-show').append('<br/>');
  $('#nao-joints-edit').append('<label class="edit-slide-label" for="'+j+'-show">'+joint+'</label>');
  $('#nao-joints-edit').append('<br/>');
  $('#nao-joints-edit').append('<input type="range" class="edit-slide" name="'+j+'-edit" id="'+j+'-edit" value="'+Math.floor(Math.random() * 101)+'" min="0" max="100">');
  $('#nao-joints-edit').append('<br/>');
}

});

function set_mode(mode) {
  var p_mode = $('#current-mode').text();
  if( p_mode == 'Demo' ) {
    $('#nao-joints-edit').css('display','block');
  }
  else if( mode == 'Exercise' ) {
  }
  else if( mode == 'Assignment' ) {
  }
  $('.mode').css('display','none');
  $('#'+mode+'-Mode').css('display','block');
  $('#current-mode').text(mode);
  if( mode == 'Demo' ) {
    $('#nao-joints-edit').css('display','none');
  }
  else if( mode == 'Exercise' ) {
  }
  else if( mode == 'Assignment' ) {
  }
}
