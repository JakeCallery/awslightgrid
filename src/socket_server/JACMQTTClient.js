/**
 * Created by Jake on 12/29/2015.
 */

var Events = require('events');
var mqtt = require('mqtt');
var util = require('util');

var JACMQTTClient = function($clientId, $shadowName){
    var self = this;
    var shadowName = $shadowName;

    var options = {
        host: '1.tcp.ngrok.io',
        port: 20675,
        protocol: 'mqtt'
    };
    var client = mqtt.connect(options);

    client.on('connect', function(){
        console.log('Connected to JACMQTT');
        client.subscribe(shadowName + '/' + 'status');
        client.subscribe(shadowName + '/' + 'get');

    });

    client.on('message', function($topic, $payload){
        console.log('Topic: ' + $topic);
        console.log('Message: ' + $payload.toString());

        switch($topic) {
            case (shadowName + '/' + 'status'):
                console.log('Caught Status');
                self.emit('updatefrommqtt', JSON.parse($payload.toString()));
                break;

            case (shadowName + '/' + 'get'):
                console.log('Caught Get');
                break;

            default:
                console.log('Unknown Topic');
                break;
        }

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
        //TODO update db here
        client.publish(shadowName + '/' + 'status', JSON.stringify(stateObj));
    };

    this.requestCurrentShadow = function(){
        //TODO: Get shadow from db, publish result
        client.publish(shadowName + '/' + 'get', 'fullshadow');
    };

};

util.inherits(JACMQTTClient, Events.EventEmitter);
module.exports = JACMQTTClient;