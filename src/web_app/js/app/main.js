/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'libs/domReady!',
    'jac/logger/Logger',
    'jac/logger/ConsoleTarget',
    'json2',
    'app/SocketClient',
    'app/LGManager',
    'jac/utils/DOMUtils',
    'jac/logger/LogLevel'
],
    function (doc, L, ConsoleTarget, JSON, SocketClient, LGManager, DOMUtils, LogLevel) {
        return function(){
            L.addLogTarget(new ConsoleTarget());
            L.isEnabled = true;
            var client = null;
            L.levelFilter = (LogLevel.DEBUG | LogLevel.INFO | LogLevel.WARNING | LogLevel.ERROR);
            L.debug('New Main!');

            var num_cols = 8;
            var num_rows = 8;

            //set up button divs
            //<div id="00_01" class="gridButton"></div>
            var gridDivEl = doc.getElementById('GridDiv');
            for(var r = 0; r < num_rows; r++){
                for(var c = 0; c < num_cols; c++){
                    var el = doc.createElement('div');
                    el.id = c.toString() + '_' + r.toString();
                    el.className = 'gridButton';
                    gridDivEl.appendChild(el);
                }
            }



            var lgManager = new LGManager(window, doc);
            lgManager.initGrid(num_cols,num_rows);
            L.debug('New Socket Client');
            client = new SocketClient();
            L.debug('Before Connect');
            client.connect('ws://1.tcp.ngrok.io:20674', 'lgproto');
            L.debug('After Connect');

        }();
    });