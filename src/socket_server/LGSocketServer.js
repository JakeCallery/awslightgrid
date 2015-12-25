/**
 * Created by Jake on 12/25/2015.
 */

module.exports = LGSocketServer;

var Events = require('events');
var HTTP = require('http');
var WebSocketServer = require('websocket').server;

function LGSocketServer($id){
    //Super
    Events.EventEmitter.call(this);
    var self = this;

    var protocol = 'lgproto';
    this.id = $id;

    var port = null;
    var connections = [];
    var clients = [];
    var httpServer = null;
    var wss = null;

    this.start = function($port){
        port = $port;
        httpServer = HTTP.createServer(onCreateServer);

        wss = new WebSocketServer({
            httpServer: httpServer,
            autoAcceptConnections: false
        });

        wss.addListener('request', handleWSRequest);
        httpServer.listen(port, onServerListen);

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
            client.addListener('close');
            client.addListener('message', handleClientMessage);
            clients.push(client);

            var connectObj = {};
            connectObj.clientId = client.id;
            connectObj.clientType = client.type;
            connectObj.clients = [];
            for (var r = 0; r < clients.length; r++) {
                connectObj.clients.push({clientId: group.clients[r].id, clientType: group.clients[r].type});
            }
            console.log('Connect String: ' + connectObj);
            var msg = new Message(SERVER_ID, Message.CONNECT, connectObj);
            client.sendMessage(msg, JSON.stringify(msg));
        }

    };

    var handleConnClose = function($client, $reasonCode, $description){
        console.log('Client Disconnect: ' + $client);
        var connection = $client.connection;
        console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected. / ' + $reasonCode + ': ' + $description);
        connections.splice($client.connectionIndex, 1);
        var index = this.clients.indexOf($client);
        self.clients.splice(index,1);
        $client.removeListener('close', handleConnClose);
    };

    var handleClientMessage = function($client, $msg){
        console.log('ClientMessage: ' + $client.id + ' / ' + $msg.data);
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