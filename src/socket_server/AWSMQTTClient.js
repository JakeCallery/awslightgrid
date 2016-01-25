/**
 * Created by Jake on 12/27/2015.
 */

var util = require('util');
var Events = require('events');
var awsIoT = require('aws-iot-device-sdk');
var sleep = require('sleep');

var AWSMQTTClient = function ($clientId, $shadowName){

    var self = this;
    var shadowName = $shadowName;
    var clientTokenUpdate;

    var thingShadows = awsIoT.thingShadow({
        keyPath: './awsCerts/private.pem.key',
        certPath: './awsCerts/certificate.pem.crt',
        caPath: './awsCerts/root-CA.crt',
        region: 'us-east-1'
    });

    thingShadows.on('connect', function(){
        console.log('MQTT Connected');
        console.log('Registering Shadow: ' + $shadowName);
        thingShadows.register($shadowName, {discardStale:false});
        sleep.sleep(3);
        console.log('Sleep over...');
    });

    thingShadows.on('reconnect', function() {
        thingShadows.register($shadowName);
        console.log('MQTT reconnect');
    });

    thingShadows.on('close', function() {
        console.log('Unregistering Shadow');
        thingShadows.unregister($shadowName);
        console.log('MQTT caught close');
    });

    thingShadows.on('offline', function() {
        console.log('MQTT offline');
    });

    thingShadows.on('message', function($topic, $payload){
        console.log('Message: ', $topic, $payload.toString());
    });

    thingShadows.on('status', function($thingName, $stat, $clientToken, $stateObject) {
        console.log('---- STATUS ----');
        console.log('ClientToken: ' + $clientToken);
        console.log('received ' + $stat + ' on '+ $thingName +': '+ JSON.stringify($stateObject));

        if($stat == 'accepted'){
            console.log('Caught accepted');
            self.emit('updatefrommqtt', $stateObject);
        } else if ($stat == 'rejected'){
            console.log('--- Caught rejected ---');
        }
    });

    thingShadows.on('delta', function($thingName, $stateObject) {
        console.log('received delta on ' + $thingName + ': '+ JSON.stringify($stateObject));
        self.emit('deltafrommqtt', $stateObject);
    });

    thingShadows.on('timeout', function($thingName, $clientToken) {
        console.log('timeout: ' + $thingName + ', clientToken=' + $clientToken);
    });

    this.updateDesired = function($col, $row, $state){
        var objName = $col + '_' + $row;
        var stateObj =
        {
            "state": {
                "desired":{
                }
            }

        };

        stateObj.state.desired[objName] = $state;

        console.log('Sending Desired Update: ' + JSON.stringify(stateObj));
        thingShadows.update(shadowName, stateObj);
    };

    this.requestCurrentShadow = function(){
        thingShadows.get(shadowName);
    };

};

util.inherits(AWSMQTTClient, Events.EventEmitter);
module.exports = AWSMQTTClient;