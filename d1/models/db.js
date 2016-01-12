//var settings = require('../settings'),
//	Db = require('mongodb').Db,
//	Connection = require('mongodb').Connection,
//	Server = require('mongodb').Server;
//module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});
var mongoose = require('mongoose');
var settings = require('../settings');
var db = mongoose.createConnection(settings.connectionOptions);
//mongoose.connect(settings.connectionOptions);
//module.exports = mongoose;

module.exports = db;
