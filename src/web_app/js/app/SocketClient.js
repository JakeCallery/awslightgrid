/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'jac/events/EventDispatcher',
    'jac/utils/ObjUtils',
    'jac/logger/Logger',
    'jac/events/JacEvent',
    'jac/utils/EventUtils',
    'jac/events/GlobalEventBus',
    'json2'
],
    function (EventDispatcher, ObjUtils, L, JacEvent, EventUtils, GEB, JSON) {
        return (function () {
            /**
             * Creates a SocketClient object
             * @extends {EventDispatcher}
             * @constructor
             */
            function SocketClient() {
                //super
                EventDispatcher.call(this);

                var self = this;
                var geb = new GEB();
                //var connectURL = 'tcp://1.tcp.ngrok.io:20674';

                var handleSocketOpen = function($e){
                    L.log('Connected...');
                };

                var handleSocketError = function($e){
                    L.log('Socket Error: ' + $e);
                };

                var handleSocketClose = function($e){
                    L.log('Socket Closed');
                };

                var handleSocketMessage = function($e){
                    var msg = JSON.parse($e.data);
                    var data = msg.data;

                    L.log('Caught message: ');
                    L.log(msg);

                };

                this.connect = function($connectURL, $protocol){
                    L.log('Trying to connect to: ' + $connectURL);
                    var socket = new WebSocket($connectURL, $protocol);
                    socket.addEventListener('open', handleSocketOpen);
                    socket.addEventListener('close', handleSocketClose);
                    socket.addEventListener('error', handleSocketError);
                    socket.addEventListener('message', handleSocketMessage);
                };
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(SocketClient, EventDispatcher);

            //Return constructor
            return SocketClient;
        })();
    });
