function get_joints_list() {

  var jl = {
    headp : [
        'Head Pitch <- Up Down ->', 1
    ],
    heady : [
        'Head Yaw <- Left Right ->', 0
    ],
    rshlr : [
        'Right Shoulder Roll <- In Out ->', 8
    ],
    rshlp : [
        'Right Shoulder Pitch <- Up Down ->', 7
    ],
    relbr : [
        'Right Elbow Roll <- Closed Open ->', 10
    ],
    relby : [
        'Right Elbow Yaw <- Up Down ->', 9
    ],
    rwriy : [
        'Right Wrist Yaw <- Counter-Clockwise Clockwise ->', 11
    ],
    rhand : [
        'Right Hand', 13
    ],
    lshlr : [
        'Left Shoulder Roll <- In Out ->', 3
    ],
    lshlp : [
        'Left Shoulder Pitch <- Up Down ->', 2
    ],
    lelbr : [
        'Left Elbow Roll <- Closed Open ->', 5
    ],
    lelby : [
        'Left Elbow Yaw <- Up Down ->', 4
    ],
    lwriy : [
        'Left Wrist Yaw <- Counter-Clockwise Clockwise ->', 6
    ],
    lhand : [
        'Left Hand', 12
    ]
  };
  return jl;
}
function get_joint_ranges() {

  var jr = [
      [
          'HeadYaw', 2.0857, -2.0857, 1000, 'heady'
      ], [
          'HeadPitch', -0.6720, 0.6720, 1000, 'headp'
      ], [
          'LShoulderPitch', -2.0857, 2.0857, 1000, 'lshlp'
      ], [
          'LShoulderRoll', -0.3142, 1.3265, 1000, 'lshlr'
      ], [
          'LElbowYaw', -2.0857, 2.0857, 1000, 'lelby'
      ], [
          'LElbowRoll', -1.5446, -0.0349, 1000, 'lelbr'
      ], [
          'LWristYaw', -1.8238, 1.8238, 1000, 'lwriy'
      ], [
          'RShoulderPitch', -2.0857, 2.0857, 1000, 'rshlp'
      ], [
          'RShoulderRoll', 0.3142, -1.3265, 1000, 'rshlr'
      ], [
          'RElbowYaw', -2.0857, 2.0857, 1000, 'relby'
      ], [
          'RElbowRoll', 0.0349, 1.5446, 1000, 'reblr'
      ], [
          'RWristYaw', -1.8238, 1.8238, 1000, 'rwriy'
      ], [
          'LHand', 0, 1, 1, 'lhand'
      ], [
          'RHand', 0, 1, 1, 'rhand'
      ]
  ];
  return jr;
}
function get_joint_range( i ) {

  if( i == -1 )
    return null;
  else if( i > 13 )
    return null;
  else
    return get_joint_ranges()[i];
}
function get_joint_name( i ) {

  if( i == -1 )
    return null;
  else if( i > 13 )
    return null;
  else
    return get_joint_ranges()[i][0];
}