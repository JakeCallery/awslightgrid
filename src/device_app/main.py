#!/usr/bin/env python
import platform
import logging
import sys
import time
import json

from argparse import ArgumentParser
from packages.MQTTClient import MQTTClient
from packages.DeviceManager import DeviceManager

# ### SETTINGS ###
MOCK_DEVICE = False
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

first_subscribe = True

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


def handle_mqtt_status_message(sender, payload):
	log.debug("Main Caught Status Message: " + str(payload))
	obj = json.loads(payload)
	deviceManager.update_button(obj['state']['desired'])


def handle_mqtt_get_message(sender, payload):
	log.debug("Main Caught Get Message: " + str(payload))


def handle_device_button_update(sender, buttonObj):
	log.debug("Main Caught Device Button Update" + str(buttonObj))
	mqttClient.button_update_from_hardware(buttonObj)


def handle_mqtt_subscribed(sender):
	global first_subscribe
	if first_subscribe:
		first_subscribe = False
		deviceManager.start()


def handle_device_request_full_shadow(sender):
	mqttClient.request_full_shadow()

if __name__ == "__main__":
	log.info("Main")
	options, unknown_args = grab_args()

	global mqttClient
	global deviceManager

	#set up mqtt client
	mqttClient = MQTTClient(log=log, mqtt_type=options.mqtt)
	mqttClient.statusMessageEvent += handle_mqtt_status_message
	mqttClient.getMessageEvent += handle_mqtt_get_message
	mqttClient.subscribedEvent += handle_mqtt_subscribed
	#set up hardware
	if MOCK_DEVICE:
		from packages.MockDevice import MockDevice
		mock_device = MockDevice(log=log)
		deviceManager = DeviceManager(device=mock_device, log=log)
	else:
		from packages.EdisonDevice import EdisonDevice
		edison_device = EdisonDevice(4, 4, log=log)
		edison_device.show_off_display()
		deviceManager = DeviceManager(device=edison_device, log=log)

	deviceManager.buttonUpdateEvent += handle_device_button_update
	deviceManager.requestFullShadowEvent += handle_device_request_full_shadow

	#connect and kick off message pump
	mqttClient.connect(host='1.tcp.ngrok.io', port=20675)


	#run it all
	while True:
		if MOCK_DEVICE:
			time.sleep(10)
		else:
			time.sleep(0.03)

		deviceManager.update()




