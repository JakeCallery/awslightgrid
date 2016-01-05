/**
 * Created by Jake on 12/29/2015.
 */

var Events = require('events');
var mqtt = require('mqtt');
var util = require('util');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

var JACMQTTClient = function($clientId, $shadowName){
    var self = this;
    var shadowName = $shadowName;

    //setup db
    var shadowFilePath = 'db/shadow.db';
    var db;

    //connect to mqtt broker
    var options = {
        host: '1.tcp.ngrok.io',
        port: 20675,
        protocol: 'mqtt'
    };
    var client = mqtt.connect(options);


    //handle client events
    client.on('connect', function(){
        console.log('Connected to JACMQTT');
        self.dbSetup(shadowFilePath);
        client.subscribe(shadowName + '/' + 'status');
        client.subscribe(shadowName + '/' + 'get');

    });

    client.on('reconnect', function(){
        console.log('JAC MQTT caught reconnect');
    });

    client.on('close', function(){
       console.log('JAC MQTT connection closed');
    });

    client.on('offline', function(){
       console.log('JAC MQTT caught offline');
    });

    client.on('error', function($error){
        console.log('JAC MQTT caught error: ' + $error.toString());
    });

    client.on('message', function($topic, $payload){
        console.log('Topic: ' + $topic);
        console.log('Message: ' + $payload.toString());

        switch($topic) {
            case (shadowName + '/' + 'status'):
                console.log('Caught Status');
                var payloadObj = JSON.parse($payload.toString());
                for(var key in payloadObj['state']['desired']){
                    var col = key.toString().split('_')[0];
                    var row = key.toString().split('_')[1];
                    var state = payloadObj['state']['desired'][key];
                    self.updateDB(col, row, state);
                }

                self.emit('updatefrommqtt', payloadObj);
                break;

            case (shadowName + '/' + 'get'):
                console.log('Caught Get');
                var shadowObj = {
                    "state":{
                        "desired":{
                        }
                    }
                };

                self.getFullShadowState(function($stateObj){
                    console.log('Full Shadow Callback');
                    shadowObj.state.desired = $stateObj;
                    client.publish(shadowName + '/' + 'status', JSON.stringify(shadowObj));
                });

                console.log('before break');
                break;

            default:
                console.log('Unknown Topic');
                break;
        }

    });

    this.getFullShadowState = function($callback){

        self.db.all("SELECT * FROM shadow_tbl", function (err, all) {
            var stateObj = {};
            for(var i = 0; i < all.length; i++){
                var id = all[i].id;
                var row = Math.floor(id / 8);
                var col = id % 8;
                var objName = col.toString() + '_' + row.toString();
                stateObj[objName] = all[i].state;
            }

            $callback(stateObj);
        });
        console.log('End of getFullShadowState');
    };

    this.fileExists = function($path){
        try{
            fs.statSync($path);
        }catch(err){
            if(err.code == 'ENOENT') return false;
        }
        return true;
    };

    this.dbSetup = function($dbFilePath){
        var exists = self.fileExists($dbFilePath);
        self.db = new sqlite3.Database($dbFilePath);
        self.db.serialize(function(){
            if(!exists){
                self.db.run('CREATE TABLE shadow_tbl (id INT NOT NULL, state TEXT NOT NULL)');
                //Pre populate
                var statement = self.db.prepare("INSERT INTO shadow_tbl (id, state) VALUES (?,?)");

                for(var i = 0; i < (8*8); i++){
                    statement.run(i, "false");
                }

                //Insert
                statement.finalize();
            }

            //Print out current state
            self.db.each("SELECT rowid AS id, state FROM shadow_tbl", function(err, row){
                console.log(row.id + ": " + row.state);
            });

        });

    };

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
        var key;
        for(var prop in stateObj.state.desired){

            if(stateObj.state.desired.hasOwnProperty(prop) && prop.split('_').length == 2){
                key = prop;
                break;
            }
        }

        var col = parseInt(key.split('_')[0]);
        var row = parseInt(key.split('_')[1]);
        var state = stateObj.state.desired[key];
        self.updateDB(col, row, state);

        console.log('Publish Desired Update');
        client.publish(shadowName + '/' + 'status', JSON.stringify(stateObj));
    };

    this.requestCurrentShadow = function(){
        client.publish(shadowName + '/' + 'get', 'fullshadow');
    };

    this.updateDB = function($col, $row, $state){
        var id = parseInt($row) * 8 + parseInt($col);
        console.log('Updating DB: ', $col, $row, id, $state.toString());
        self.db.serialize(function(){
            self.db.run("BEGIN TRANSACTION")
                .run("UPDATE shadow_tbl SET state = ? WHERE id = ?", [$state.toString(), id])
                .exec("COMMIT");
        });
    };

};

util.inherits(JACMQTTClient, Events.EventEmitter);
module.exports = JACMQTTClient;