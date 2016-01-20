/**
 * Created by Jake on 12/27/2015.
 */

var util = require('util');
var Events = require('events');
var awsIoT = require('aws-iot-device-sdk');

var AWSMQTTClient = function ($clientId, $shadowName){

    var self = this;
    var shadowName = $shadowName;
    var clientTokenUpdate;

    var thingShadows = awsIoT.thingShadow({
        keyPath: './awsCerts/private.pem.key',
        certPath: './awsCerts/certificate.pem.crt',
        caPath: './awsCerts/root-CA.crt',
        clientId: $clientId,
        region: 'us-east-1'
    });

    thingShadows.on('connect', function(){
        console.log('MQTT Connected');
        thingShadows.register($shadowName, { persistentSubscribe: true });
    });

    thingShadows.on('reconnect', function() {
        thingShadows.register( $shadowName, { persistentSubscribe: true } );
        console.log('MQTT reconnect');
    });

    thingShadows.on('close', function() {
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
        console.warn( 'timeout: ' + $thingName + ', clientToken=' + $clientToken);
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