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
    'json2',
    'app/SocketMessage',
    'app/events/ButtonUpdateFromUIEvent',
    'app/events/ButtonUpdateFromSocketEvent',
    'app/MessageTypes'
],
    function (EventDispatcher, ObjUtils, L, JacEvent,
              EventUtils, GEB, JSON, SocketMessage,
              ButtonUpdateFromUIEvent, ButtonUpdateFromSocketEvent,
              MessageTypes
    ) {
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

                this.geb = new GEB();
                this.socket = null;

                this.handleButtonUpdateFromUIDelegate = EventUtils.bind(self, self.handleButtonUpdateFromUI);
                this.geb.addEventListener(ButtonUpdateFromUIEvent.UPDATE, self.handleButtonUpdateFromUIDelegate);

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

                    self.geb.dispatchEvent(new ButtonUpdateFromSocketEvent(ButtonUpdateFromSocketEvent.UPDATE, msg));

                };

                this.connect = function($connectURL, $protocol){
                    L.log('Trying to connect to: ' + $connectURL);
                    this.socket = new WebSocket($connectURL, $protocol);
                    this.socket.addEventListener('open', handleSocketOpen);
                    this.socket.addEventListener('close', handleSocketClose);
                    this.socket.addEventListener('error', handleSocketError);
                    this.socket.addEventListener('message', handleSocketMessage);
                };

                this.sendMessage = function($msgType, $data){
                    var msg = {};
                    msg.messageType = $msgType;
                    msg.dataType = 'utf8';
                    msg.data = {};

                    //Copy data
                    for(var prop in $data){
                        if($data.hasOwnProperty(prop)){
                            msg.data[prop] = $data[prop];
                        }
                    }

                    this.socket.send(JSON.stringify(msg));
                };
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(SocketClient, EventDispatcher);
            var p = SocketClient.prototype;

            p.handleButtonUpdateFromUI = function($e){
                L.log('UI Update: '+ $e.data.col, $e.data.row, $e.data.state);
                this.sendMessage(MessageTypes.BUTTON_UPDATE,
                    {
                        col:$e.data.col,
                        row:$e.data.row,
                        state:$e.data.state
                    }
                );
            };

            //Return constructor
            return SocketClient;
        })();
    });
