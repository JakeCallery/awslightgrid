/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'libs/domReady!',
    'jac/logger/Logger',
    'jac/logger/ConsoleTarget',
    'json2',
    'app/SocketClient'
],
    function (doc, L, ConsoleTarget, JSON, SocketClient) {
        return function(){
            L.addLogTarget(new ConsoleTarget());
            L.log('New Main!');

            var client = null;

            L.log('New Socket Client');
            client = new SocketClient();
            L.log('Before Connect');
            client.connect('ws://1.tcp.ngrok.io:20674', 'lgproto');
            L.log('After Connect');
        }();
    });