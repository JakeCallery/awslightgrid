/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/6/13
 * Time: 12:20 PM
 * To change this template use File | Settings | File Templates.
 */

var Events = require('events');
var UUID = require('node-uuid');
module.exports = Client;

function Client($connection, $globalConnectionIndex, $type) {

	//super
	Events.EventEmitter.call(this);

	var self = this;

	//TODO: Do a check for collisions within group on group add, recalc if needed
	this.id = UUID.v4().split('-').join('');
	//Hack to make sure first character isn't a number (used as a map property in client)
	if(!isNaN(this.id.charAt(0))){
		this.id = 'Z' + this.id;
	}
	this.connection = $connection;
	this.group = null;
	this.connectionIndex = $globalConnectionIndex;
	this.type = $type;

	var handleMessage = function($message){
		//TODO: possible support for binary data
		var msg = JSON.parse($message.utf8Data);
		self.emit('message', self, msg);
		//self.emit('message', self, $message);
	};

	var handleClose = function($reasonCode, $description){
		self.emit('close', self, $reasonCode, $description);
	};

	//Add listeners
	this.connection.addListener('close', handleClose);
	this.connection.addListener('message', handleMessage);

	//TODO: !IMPORTANT! remove one of the params, and simply generate the other
	//this will require updating all .sendMessage calls
	this.sendMessage = function($msgObj, $message){
		//console.log('---' + $msgObj + ' / ' + $message);
		if($msgObj.type === 'utf8'){
			self.connection.sendUTF($message);
		} else if($msgObj.type === 'binary'){
			self.connection.sendBytes($msgObj.binaryData);
		}
	};

	this.destroy = function(){
		self.connection.removeListener('close', handleClose);
		self.connection = null;
		self.group = null;
		self.connectionIndex = null;
	}
}

Client.super_ = Events.EventEmitter;
Client.prototype = Object.create(Events.EventEmitter.prototype, {
	constructor: {
		value: Client,
		enumerable: false
	}
});

Client.INPUT_TYPE = 'input';
Client.SPECTATOR_TYPE = 'spectator';
Client.STATS_TYPE = 'stats';