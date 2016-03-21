from naoqi import ALProxy, ALModule, ALBroker
import time
import threading
import socket
import vision_definitions

SoundTracker = None
NAO_IP = '10.100.205.180'
IN_PORT = 3006
OUT_PORT = 3001

class ConnectionListener(threading.Thread):
    def __init__(self, tracker):
        threading.Thread.__init__(self)
        self.tracker = tracker
        self.server = tracker.server
        self.listening = False
        self.connections = []
    
    def listen(self):
        self.server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server.bind((NAO_IP, IN_PORT))
        self.server.listen(5)
    
    def run(self):
        self.listen()
        self.listening = True
        while self.listening :
            con, adr = self.server.accept()
            conthr = ConnectionThread(self.tracker, con, adr)
            self.connections.append(conthr)
            conthr.start()
    
    def remcon(self, con):
        self.connections.remove(con)
    
    def broadcast(self, msg):
        for con in self.connections :
            con.send(msg)
    
    def disconnect(self):
        self.running = False;
        for con in self.connections :
            con.running = False

class ConnectionThread(threading.Thread):
    def __init__(self, tracker, con, adr):
        threading.Thread.__init__(self)
        self.tracker = tracker
        self.con = con
        self.adr = adr
        print(str(adr))
        self.client = socket.socket()
        self.client_connected = False
    
    def recv(self):
        num = int(self.con.recv(3))
        com = self.con.recv(num)
        while len(com) < num :
            com = com + self.con.recv(num - len(com))
        return com
    
    def run(self):
        com = self.recv()
        while com != "quit" :
            print("message received: " + com)
            # self.con.send(("message received: " + com).encode('utf-8'))
            if com == "accepting" :
                adr = (self.adr[0], OUT_PORT)
                print("connecting to " + str(adr))
                self.client.connect(adr)
                self.client_connected = True
            elif com == "fetch" :
                ret = self.tracker.video.getImageRemote(self.tracker.nameID)
                self.con.send((str(ret[0])).encode('utf-8'))
                self.con.send((str(ret[1])).encode('utf-8'))
                l = len(ret[6])
                i = 0
                while i < l :
                    u = l
                    if u - i > 512 :
                        u = i + 512
                    self.con.send(ret[6][i:u])
                    i = u
            elif com == "move-left" :
                st = self.tracker.robot.getStiffnesses("Head")[0]
                self.tracker.robot.setStiffnesses("Head",1)
                self.tracker.robot.changeAngles("HeadYaw", .1, .1)
                self.tracker.robot.setStiffnesses("Head",st)
            elif com == "move-up" :
                st = self.tracker.robot.getStiffnesses("Head")[0]
                self.tracker.robot.setStiffnesses("Head",1)
                self.tracker.robot.changeAngles("HeadPitch", -.1, .1)
                self.tracker.robot.setStiffnesses("Head",st)
            elif com == "move-right" :
                st = self.tracker.robot.getStiffnesses("Head")[0]
                self.tracker.robot.setStiffnesses("Head",1)
                self.tracker.robot.changeAngles("HeadYaw", -.1, .1)
                self.tracker.robot.setStiffnesses("Head",st)
            elif com == "move-down" :
                st = self.tracker.robot.getStiffnesses("Head")[0]
                self.tracker.robot.setStiffnesses("Head",1)
                self.tracker.robot.changeAngles("HeadPitch", .1, .1)
                self.tracker.robot.setStiffnesses("Head",st)
            com = self.recv()
        com.send("disconnecting")
        con.shutdown(socket.SHUT_RDWR)
        con.close()
        self.tracker.listener.remcon(self)
    
    def send(self, msg):
        if self.client_connected :
            self.client.send(msg)

