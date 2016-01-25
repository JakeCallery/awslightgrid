from ..utils.events import EventHandler
from ..Adafruit_Trellis import Adafruit_Trellis, Adafruit_TrellisSet
import time
import math

MOMENTARY = 0
LATCHING = 1
NUMTRELLIS = 4
I2C_BUS = 6
INDEX_OFFSET_MAP = [[0, 32], [16, 48]]


class EdisonDevice:
	def __init__(self, num_cols, num_rows, log=None):
		self._log = log
		self._log.debug('Creating New Edison Device')
		self.button_update_event = EventHandler(self)

		self._matrix0 = Adafruit_Trellis()
		self._matrix1 = Adafruit_Trellis()
		self._matrix2 = Adafruit_Trellis()
		self._matrix3 = Adafruit_Trellis()
		self._trellis = Adafruit_TrellisSet(self._matrix0, self._matrix1, self._matrix2, self._matrix3)

		self._num_buttons = NUMTRELLIS * num_cols * num_rows

		self._numBoardCols = num_cols
		self._numBoardRows = num_rows
		self._numBoards = NUMTRELLIS

		self._log.info('Starting Trellis')
		self._trellis.begin((0x77, I2C_BUS), (0x72, I2C_BUS), (0x73, I2C_BUS), (0x71, I2C_BUS))

	def update(self):
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
						self._handle_button_press(i, False)
					else:
						self._trellis.setLED(i)
						self._handle_button_press(i, True)

			# tell the trellis to set the LEDs we requested
			self._trellis.writeDisplay()

	def get_index_from_col_row(self, col, row):
		if col >= 4:
			col_board = 1
		else:
			col_board = 0

		if row >= 4:
			row_board = 1
		else:
			row_board = 0

		index_offset = INDEX_OFFSET_MAP[col_board][row_board]
		self._log.debug("Offset, colb, rowb" + str(index_offset) + "," + str(col_board) + "," + str(row_board))

		base_col = col % self._numBoardCols
		base_row = row % self._numBoardRows

		index = index_offset + (base_row * self._numBoardCols) + base_col

		self._log.debug("INDEX: " + str(index))

		return int(index)

	def get_col_row_from_index(self, index):
		board = math.floor(index / (self._numBoardCols * self._numBoardRows))
		remainder = index % (self._numBoardCols * self._numBoardRows)

		col_add = 0
		row_add = 0
		if board == 1:
			col_add = self._numBoardCols
		elif board == 2:
			row_add = self._numBoardRows
		elif board == 3:
			col_add = self._numBoardCols
			row_add = self._numBoardRows

		row = math.floor(remainder / self._numBoardCols) + row_add
		col = (remainder % self._numBoardCols) + col_add

		self._log.debug('Board,Remainder,Col,Row: ' + str(board) + ',' + str(remainder) + ',' + str(col) + ',' + str(row))

		return int(col), int(row)

	def _handle_button_press(self, button_index, new_state):
		self._log.debug('handle buton press: ' + str(button_index) + ':' + str(new_state))
		col, row = self.get_col_row_from_index(button_index)
		self._log.debug('Col,Row' + str(col) + ',' + str(row))
		prop_str = str(col) + '_' + str(row)
		button_obj = dict()
		button_obj[prop_str] = new_state

		#notify
		self.button_update_event(button_obj)

	def show_off_display(self):
		# light up all the LEDs in order
		self._log.debug('Num Buttons: ' + str(self._num_buttons))
		for i in range(self._num_buttons):
			self._trellis.setLED(i)
			self._trellis.writeDisplay()
			time.sleep(0.002)

		# then turn them off
		for i in range(self._num_buttons):
			self._trellis.clrLED(i)
			self._trellis.writeDisplay()
			time.sleep(0.002)

	def update_button(self, button_obj, notify_of_update=True):
		for prop in button_obj:
			self._log.debug('Updating Hardware Button to: ' + str(prop) + '/' + str(button_obj[prop]))
			col_row = prop
			state = button_obj[prop]
			coord_list = col_row.encode('ascii', 'ignore').split("_")
			col = int(coord_list[0])
			row = int(coord_list[1])
			self._log.debug("Switching Button: " + str(col) + "," + str(row) + " to: " + str(state))

			#handle hardware
			if row < self._numBoardRows * NUMTRELLIS and col < self._numBoardCols * NUMTRELLIS:
				index = self.get_index_from_col_row(col, row)
				self._log.debug('Index: ' + str(index))
				self._log.debug('Updating Hardware Button to: ' + str(prop) + '/' + str(button_obj[prop]))
				if state == 'true' or state == 'True' or state is True:
					self._log.debug('Setting LED')
					self._trellis.setLED(index)

				else:
					self._log.debug('Clearing LED')
					self._trellis.clrLED(index)

			else:
				index = row * self._numBoardCols + col
				self._log.error('Button index: ' + str(index) + ' out of range!')

		#Update final display
		self._trellis.writeDisplay()

	def get_button_dict(self):
		obj = dict()
		for i in range(self._num_buttons):
			col, row = self.get_col_row_from_index(i)
			key_string = str(col) + "_" + str(row)
			obj[key_string] = self._trellis.isLED(i)

		return obj
