/**
 * Created by Jake on 12/25/2015.
 */

module.exports = LGSocketServer;

var Events = require('events');
var HTTP = require('http');
var WebSocketServer = require('websocket').server;
var Client = require('./Client.js');
var Message = require('./Message.js');
var MQTTClient = require('./MQTTClient');

var SERVER_ID = 0;

function LGSocketServer($id){
    //Super
    Events.EventEmitter.call(this);
    var self = this;

    var protocol = 'lgproto';
    this.id = $id;

    var port = null;
    var connections = [];
    var httpServer = null;
    var wss = null;
    var mqttClient = null;

    self.clients = [];

    this.start = function($port){
        port = $port;
        httpServer = HTTP.createServer(onCreateServer);

        wss = new WebSocketServer({
            httpServer: httpServer,
            autoAcceptConnections: false
        });

        wss.addListener('request', handleWSRequest);
        httpServer.listen(port, onServerListen);

        mqttClient = new MQTTClient('LGSocketServerClient');
    };

    var checkValidProtocol = function($protoList){
        for(var i = 0; i < $protoList.length; i++){
            if($protoList[i] == protocol){
                return true;
            }
        }

        return false;
    };

    var handleWSRequest = function($request) {
        console.log(new Date() + 'Caught Request: ' + $request.origin);
        if (checkOriginAllowed($request.origin) === false) {
            $request.reject();
            console.log((new Date()) + ' Connection from origin ' + $request.origin + ' rejected.');
        } else if (!checkValidProtocol($request.requestedProtocols)) {
            $request.reject();
            console.log((new Date()) + ' Connection using bad protocol ' + $request.requestedProtocols + ', rejected.');
        } else {
            var conn = $request.accept(protocol, $request.origin);
            console.log((new Date()) + ' Connection accepted.');

            var connectionIndex = connections.push(conn) - 1;
            var client = new Client(conn, connectionIndex);
            client.addListener('close', handleConnClose);
            client.addListener('message', handleClientMessage);
            self.clients.push(client);

            var msg = new Message(SERVER_ID, Message.CONNECT);
            client.sendMessage(msg, JSON.stringify(msg));
        }

    };

    var handleConnClose = function($client, $reasonCode, $description){
        console.log('Client Disconnect: ' + $client);
        var connection = $client.connection;
        console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected. / ' + $reasonCode + ': ' + $description);
        connections.splice($client.connectionIndex, 1);
        var index = self.clients.indexOf($client);
        self.clients.splice(index,1);
        $client.removeListener('close', handleConnClose);
    };

    var handleClientMessage = function($client, $msg){
        console.log('ClientMessage: ' + $client.id + ' / ' + $msg.messageType + ' / ' + $msg.data);
        console.log($msg.data);
    };

    var checkOriginAllowed = function($origin){
        //TODO: Actual origin checking
        return true;
    };

    var onCreateServer = function($request, $response){
        console.log((new Date()) + ' HTTP Received request for ' + $request.url);
        $response.writeHead(404);
        $response.end();
    };

    var onServerListen = function(){
        console.log((new Date() + ' Server is listening on port ' + port));
    };

}