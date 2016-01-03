from ..utils.events import EventHandler
import time


class DeviceManager:
	def __init__(self, device=None, log=None):

		self._log = log
		self._log.debug('Creating New Device Manager')

		self._device = device
		self._device.button_update_event += self.handle_button_update

		self.buttonUpdateEvent = EventHandler(self)

	def handle_button_update(self, sender, button_obj):
		self.buttonUpdateEvent(button_obj)

	def update_button(self, button_obj):
		self._device.update_button(button_obj)

	def run(self):
		while True:
			self._log.debug("Sleep Start")
			time.sleep(10)
			self._device.test_button_press({"0_0": "true"})
			self._log.debug("Sleep End")
