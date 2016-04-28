#### https://github.com/abourget/gevent-socketio

import gevent

from socketio import socketio_manage
from socketio.server import SocketIOServer
from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin

from threading import Timer
import time
import logging

from RepeatedTimer import RepeatedTimer

from ImageHandler import ImageHandler
from MotionController import MotionController

motionController = None
imageHandler = None

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

cameraTimer = None
int numCamSubsribers = 0
jointTimer = None
int numJointSubscribers = 0


#### Socket IO communication between Python and webpage's Javascript
#### New instance for each connected client
class CameraNamespace(BaseNamespace, BroadcastMixin):


    # Runs on connection from new client
    def recv_connect(self):
        self.subscribed = True
        self.framerate = 2
        print "Camera channel connected"

        def sendImage():
            frame = imageHandler.getLatestFrame()
            self.broadcast_event("image", frame.encode('base64'))

        global cameraTimer
        if cameraTimer == None:
            print "Starting camera timer"
            cameraTimer = RepeatedTimer(1.0/self.framerate, sendImage)

    def __del__(self):
        print "Camera channel disconnected"


class JointPositionNamespace(BaseNamespace, BroadcastMixin):

    
    JointSubscriptions = []
    updateRate = 100

    # Runs on connection from new client
    def recv_connect(self):
        print "JointPosition channel connected"
        def sendPositions():
                self.emit('positionUpdate', motionController.getJointAngles(JointNames))

        global jointTimer
        if jointTimer == None:
            print "Starting joint timer"
            jointTimer = RepeatedTimer(1, sendPositions)


    def __del__(self):
        print "JointPosition channel disconnected"

class CommandNamespace(BaseNamespace, BroadcastMixin):

    def recv_connect(self):
        print "Command channel connected"

    def on_movejoint(self, msg):
        try: 
            # Strip and split msg by commas
            # valid msg format is "0,0.5" as "jointID,angle"

            msg = [x.strip() for x in msg.split(',')]

            #Convert JointName string from utf-8 to ASCII for NAOqi compatibility
            udata=msg[0].decode("utf-8")
            jointName=udata.encode("ascii","ignore")

            jointAngle = float(msg[1])

            print "setJointAngle(" + jointName + ", ", jointAngle, ")"
            motionController.setJointAngle(jointName, jointAngle)

            self.emit('status', "MoveJoint Command Succeeded")
        except Exception as e:
            self.emit('status', "MoveJoint Command Failed: ", str(e))

    def on_openhand(self, msg):
        try:
            #Convert JointName string from utf-8 to ASCII for NAOqi compatibility
            udata=msg.decode("utf-8")
            asciidata=udata.encode("ascii","ignore")

            motionController.openHand(asciidata)
            self.emit('status', "OpenHand Command Succeeded")
        except Exception as e:
            self.emit('status', "OpenHand Command Failed: ", str(e))


    def on_closehand(self, msg):
        try:
            #Convert JointName string from utf-8 to ASCII for NAOqi compatibility
            udata=msg.decode("utf-8")
            asciidata=udata.encode("ascii","ignore")

            motionController.closeHand(asciidata)
            self.emit('status', "OpenHand Command Succeeded")
        except Exception as e:
            self.emit('status', "OpenHand Command Failed: ", str(e))

    def on_simplescript(self, msg):
        try:
            print "Received Script: \n" + msg

            #Convert JointName string from utf-8 to ASCII for NAOqi compatibility
            udata=msg.decode("utf-8")
            asciidata=udata.encode("ascii","ignore")

            motionController.runSimpleScript(asciidata)
            self.emit('status', "SimpleScript Execution Succeeded")
        except Exception as e:
            self.emit('status', "SimpleScript Execution Failed: ", str(e))

    def __del__(self):
        print "Command channel disconnected"

    #def on_verify(self, msg):
        ## TODO Run command/script through interpreter to see if it is valid

    #def on_execute(self, msg):
        ## TODO Run command/script through interpreter. If it verifies, execute the script

    #def on_execute_last(self, msg):
        ## TODO Run last received command/script through interpreter. If it verifies, execute the script



#### Web server to direct incoming connections
#### Defines /NAOLearn namespace for NAOLearn communication
class Application(object):
    def __init__(self):
        self.buffer = []

    def __call__(self, environ, start_response):
        path = environ['PATH_INFO'].strip('/') or 'index.html'


        if path.startswith("socket.io"):
            socketio_manage(environ, {
                '/Camera': CameraNamespace,
                '/JointPosition': JointPositionNamespace,
                '/Command': CommandNamespace})
        else:
            return not_found(start_response)


def not_found(start_response):
    start_response('404 Not Found', [])
    return ['<h1>Not Found</h1>']


#### Main application loop
if __name__ == '__main__':

    logging.basicConfig()
    imageHandler = ImageHandler()
    motionController = MotionController()

    # Start Socket IO Server
    print 'Listening on port http://0.0.0.0:8080 and on port 10843 (flash policy server)'
    SocketIOServer(('0.0.0.0', 8080), Application(),
        resource="socket.io", policy_server=True,
        policy_listener=('0.0.0.0', 10843)).serve_forever()

    ## Socket IO Server blocks here forever unless there is an exception

    print "SocketIO Server has stopped. Exiting."