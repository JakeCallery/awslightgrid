'use strict';
process.title = "LBSocketServer";

//Create Socket SErver
var LGSocketServer = require('./LGSocketServer.js');
var lgss = new LGSocketServer('LGSocketServer');

//Create and start MQTT Client
var MQTTClient = require('./MQTTClient.js');
var mqttClient = new MQTTClient('LGSocketServerClient', 'AWSLightGrid');

//Start Socket Server
var port = process.env.PORT || 5252;
lgss.start(port);

lgss.on('updatedesired', function($msg){
    console.log('Caught Update Desired');
    mqttClient.updateDesired($msg.data.col, $msg.data.row, $msg.data.state);
});

mqttClient.on('updatefrommqtt', function($data){
   console.log('Caught Update From MQTT');
    lgss.updateFromMQTT($data);
});

lgss.on('requestcurrentshadow', function(){
   console.log('Requesting current shadow');
    mqttClient.requestCurrentShadow();
});