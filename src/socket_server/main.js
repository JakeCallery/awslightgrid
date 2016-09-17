'use strict';
process.title = "LGSocketServer";

//handle args
var argv = require('yargs').argv;
//Create Socket SErver
var LGSocketServer = require('./LGSocketServer.js');
var lgss = new LGSocketServer('LGSocketServer');
var mqttClient = null;

if(argv.hasOwnProperty('mqtt') && argv['mqtt'] == 'aws'){
    console.log('Connecting to AWS MQTT broker...');
    //Create and start MQTT Client
    var AWSMQTTClient = require('./AWSMQTTClient.js');
    mqttClient = new AWSMQTTClient('LGSocketServerClient', 'AWSLightGrid');

} else {
    console.log('Connecting to JAC MQTT Broker...');
    var JACMQTTClient = require('./JACMQTTClient.js');
    mqttClient = new JACMQTTClient('LGSocketServerClient', 'AWSLightGrid');
}

mqttClient.on('updatefrommqtt', function($data){
    console.log('Caught Update From MQTT');
    lgss.updateFromMQTT($data);
});

//Start Socket Server
var port = process.env.PORT || 5252;
lgss.start(port);

lgss.on('updatedesired', function($msg){
    console.log('Caught Update Desired');
    mqttClient.updateDesired($msg.data.col, $msg.data.row, $msg.data.state);
});

lgss.on('requestcurrentshadow', function(){
   console.log('Requesting current shadow');
    mqttClient.requestCurrentShadow();
});