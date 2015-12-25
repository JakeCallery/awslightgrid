'use strict';
process.title = "LBSocketServer";
var LGSocketServer = require('./LGSocketServer.js');
var lgss = new LGSocketServer('LGSocketServer');

var port = process.env.PORT || 5252;
lgss.start(port);