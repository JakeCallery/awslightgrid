/**
 * Created by Jake on 12/27/2015.
 */

var util = require('util');
var Events = require('events');
var awsIoT = require('aws-iot-device-sdk');
var sleep = require('sleep');

var SPECIAL_TOPIC = 'AWSLightGrid/special';
var UPDATE_TOPIC = '$aws/things/AWSLightGrid/shadow/update';
var UPDATE_ACCEPTED_TOPIC = '$aws/things/AWSLightGrid/shadow/update/accepted';
var GET_TOPIC = '$aws/things/AWSLightGrid/shadow/get';
var GET_ACCEPTED_TOPIC = '$aws/things/AWSLightGrid/shadow/get/accepted';
var UPDATE_REJECTED_TOPIC = '$aws/things/AWSLightGrid/shadow/update/rejected';
var GET_REJECTED_TOPIC = '$aws/things/AWSLightGrid/shadow/get/rejected';
var DELTA_TOPIC = '$aws/things/AWSLightGrid/shadow/update/delta';
var PUBLISH_QOS = 0;
var SUBSCRIBE_QOS = 0;

var AWSMQTTClient = function ($clientId, $shadowName){

    var self = this;
    var shadowName = $shadowName;
    var clientTokenUpdate;

    var device = awsIoT.device({
        keyPath: './awsCerts/private.pem.key',
        certPath: './awsCerts/certificate.pem.crt',
        caPath: './awsCerts/root-CA.crt',
        clientId: 'SocketServerDevice',
        region: 'us-east-1'
    });

    device.on('connect', function(){
        console.log('MQTT Connected');
        console.log('Subscribing...');
        device.subscribe(UPDATE_ACCEPTED_TOPIC, SUBSCRIBE_QOS);
        device.subscribe(GET_ACCEPTED_TOPIC, SUBSCRIBE_QOS);
        device.subscribe(UPDATE_REJECTED_TOPIC, SUBSCRIBE_QOS);
        device.subscribe(GET_REJECTED_TOPIC, SUBSCRIBE_QOS);
        device.subscribe(DELTA_TOPIC, SUBSCRIBE_QOS);
        device.subscribe(SPECIAL_TOPIC, SUBSCRIBE_QOS);

        console.log('Subscribe Complete');
    });

    device.on('reconnect', function() {
        console.log('MQTT reconnecting...');
    });

    device.on('close', function() {
        console.log('MQTT caught close');
    });

    device.on('offline', function() {
        console.log('MQTT offline');
    });

    device.on('message', function($topic, $payload){
        //console.log('---- Message: ', $topic, $payload.toString());
        var msg_obj = JSON.parse($payload.toString());

        switch($topic) {
            case UPDATE_ACCEPTED_TOPIC:
                console.log('Caught Update Accepted');
                self.emit('updatefrommqtt', msg_obj);
                break;

            case GET_ACCEPTED_TOPIC:
                console.log('Caught Get Accepted');
                self.emit('updatefrommqtt', msg_obj);
                break;

            case DELTA_TOPIC:
                console.log('Caught Delta Topic');
                break;

            case SPECIAL_TOPIC:
                console.log('** SPECIAL TOPIC **');
                break;

            default:
                console.log('Caught Unhandled Topic Message');
        }


    });

    //thingShadows.on('status', function($thingName, $stat, $clientToken, $stateObject) {
    //    console.log('---- STATUS ----');
    //    console.log('ClientToken: ' + $clientToken);
    //    console.log('received ' + $stat + ' on '+ $thingName +': '+ JSON.stringify($stateObject));
    //
    //    if($stat == 'accepted'){
    //        console.log('Caught accepted');
    //        self.emit('updatefrommqtt', $stateObject);
    //    } else if ($stat == 'rejected'){
    //        console.log('--- Caught rejected ---');
    //    }
    //});
    //
    //thingShadows.on('delta', function($thingName, $stateObject) {
    //    console.log('received delta on ' + $thingName + ': '+ JSON.stringify($stateObject));
    //    self.emit('deltafrommqtt', $stateObject);
    //});
    //
    //thingShadows.on('timeout', function($thingName, $clientToken) {
    //    console.log('timeout: ' + $thingName + ', clientToken=' + $clientToken);
    //});

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
        device.publish(UPDATE_TOPIC, JSON.stringify(stateObj), PUBLISH_QOS);
    };

    this.requestCurrentShadow = function(){
        device.publish(GET_TOPIC,'', PUBLISH_QOS);
    };

};

util.inherits(AWSMQTTClient, Events.EventEmitter);
module.exports = AWSMQTTClient;