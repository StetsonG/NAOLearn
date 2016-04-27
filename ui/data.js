function get_joints_list() {

  var jl = {
    headp : [
        'Head Pitch', 1
    ],
    heady : [
        'Head Yaw', 0
    ],
    rshlr : [
        'Right Shoulder Roll', 8
    ],
    rshlp : [
        'Right Shoulder Pitch', 7
    ],
    relbr : [
        'Right Elbow Roll', 10
    ],
    relby : [
        'Right Elbow Yaw', 9
    ],
    rwriy : [
        'Right Wrist Yaw', 11
    ],
    rhand : [
        'Right Hand', -1
    ],
    lshlr : [
        'Left Shoulder Roll', 3
    ],
    lshlp : [
        'Left Shoulder Pitch', 2
    ],
    lelbr : [
        'Left Elbow Roll', 5
    ],
    lelby : [
        'Left Elbow Yaw', 4
    ],
    lwriy : [
        'Left Wrist Yaw', 6
    ],
    lhand : [
        'Left Hand', -1
    ]
  };
  return jl;
}
function get_joint_ranges() {

  var jr = [
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
  return jr;
}
function get_joint_range(i) {
  if( i == -1 )
    return null;
  else if( i > 11 )
    return null;
  else
    return get_joint_ranges()[i];
}