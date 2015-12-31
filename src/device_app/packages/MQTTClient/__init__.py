class MQTTClient:
	def __init__(self, log=None, mqtt=None):
		if log:
			log.debug('Creating MQTTClient Obj')

		if not mqtt:
			log.error('MQTT type is required')
			raise ValueError("MQTT Type is required (aws,jac)")

		log.info('Creating JAC MQTT Client')
