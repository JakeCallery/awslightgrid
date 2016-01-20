from ..utils.events import EventHandler
import time


class DeviceManager:
	def __init__(self, device=None, log=None):

		self._log = log
		self._log.debug('Creating New Device Manager')

		self._device = device
		self._device.button_update_event += self.handle_button_update

		self.buttonUpdateEvent = EventHandler(self)
		self.requestFullShadowEvent = EventHandler(self)

		self._log.debug('DM Requesting full shadow')

	def start(self):
		self.requestFullShadowEvent()

	def handle_button_update(self, sender, button_obj):
		self.buttonUpdateEvent(button_obj)

	def update_button(self, button_obj, notify_of_update=True):
		self._device.update_button(button_obj, notify_of_update=notify_of_update)

	def get_button_dict(self):
		return self._device.get_button_dict()

	def update(self):
		self._device.update()


