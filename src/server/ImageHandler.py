from naoqi import ALProxy
import time
from threading import Timer
import Image


class ImageHandler():

	
	def __init__(self):
		self.video = ALProxy("ALVideoDevice", "lain.local", 9559)
        self.resolution = 2
        # self.colorSpace = 11
        # self.resolution = vision_definitions.kQVGA
        self.colorSpace = vision_definitions.kYUVColorSpace
        self.framerate = 30
        self.nameID = self.video.subscribe("NAOLearn", self.resolution, self.colorSpace, self.framerate)


	def getLatestFrame(self):
		alimage = self.video.getImageLocal(self.nameID)

		imageWidth = alimage[0]
		imageHeight = alimage[1]
		imageArray = alimage[6]

		image = Image.fromstring("RGB", (imageWidth, imageHeight), imageArray)

		output = StringIO.StringIO()

		image.save(output, format="JPEG",quality=80, optimize=True)

		return output

