from ..utils.events import EventHandler


class DeviceManager:
	def __init__(self, log=None):

		self._log = log
		self._log.debug('Creating New Device Manager')

		self.buttonUpdateEvent = EventHandler(self)

	def test_button_press(self, button_obj):
		self._log.debug('Testing button press')
		self.buttonUpdateEvent(button_obj)

	def update_button(self, button_obj):
		self._log.debug("Updating Hardware Button to: " + str(button_obj))
		col_row, state = button_obj.items()[0]
		coord_list = col_row.encode('ascii', 'ignore').split("_")
		col = coord_list[0]
		row = coord_list[1]
		self._log.debug("Switching Button: " + str(col) + "," + str(row) + " to: " + str(state))

