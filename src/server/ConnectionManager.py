#### https://github.com/abourget/gevent-socketio

import gevent

from socketio import socketio_manage
from socketio.server import SocketIOServer
from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin


#### Socket IO communication between Python and webpage's Javascript
#### New instance for each connected client
class CameraNamespace(BaseNamespace, BroadcastMixin):

    self.subscribed = False
    self.updateRate = 100

    # Runs on connection from new client
    def recv_connect(self):
        self.imageHandler = ImageHandler()

        def sendimage():
                if self.subscribed:
                    self.emit("image", self.imageHandler.getLatestFrame())
                self.timer = Timer(updateRate, sendimage())

        self.spawn(sendimage)

    def on_subscribe(self, msg):
        self.subscibed = true
        self.updateRate = 1.0/msg

    def on_unsubscribe(self, msg):
        self.subscribed = false


class JointPositionNamespace(BaseNamespace, BroadcastMixin):

    self.JointNames = []
    self.JointSubscriptions = []
    self.updateRate = 100

    # Runs on connection from new client
    #def recv_connect(self):

        
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
    # Start Socket IO Server
    print 'Listening on port http://0.0.0.0:80 and on port 10843 (flash policy server)'
    SocketIOServer(('0.0.0.0', 8080), Application(),
        resource="socket.io", policy_server=True,
        policy_listener=('0.0.0.0', 10843)).serve_forever()

    ## Socket IO Server blocks here forever unless there is an exception

    print "SocketIO Server has stopped. Exiting."