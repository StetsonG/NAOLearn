from MotionController import MotionController
from sys import argv

script, filename = argv
txt = open(filename)


m = MotionController()

d = txt.read()
m.runSimpleScript(d)