import paho.mqtt.client as mqtt
import ssl
import json
from ..utils.events import EventHandler

CLIENT_TOKEN = "DeviceAWSMQTTClient"
PUBLISH_QOS = 0
SUBSCRIBE_QOS = 0

class AWSMQTTClient:
    def __init__(self, log=None):
        self._log = log

        self.statusMessageEvent = EventHandler(self)
        self.deltaMessageEvent = EventHandler(self)
        self.getMessageEvent = EventHandler(self)
        self.connectedEvent = EventHandler(self)
        self.subscribedEvent = EventHandler(self)
        self.specialMessageEvent = EventHandler(self)

        self.client_token = CLIENT_TOKEN

        self._log.info('Creating AWS MQTT Client')
        self._subscribeCount = 0
        self._currentVersion = 0

        self._client = mqtt.Client()
        self._client.tls_set("awsCerts/root-CA.crt",
                             certfile="awsCerts/certificate.pem.crt",
                             keyfile="awsCerts/private.pem.key",
                             tls_version=ssl.PROTOCOL_TLSv1_2,
                             ciphers=None)

        self._client.on_connect = self._on_connect
        self._client.on_subscribe = self._on_subscribe
        self._client.on_message = self._on_message

    def _on_connect(self, client, object, flags, rc):
        self._log.info("Subscriber Connection status code: " + str(rc) + " | Connection status: successful")
        self._client.subscribe('$aws/things/AWSLightGrid/shadow/get', SUBSCRIBE_QOS)
        self._client.subscribe('$aws/things/AWSLightGrid/shadow/get/accepted', SUBSCRIBE_QOS)
        self._client.subscribe('$aws/things/AWSLightGrid/shadow/update/accepted', SUBSCRIBE_QOS)
        self._client.subscribe('$aws/things/AWSLightGrid/shadow/get/rejected', SUBSCRIBE_QOS)
        self._client.subscribe('$aws/things/AWSLightGrid/shadow/update/rejected', SUBSCRIBE_QOS)
        self._client.subscribe('$aws/things/AWSLightGrid/shadow/update/delta', SUBSCRIBE_QOS)
        self._client.subscribe('AWSLightGrid/special', 1)

    def _on_subscribe(self, client, obj, mid, granted_qos):
        self._log.info("Subscribed: " + str(mid) + " " + str(granted_qos) + "  data:" + str(obj))

        self._log.debug('Subscribe Count: ' + str(self._subscribeCount))

        if self._subscribeCount >= 6:
            self.subscribedEvent()
        else:
            self._subscribeCount += 1

    def _on_message(self, client, userdata, msg):
        self._log.debug("-------- Received message from topic: " + msg.topic + " | QoS: " + str(
            msg.qos) + " | Data Received: " + str(msg.payload))

        # ignore messages I sent
        try:
            msgobj = json.loads(msg.payload)
            self._log.debug(">>>>>: " + str(msgobj))
            if "clientToken" in msgobj:
                if msgobj["clientToken"] == CLIENT_TOKEN:
                    self._log.debug('**** Skipping message from me... ****')
                    return
                else:
                    self._log.debug('**** NOT MY MESSAGE, I WILL DEAL WITH IT *****')
            else:
                self._log.debug('******* NO CLIENT TOKEN *******')
        except Exception, e:
            pass

        if msg.topic == '$aws/things/AWSLightGrid/shadow/get/accepted':
            self.getMessageEvent(msg.payload)

        # elif msg.topic == '$aws/things/AWSLightGrid/shadow/update/accepted':
        # 	obj = json.loads(msg.payload)
        # 	if int(obj["version"]) > self._currentVersion:
        # 		self._currentVersion = int(obj["version"])
        # 		self.statusMessageEvent(msg.payload)
        # 	else:
        # 		self._log.info("State from old version, ignoring...")

        elif msg.topic == 'AWSLightGrid/special':
            self._log.info("** Caught Special Message **")
            self.specialMessageEvent(msg.payload)

        elif msg.topic == '$aws/things/AWSLightGrid/shadow/update/delta':
            obj = json.loads(msg.payload)
            self._log.debug("Versions: " + str(int(obj["version"])) + "/" + str(self._currentVersion))
            if int(obj["version"]) > self._currentVersion:
                self._currentVersion = int(obj["version"])
                self.deltaMessageEvent(msg.payload)
            else:
                self._log.info("** Delta from old version, requesting full shadow...")
                # Request full shadow to get everyone back in sync
                self.request_full_shadow()

        else:
            self._log.debug('Unhandled message topic: ' + msg.topic + '. Ignoring...')
            self._log.debug('Ignored message: ' + str(msg.payload))

    def connect(self, host=None, port=None):
        self._client.connect(host, port=port)
        self._log.debug('After connect call')

        self._log.debug('Starting message pump')
        self._client.loop_start()
        self._log.debug('After Loop Start')

    def button_update_from_hardware(self, button_obj):
        state_obj = {
            "state": {
                "reported": button_obj,
                "desired": button_obj
            },
            "clientToken": CLIENT_TOKEN
        }

        self._log.debug('publish to update: ' + json.dumps(state_obj))
        self._client.publish('$aws/things/AWSLightGrid/shadow/update', json.dumps(state_obj), PUBLISH_QOS)

    def request_full_shadow(self):
        self._log.debug('Requesting Full Shadow')
        self._client.publish('$aws/things/AWSLightGrid/shadow/get', '', PUBLISH_QOS)

    def report_button_dict(self, button_dict):
        state_obj = {
            "state": {
                "reported": button_dict
            },
            "clientToken": CLIENT_TOKEN
        }

        self._client.publish('$aws/things/AWSLightGrid/shadow/update', json.dumps(state_obj), PUBLISH_QOS)
