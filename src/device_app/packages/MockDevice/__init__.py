from ..utils.events import EventHandler


class MockDevice:
	def __init__(self, log=None):
		self._log = log
		self._log.debug('Creating New Mock Device')

		self.button_update_event = EventHandler(self)

	def update_button(self, button_obj):
		self._log.debug("Updating Hardware Button to: " + str(button_obj))
		col_row, state = button_obj.items()[0]
		coord_list = col_row.encode('ascii', 'ignore').split("_")
		col = coord_list[0]
		row = coord_list[1]
		self._log.debug("Switching Button: " + str(col) + "," + str(row) + " to: " + str(state))

	def test_button_press(self, button_obj):
		self._log.debug('Testing button press')
		self.button_update_event(button_obj)
