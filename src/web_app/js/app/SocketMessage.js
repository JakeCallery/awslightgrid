/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([],
    function () {
        return (function () {
            /**
             * Creates a SocketMessage object
             * @constructor
             */
            function SocketMessage($messageType, $data, $dataType) {
                this.messageType = $messageType;
                this.data = $data;
                this.dataType = $dataType || SocketMessage.DATA_UTF8;
            }

            SocketMessage.DATA_UTF8 = 'utf8';
            SocketMessage.DATA_BINARY = 'binary';
            SocketMessage.CONNECT = 'connect';

            //Return constructor
            return SocketMessage;
        })();
    });
