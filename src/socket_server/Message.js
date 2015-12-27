/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/7/13
 * Time: 6:25 PM
 * To change this template use File | Settings | File Templates.
 */
module.exports = Message;

function Message($senderId, $messageType, $data, $dataType){

	console.log('MessageType: ' + $messageType);

	var self = this;

	this.senderId = $senderId;
	this.messageType = $messageType;
	this.data = $data;
	this.dataType = $dataType || Message.UTF8;

	this.utf8Data = null;
	this.binaryData = null;

	if(this.dataType == Message.UTF8){
		this.utf8Data = self.getJSONString();
	} else {
		//TODO: implement binary data if needed
		this.binaryData = null;
	}

}

Message.prototype.getJSONString = function(){
	var obj = {};
	obj.senderId = this.senderId;
	obj.messageType = this.messageType;
	obj.data = this.data;
	obj.dataType = this.dataType;
	return JSON.stringify(obj);
};

Message.CONNECT = 'connect';
Message.CLIENT_CONNECT = 'clientconnect';
Message.CLIENT_DISCONNECT = 'clientdisconnect';
Message.UTF8 = 'utf8';
Message.BINARY = 'binary';