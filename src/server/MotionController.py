from naoqi import ALProxy
import time


class MotionController() :

	def __init__(self):
		self.robot = ALProxy("ALMotion", "lain.local", 9559)
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

	### Sends the command to set anj absolute joint angle on the NAO
	# Sets stiffness to move_stiffness during motion and then
	# returns to rest_stiffness when complete
	def setJointAngle(self, jointName, angle):
		self.robot.setStiffnesses(jointName, self.move_stiffness)
		self.robot.setAngles(jointName, angle, self.joint_speed)
		time.sleep(1)
		self.robot.setStiffnesses(jointName, self.rest_stiffness)
		return True


	def getJointAngles(self, jointNames):
		useSensors = True
		return self.robot.getAngles(jointNames, useSensors)


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