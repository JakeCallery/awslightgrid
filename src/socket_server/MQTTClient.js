/**
 * Created by Jake on 12/27/2015.
 */
module.exports = MQTTClient;

var Events = require('events');
var awsIoT = require('aws-iot-device-sdk');

function MQTTClient($clientId){
    //Super
    Events.EventEmitter.call(this);
    var self = this;

    var device = awsIoT.device({
        keyPath: './awsCerts/private.pem.key',
        certPath: './awsCerts/certificate.pem.crt',
        caPath: './awsCerts/root-CA.crt',
        clientId: $clientId,
        region: 'us-east-1'
    });

    device
        .on('connect', function(){
           console.log('MQTT Connect');
        });


}