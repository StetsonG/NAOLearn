from naoqi import ALProxy
import time


class MotionController() :

	move_stiffness = 1
	rest_stiffness = 0
	joint_speed = 0.1

	def __init__(self):
		self.robot = ALProxy("ALMotion", "lain.local", 9559)

	### Sends the command to change a joint angle on the NAO
	# Sets stiffness to move_stiffness during motion and then
	# returns to rest_stiffness when complete
	def changeJointAngle(self, jointName, angle):
		self.robot.setStiffnesses(jointName, self.move_stiffness)
		self.robot.changeAngles(jointName, angle, self.joint_speed)
		time.sleep(1)
		self.robot.setStiffnesses(jointName, self.rest_stiffness)

	def setMoveStiffness(self, stiffness):
		if stiffness >= 0 and stiffness <= 1:
			self.move_stiffness = stiffness

	def setRestStiffness(self, stiffness):
		if stiffness >= 0 and stiffness <= 1:
			self.rest_stiffness = stiffness

	def setJointSpeed(self, speed):
		if speed >= 0 and speed <= 1:
			self.joint_speed = speed