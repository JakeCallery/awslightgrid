/**
 * Created by Jake on 12/27/2015.
 */
module.exports = MQTTClient;

var Events = require('events');
var awsIoT = require('aws-iot-device-sdk');

function MQTTClient($clientId, $shadowName){
    //Super
    Events.EventEmitter.call(this);
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
        thingShadows.register($shadowName);
    });

    thingShadows
        .on('close', function() {
            thingShadows.unregister($shadowName);
            console.log('MQTT caught close');
        });

    thingShadows.on('message', function($topic, $payload){
        console.log('Message: ', $topic, $payload.toString());
    });

    thingShadows.on('status',
        function(thingName, stat, clientToken, stateObject) {
            console.log('received '+stat+' on '+thingName+': '+
                JSON.stringify(stateObject));
    });

    thingShadows.on('delta',
        function(thingName, stateObject) {
            console.log('received delta '+' on '+thingName+': '+
                JSON.stringify(stateObject));
    });

    thingShadows.on('timeout',
        function(thingName, clientToken) {
            console.log('received timeout '+' on '+operation+': '+
                clientToken);
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


}