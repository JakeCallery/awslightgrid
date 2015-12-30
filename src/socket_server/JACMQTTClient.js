/**
 * Created by Jake on 12/29/2015.
 */

var Events = require('events');
var mqtt = require('mqtt');
var util = require('util');

var JACMQTTClient = function($clientId, $shadowName){
    var self = this;
    var shadowName = $shadowName;

    var servers = [
            {
                host: 'mqtt://1.tcp.ngrok.io',
                port: 20675
            }
        ];

    //var servers = [
    //    {
    //        host: 'localhost',
    //        port: 1883
    //    }
    //];
    //var client = mqtt.connect('mqtt://localhost');
    var client = mqtt.connect('mqtt://1.tcp.ngrok.io:20675');

    client.on('connect', function(){
        console.log('Connected to JACMQTT');
    });

    client.on('message', function($topic, $payload){
        console.log('Message: ' + $payload.toString());
    });

};

util.inherits(JACMQTTClient, Events.EventEmitter);
module.exports = JACMQTTClient;