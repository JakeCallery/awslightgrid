import paho.mqtt.client as mqtt
import json
from ..utils.events import EventHandler


class MQTTClient:
	def __init__(self, log=None, mqtt_type=None):
		self._log = log
		self._log.debug('Creating MQTTClient Obj')

		self.statusMessageEvent = EventHandler(self)
		self.getMessageEvent = EventHandler(self)
		self.connectedEvent = EventHandler(self)

		if not mqtt_type:
			self._log.error('MQTT type is required')
			raise ValueError("MQTT Type is required (aws,jac)")

		self._log.info('Creating JAC MQTT Client')

		self._client = mqtt.Client()
		self._client.on_connect = self._on_connect
		self._client.on_subscribe = self._on_subscribe
		self._client.on_message = self._on_message

	def _on_connect(self, client, object, flags, rc):
		self._log.info("Subscriber Connection status code: " + str(rc) + " | Connection status: successful")
		self._client.subscribe('AWSLightGrid/status')
		self._client.subscribe('AWSLightGrid/get')

	def _on_subscribe(self, client, obj, mid, granted_qos):
		self._log.info("Subscribed: " + str(mid) + " " + str(granted_qos) + "  data:" + str(obj))

	def _on_message(self, client, userdata, msg):
		self._log.debug("Received message from topic: " + msg.topic + " | QoS: " + str(msg.qos) + " | Data Received: " + str(msg.payload))

		if msg.topic == 'AWSLightGrid/get':
			self.getMessageEvent(msg.payload)
		elif msg.topic == 'AWSLightGrid/status':
			self.statusMessageEvent(msg.payload)
		else:
			self._log.debug('Unhandled message topic: ' + msg.topic + '. Ignoring...')

	def connect(self, host=None, port=None):
		self._client.connect(host, port=port)
		self._log.debug('After connect call')

		self._log.debug('Starting message pump')
		self._client.loop_start()
		self._log.debug('After Loop Start')

	def button_update_from_hardware(self, button_obj):
		state_obj = {
			"state": {
				"desired": button_obj
			}
		}

		self._client.publish('AWSLightGrid/status', json.dumps(state_obj))

