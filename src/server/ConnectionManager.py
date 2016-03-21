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
class NAOLearnNamespace(BaseNamespace, BroadcastMixin):
    # Runs on connection from new client
    def recv_connect(self):
        ## TODO
        
    def on_camera(self, msg):
        ## TODO Subscribe, Unsubscribe, Send Images

    def on_jointposition(self, msg):
        ## TODO Subscribe, Unsubscribe, Send Joint Positions

    def on_movement(self, msg):
        ## TODO execute movement, return result

    def on_script(self, msg):
        ## TODO Check script, execute if ok, return result




#### Web server to direct incoming connections
class Application(object):
    def __init__(self):
        self.buffer = []

    def __call__(self, environ, start_response):
        path = environ['PATH_INFO'].strip('/') or 'index.html'


        if path.startswith("socket.io"):
            socketio_manage(environ, {'/NAOLearn': NAOLearnNamespace})
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
        policy_listener=('0.0.0.0', 10843)).start()

    #### Main Loop Goes Here
        
    print "Complete"