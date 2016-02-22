from gevent import monkey; monkey.patch_all()
import gevent
import psutil

from socketio import socketio_manage
from socketio.server import SocketIOServer
from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin

import modbus_tk
import modbus_tk.defines as cst
import modbus_tk.modbus_tcp as modbus_tcp
import time

modbus_ip = '69.88.163.27'
#modbus_ip = '192.168.2.200'

pumpswitch = 0
value = 0
master = None
updateRate = 0.1

#### Socket IO communication between Python and webpage's Javascript
class ValueNamespace(BaseNamespace, BroadcastMixin):
    # Continually transmit value on cpu channel
    def recv_connect(self):
        def sendvalue():
            while True:
                self.emit('speed', value)
                self.emit('switch', pumpswitch)
                gevent.sleep(updateRate)
        self.spawn(sendvalue)
        
    # Respond to 'set' event by attempting to write the entered value to modbus device   
    def on_set(self, msg):
        if master != None:
            try: 
                i = int(msg)
                print "Writing value: " + str(i)
                master.execute(1, cst.WRITE_SINGLE_REGISTER, 0, output_value=i)
            except modbus_tk.modbus.ModbusError, e:
                print "Modbus error ", e.get_exception_code()
            
            except Exception, e2:
                print "Error ", str(e2)

#### Web server to host the web page on port 80        
class Application(object):
    def __init__(self):
        self.buffer = []

    def __call__(self, environ, start_response):
        path = environ['PATH_INFO'].strip('/') or 'index.html'

        if path.startswith('static/') or path == 'index.html':
            try:
                data = open(path).read()
            except Exception:
                return not_found(start_response)

            if path.endswith(".js"):
                content_type = "text/javascript"
            elif path.endswith(".css"):
                content_type = "text/css"
            elif path.endswith(".swf"):
                content_type = "application/x-shockwave-flash"
            else:
                content_type = "text/html"

            start_response('200 OK', [('Content-Type', content_type)])
            return [data]

        if path.startswith("socket.io"):
            socketio_manage(environ, {'/value': ValueNamespace})
        else:
            return not_found(start_response)


def not_found(start_response):
    start_response('404 Not Found', [])
    return ['<h1>Not Found</h1>']


#### Main application loop
#### Connects to Modbus TCP device and continually reads data
if __name__ == '__main__':
    # Start Socket IO Server
    print 'Listening on port http://0.0.0.0:8080 and on port 10843 (flash policy server)'
    SocketIOServer(('0.0.0.0', 80), Application(),
        resource="socket.io", policy_server=True,
        policy_listener=('0.0.0.0', 10843)).start()

    # Connect to Industrial Controller at modbus_ip on port 502
    try:
        print "Connecting to Modbus TCP device at " + modbus_ip + ":502"
        master = modbus_tcp.TcpMaster(modbus_ip)
        master.set_timeout(3.0)
    
        # Continually read all Modbus variables at a fixed rate
        while True:
            try:
                # Read a single register at address 00001 from the remote device
                read = master.execute(1, cst.READ_HOLDING_REGISTERS, 00001, 1)
                value = read[0]
                # Read a single coil at address 00000 from the remote device
                read = master.execute(1, cst.READ_COILS, 0, 1)
                pumpswitch = read[0]
                
            except modbus_tk.modbus.ModbusError, e:
                print "Modbus error ", e.get_exception_code()
                
            except Exception, e2:
                print "Error ", str(e2)
            
            # Wait
            time.sleep(updateRate)
            
            
    except modbus_tk.modbus.ModbusError, e:
        print "Modbus error ", e.get_exception_code()
    
    except Exception, e2:
        print "Error ", str(e2)
        
    print "Complete"