class SoundTrackerModule(ALModule) :
    def __init__(self):
        ALModule.__init__(self, "SoundTracker")
        self.modnom = "SoundTracker"
        self.tts = ALProxy("ALTextToSpeech", "lain.local", 9559)
        self.robot = ALProxy("ALMotion", "lain.local", 9559)
        self.locator = ALProxy("ALAudioSourceLocalization", "lain.local", 9559)
        self.mem = ALProxy("ALMemory", "lain.local", 9559)
        self.locmut = threading.Semaphore(0)
        self.locator.setParameter("EnergyComputation", 1)
        self.locator.setParameter("Sensibility", .95)
        self.video = ALProxy("ALVideoDevice", "lain.local", 9559)
        self.resolution = 2
        # self.colorSpace = 11
        # self.resolution = vision_definitions.kQVGA
        self.colorSpace = vision_definitions.kYUVColorSpace
        self.server = socket.socket()
        self.listener = ConnectionListener(self)
        self.nameID = self.video.subscribe("SoundTracker", self.resolution, self.colorSpace, 30)
    
    def connect(self):
        self.listener.start()
    
    def disconnect(self):
        self.listener.disconnect()
    
    def subscribe(self):
        self.send('subscribing to onSoundDetected')
        self.tts.say('subscribing to on sound detected in')
        self.tts.post.say('three')
        time.sleep(1);
        self.tts.post.say('two')
        time.sleep(1);
        self.tts.post.say('one')
        time.sleep(1);
        self.mem.subscribeToEvent("SoundDetected",
            self.modnom,
            "onSoundDetected")
        self.send('onSoundDetected subscribed')
    
    def unsubscribe(self):
        self.mem.unsubscribeToEvent("SoundDetected",
            self.modnom)
        self.send('onSoundDetected unsubscribed')
    
    def onSoundDetected(self, *_args):
        self.mem.unsubscribeToEvent("SoundDetected",
            self.modnom)
        self.send('onSoundDetected start')
        # self.tts.say('sound detected')
        
        self.send(str(_args))
        
        self.send('\tsubscribing to onSoundLocated')
        self.mem.subscribeToEvent("ALAudioSourceLocalization/SoundLocated",
            self.modnom,
            "onSoundLocated")
        self.send('\tonSoundDetected sleep')
        self.tcount = 0;
        self.loccount = 0;
        self.wakecount = 5;
        self.robot.wakeUp()
        self.locmut.release()
        while self.wakecount > 0 :
            # self.tts.say(str(self.wakecount))
            time.sleep(1)
            self.tcount = self.tcount + 1
            self.locmut.acquire()
            print("\tonSoundLocated check: (wc,lc,tc) = " + str(self.wakecount) + "," + str(self.loccount) + "," + str(self.tcount))
            if self.loccount > 0 :
                self.loccount = 0
                self.wakecount = 5
            elif self.tcount > 8 :
                self.wakecount = 0
            else :
                self.wakecount = self.wakecount - 1
            self.locmut.release()
        self.locmut.acquire()
        self.robot.rest()
        self.send('\tonSoundDetected awake')
        self.mem.unsubscribeToEvent("ALAudioSourceLocalization/SoundLocated",
            self.modnom)
        self.send('\tonSoundLocated unsubscribed')
        
        self.send('onSoundDetected end')
        self.mem.subscribeToEvent("SoundDetected",
            self.modnom,
            "onSoundDetected")
    
    def onSoundLocated(self, *_args):
        if _args[1][1][2] > .9 :
            self.locmut.acquire()
            self.mem.unsubscribeToEvent("ALAudioSourceLocalization/SoundLocated",
                self.modnom)
            self.send('\tonSoundLocated start')
            self.tts.post.say('sound located')
            self.loccount = self.loccount + 1
            
            self.send(str(_args))
            
            st = self.robot.getStiffnesses("Head")[0]
            self.robot.setStiffnesses("Head",1)
            self.robot.post.setAngles(["HeadYaw","HeadPitch"], [_args[1][1][0],_args[1][1][1]], .1)
            self.robot.setStiffnesses("Head",st)
            
            self.send("Position: " + str(self.robot.getPosition("Head", 2, True)) + "\n")
                
            self.send('\tonSoundLocated end')
            self.mem.subscribeToEvent("ALAudioSourceLocalization/SoundLocated",
                self.modnom,
                "onSoundLocated")
            self.locmut.release()
    
    def send(self, msg):
        print(msg)
        l = len(msg)
        i = 0
        while i > l :
            c = 100
            if i + c > l :
                c = l - i
            o = c
            if i + c < l :
                o = -1
            self.listener.broadcast(self.padd(str(o)))
            self.listener.broadcast(msg[i:(i + c)])
        self.listener.broadcast(msg)
    
    def padd(self, str):
        while len(str) < 3 :
            str = '0' + str
        return str

myBroker = ALBroker("myBroker",
    "0.0.0.0",  # listen to anyone
    0,  # find a free port and use it
    "lain.local",  # parent broker IP
    9559)
SoundTracker = SoundTrackerModule()
SoundTracker.subscribe()
SoundTracker.connect()

msg = ''
while msg != 'quit' :
    msg = raw_input('command: ')
    print("message received: '" + str(msg) + "'")

SoundTracker.disconnect()
SoundTracker.unsubscribe()
SoundTracker.video.unsubscribe("SoundTracker")
myBroker.shutdown()
quit()
