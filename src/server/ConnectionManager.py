#### https://github.com/abourget/gevent-socketio

from gevent import monkey; monkey.patch_all()
import gevent
import psutil

from socketio import socketio_manage
from socketio.server import SocketIOServer
from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin


#### Socket IO communication between Python and webpage's Javascript
#### New instance for each connected client
class CameraNamespace(BaseNamespace, BroadcastMixin):

    subscribed = False
    updateRate = 100

    # Runs on connection from new client
    def recv_connect(self):
        def sendimage():
            while True:
                if subscribed:
                    ## TODO send camera image
                gevent.sleep(updateRate)
        self.spawn(sendimage)
        
    def on_subscribe(self, msg):
        subscibed = true

    def on_unsubscribe(self, msg):
        subscribed = false

class JointPositionNamespace(BaseNamespace, BroadcastMixin):

    JointNames = []
    JointSubscriptions = []
    updateRate = 100

    # Runs on connection from new client
    def recv_connect(self):
        def sendimage():
            while True:
                ## TODO Check for subscriptions and send current joint values
                gevent.sleep(updateRate)
        self.spawn(sendimage)
        
    def on_subscribe(self, msg):
        ## TODO Check for msg in JointNames
        ## Set appropriate JointSubscriptions[] to true

    def on_unsubscribe(self, msg):
        ## TODO Check for msg in JointNames
        ## Set appropriate JointSubscriptions[] to false

class CommandNamespace(BaseNamespace, BroadcastMixin):

    lastCommand = ""

    # Runs on connection from new client
    def recv_connect(self):
        ##
        
    def on_verify(self, msg):
        ## TODO Run command/script through interpreter to see if it is valid

    def on_execute(self, msg):
        ## TODO Run command/script through interpreter. If it verifies, execute the script

    def on_execute_last(self, msg):
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
    SocketIOServer(('0.0.0.0', 80), Application(),
        resource="socket.io", policy_server=True,
        policy_listener=('0.0.0.0', 10843)).serve_forever()

    ## Socket IO Server blocks here forever unless there is an exception

    print "SocketIO Server has stopped. Exiting."