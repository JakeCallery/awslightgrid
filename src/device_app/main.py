#!/usr/bin/env python
import platform
import logging
import sys
import time
import json

from argparse import ArgumentParser
from packages.MQTTClient import MQTTClient
from packages.DeviceManager import DeviceManager
from packages.MockDevice import MockDevice
from packages.EdisonDevice import EdisonDevice

# ### SETTINGS ###
ENABLE_LOGGING = True
ENABLE_CONSOLE_LOGGING = True
ENABLE_FILE_LOGGING = False
if platform.system().lower() == "linux":
	LOG_DIR_PATH = "/var/log/awslightgrid/"
else:
	LOG_DIR_PATH = ""

LOG_FILE_PATH = LOG_DIR_PATH + "awslightgrid" + "_log.txt"

LOG_NAME = "awslightgrid_logger"
LOG_LEVEL = logging.DEBUG
################

log = logging.getLogger(LOG_NAME)
if ENABLE_CONSOLE_LOGGING:
	stdout_handler = logging.StreamHandler(sys.stdout)
	stdout_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
	stdout_handler.setLevel(LOG_LEVEL)
	log.addHandler(stdout_handler)

if ENABLE_FILE_LOGGING:
	file_handler = logging.FileHandler(LOG_FILE_PATH)
	file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
	file_handler.setLevel(LOG_LEVEL)
	log.addHandler(file_handler)

log.setLevel(LOG_LEVEL)
log.disabled = not ENABLE_LOGGING


def grab_args():
	parser = ArgumentParser(prog=__name__)
	parser.add_argument("--mqtt", dest="mqtt")
	return parser.parse_known_args()


def handle_mqtt_message(sender, payload):
	log.debug("Main Caught Message: " + str(payload))
	obj = json.loads(payload)
	deviceManager.update_button(obj['state']['desired'])


def handle_device_button_update(sender, buttonObj):
	log.debug("Main Caught Device Button Update" + str(buttonObj))
	mqttClient.button_update_from_hardware(buttonObj)


if __name__ == "__main__":
	log.info("Main")
	options, unknown_args = grab_args()

	global mqttClient
	global deviceManager

	#set up mqtt client
	mqttClient = MQTTClient(log=log, mqtt_type=options.mqtt)
	mqttClient.messageEvent += handle_mqtt_message

	#set up hardware
	mock_device = MockDevice(log=log)
	edison_device = EdisonDevice(4, 4, log=log)
	#deviceManager = DeviceManager(device=mock_device, log=log)
	deviceManager = DeviceManager(device=edison_device, log=log)
	deviceManager.buttonUpdateEvent += handle_device_button_update

	#connect and kick off message pump
	mqttClient.connect(host='1.tcp.ngrok.io', port=20675)

	deviceManager.run()



