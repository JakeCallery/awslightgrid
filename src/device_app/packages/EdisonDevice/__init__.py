from ..utils.events import EventHandler
from ..Adafruit_Trellis import Adafruit_Trellis, Adafruit_TrellisSet
import time
import math

MOMENTARY = 0
LATCHING = 1
NUMTRELLIS = 1
I2C_BUS = 6


class EdisonDevice:
	def __init__(self, num_cols, num_rows, log=None):
		self._log = log
		self._log.debug('Creating New Edison Device')
		self.button_update_event = EventHandler(self)

		self._matrix0 = Adafruit_Trellis()
		self._trellis = Adafruit_TrellisSet(self._matrix0)

		self._num_buttons = NUMTRELLIS * num_cols * num_rows

		self._numCols = num_cols
		self._numRows = num_rows

		self._log.info('Starting Trellis')
		self._trellis.begin((0x70, I2C_BUS))

	def start_loop(self):

		self.show_off_display()

		while True:
			time.sleep(0.03)

			# If a button was just pressed or released...
			if self._trellis.readSwitches():
				# go through every button
				for i in range(self._num_buttons):
					# if it was pressed...
					if self._trellis.justPressed(i):
						self._log.debug('v{0}'.format(i))
						# Alternate the LED
						if self._trellis.isLED(i):
							self._trellis.clrLED(i)
						else:
							self._trellis.setLED(i)
				# tell the trellis to set the LEDs we requested
				self._trellis.writeDisplay()

	def _handle_button_press(self, button_index, new_state):
		self._log('handle buton press: ' + str(button_index) + ':' + str(new_state))

		#convert index to button object
		row = math.floor(button_index / self._numCols)
		col = button_index % self._numCols
		prop_str = str(col) + '_' + str(row)
		button_obj = dict()
		button_obj[prop_str] = new_state

		#notify
		self.button_update_event(button_obj)

	def show_off_display(self):
		# light up all the LEDs in order
		for i in range(self._num_buttons):
			self._trellis.setLED(i)
			self._trellis.writeDisplay()
			time.sleep(0.05)

		# then turn them off
		for i in range(self._num_buttons):
			self._trellis.clrLED(i)
			self._trellis.writeDisplay()
			time.sleep(0.05)

	def update_button(self, button_obj):
		self._log.debug('Updating Hardware Button to: ' + str(button_obj))
		col_row, state = button_obj.items()[0]
		coord_list = col_row.encode('ascii', 'ignore').split("_")
		col = int(coord_list[0])
		row = int(coord_list[1])
		self._log.debug("Switching Button: " + str(col) + "," + str(row) + " to: " + str(state))

		#handle hardware
		index = row * self._numCols + col
		if index < self._num_buttons:
			if state == 'true' or state == 'True' or state == True:
				self._trellis.setLED(index)
			else:
				self._trellis.clrLED(index)
		else:
			self._log.error('Button index: ' + str(index) + ' out of range!')

