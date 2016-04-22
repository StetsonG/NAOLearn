#### https://github.com/abourget/gevent-socketio

import gevent

from socketio import socketio_manage
from socketio.server import SocketIOServer
from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin

from threading import Timer
import time

from ImageHandler import ImageHandler
from MotionController import MotionController

motionController = None
imageHandler = None

#### Socket IO communication between Python and webpage's Javascript
#### New instance for each connected client
class CameraNamespace(BaseNamespace, BroadcastMixin):


    # Runs on connection from new client
    def recv_connect(self):
        self.subscribed = True
        self.framerate = 0.5
        print "Camera channel connected"
        self.emit('image', "Test!")
        def sendimage():
                while self.subscribed:
                    frame = imageHandler.getLatestFrame()
                    self.emit("image", frame)
                    print("sending: ", frame)
                    time.sleep(1.0/self.framerate)
        self.spawn(sendimage)

    def on_subscribe(self, msg):
        self.subscibed = true
        self.framerate = msg

    def on_unsubscribe(self, msg):
        self.subscribed = false


class JointPositionNamespace(BaseNamespace, BroadcastMixin):

    JointNames = [
        'HeadYaw', 
        'HeadPitch', 
        'LShoulderPitch', 
        'LShoulderRoll', 
        'LElbowYaw', 
        'LElbowRoll', 
        'LWristYaw',
        'RShoulderPitch',
        'RShoulderRoll',
        'RElbowYaw',
        'RWristYaw']
    JointSubscriptions = []
    updateRate = 100

    # Runs on connection from new client
    def recv_connect(self):
        self.subscribed = True

        print "JointPosition channel connected"
        def sendPositions():
            while self.subscribed:
                self.emit('positions', motionController.getAllJointAngles())
                time.sleep(0.5)

        self.spawn(sendPositions)

        
    #def on_subscribe(self, msg):
        ## TODO Check for msg in JointNames
        ## Set appropriate JointSubscriptions[] to true

    #def on_unsubscribe(self, msg):
        ## TODO Check for msg in JointNames
        ## Set appropriate JointSubscriptions[] to false

class CommandNamespace(BaseNamespace, BroadcastMixin):

    lastCommand = ""

    # Runs on connection from new client
    #def recv_connect(self):
        ##
        
    #def on_verify(self, msg):
        ## TODO Run command/script through interpreter to see if it is valid

    #def on_execute(self, msg):
        ## TODO Run command/script through interpreter. If it verifies, execute the script

    #def on_execute_last(self, msg):
        ## TODO Run last received command/script through interpreter. If it verifies, execute the script

    def on_movejoint(self, msg):
        try: 
            msg = [x.strip() for x in msg.split(',')]
            motionController.setJointAngle(msg[0], float(msg[1]))
            self.emit('status', "MoveJoint Command Succeeded")
        except:
            self.emit('status', "MoveJoint Command Failed")

    def on_openhand(self, msg):
        motionController.openHand(msg)

    def on_closehand(self, msg):
        motionController.closeHand(msg)



#### Web server to direct incoming connections
#### Defines /NAOLearn namespace for NAOLearn communication
class Application(object):
    def __init__(self):
        self.buffer = []

    def __call__(self, environ, start_response):
        path = environ['PATH_INFO'].strip('/') or 'index.html'


        if path.startswith("socket.io"):
            socketio_manage(environ, {'/Camera': CameraNamespace})
            socketio_manage(environ, {'/JointPosition': JointPositionNamespace})
            socketio_manage(environ, {'/Command': CommandNamespace})
        else:
            return not_found(start_response)


def not_found(start_response):
    start_response('404 Not Found', [])
    return ['<h1>Not Found</h1>']


#### Main application loop
if __name__ == '__main__':

    imageHandler = ImageHandler()
    motionController = MotionController()

    # Start Socket IO Server
    print 'Listening on port http://0.0.0.0:8080 and on port 10843 (flash policy server)'
    SocketIOServer(('0.0.0.0', 8080), Application(),
        resource="socket.io", policy_server=True,
        policy_listener=('0.0.0.0', 10843)).serve_forever()

    ## Socket IO Server blocks here forever unless there is an exception

    print "SocketIO Server has stopped. Exiting."