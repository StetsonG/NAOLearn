from naoqi import ALProxy
import time


class ImageHandler():

	
	def __init__(self):
		self.video = ALProxy("ALVideoDevice", "lain.local", 9559)
        self.resolution = 2
        # self.colorSpace = 11
        # self.resolution = vision_definitions.kQVGA
        self.colorSpace = vision_definitions.kYUVColorSpace

	def getFrame(self):

	def setResolution(self, newres):