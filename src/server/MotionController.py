from naoqi import ALProxy
import time
import threading
from threading import Timer

#nao_ip = "192.168.0.102"
nao_ip = "lain.local"


class MotionController() :

	def __init__(self):
		self.robot = ALProxy("ALMotion", nao_ip, 9559)
		self.tts = ALProxy("ALTextToSpeech", nao_ip, 9559)
		self.tts.setLanguage("English")
		self.move_stiffness = 1
		self.rest_stiffness = 0
		self.joint_speed = 0.1

	### Sends the command to change a joint angle on the NAO relative to
	# the exisitng joint angle
	# Sets stiffness to move_stiffness during motion and then
	# returns to rest_stiffness when complete
	def changeJointAngle(self, jointName, angle):
		self.robot.setStiffnesses(jointName, self.move_stiffness)
		self.robot.changeAngles(jointName, angle, self.joint_speed)
		time.sleep(1)
		self.robot.setStiffnesses(jointName, self.rest_stiffness)
		return True

	### Sends the command to set an absolute joint angle on the NAO
	# Sets stiffness to move_stiffness during motion and then
	# returns to rest_stiffness when complete
	def setJointAngle(self, jointName, angle):
		self.robot.setStiffnesses(jointName, self.move_stiffness)
		self.robot.setAngles(jointName, angle, self.joint_speed)
		t = Timer(5, self.robot.setStiffnesses, [jointName, self.rest_stiffness])
		t.start()
		return True

	### Requests a set of joint angles based on the given list of jointNames
	# The useSensors option determines whether the NAO reports the commanded
	# joint positions or the positions that are actually verified by internal sensors 
	def getJointAngles(self, jointNames):
		useSensors = True
		return self.robot.getAngles(jointNames, useSensors)

	def getAllJointAngles(self):
		useSensors = True
		return self.robot.getAngles("Body", useSensors)

	def say(self, speech):
		self.tts.say(speech)

	def openHand(self, handName):
		self.robot.openHand(handName)

	def closeHand(self, handName):
		self.robot.closeHand(handName)

	def setMoveStiffness(self, stiffness):
		if stiffness >= 0 and stiffness <= 1:
			self.move_stiffness = stiffness
			return True
		return False

	def setRestStiffness(self, stiffness):
		if stiffness >= 0 and stiffness <= 1:
			self.rest_stiffness = stiffness
			return True
		return False

	def setJointSpeed(self, speed):
		if speed >= 0 and speed <= 1:
			self.joint_speed = speed
			return True
		return False

	### Attempts to interpret and execute a given text script according to the NAO Script rules
	def runSimpleScript(self, script):
		lines = script.split("\n")
		i = 0
		for l in lines:
			i += 1
			tokens = l.split()

			if len(tokens) >= 3 and tokens[0] == "set":
				self.setJointAngle(tokens[1], float(tokens[2]))
				#time.sleep(1)

			elif len(tokens) >= 2 and tokens[0] == "open":
				self.openHand(tokens[1])

			elif len(tokens) >= 2 and tokens[0] == "close":
				self.closeHand(tokens[1])

			elif len(tokens) >= 2 and tokens[0] == "say":
				speech = l[3:]
				self.say(speech)

			elif len(tokens) >= 2 and tokens[0] == "wait":
				time.sleep(float(tokens[1]))

			elif len(tokens) > 0 :
				print tokens
				raise Exception('Invalid command,line ', i)



