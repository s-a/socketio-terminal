"use strict";
   
var Crypt = require("ppkey");
var express = require("express");
var Config = require("user-appdata");
var http = require("http");
var path = require("path");
var app = express();

 
function Server(ncli){
	this.ncli = ncli;
	this.port = this.ncli.argv.port || 8080;
	this.config = new Config({appname : "deployager-server", defaultSettings : {}});
	var Branding = require("./branding.js");
	var branding = new Branding();
 
	branding.log(this);

	return this;
}
 

Server.prototype.onioAuthorization = function(query, handshake, callback){
	var crypt = new Crypt();
	var authorized = false;
	try{
		var publicKeyFilename;
		if (process.env.NODE_ENV === "test" || this.ncli.argv.test === true){
			publicKeyFilename = path.join(__dirname, "..", "..", "test", "key_rsa.pem");
		} else {
			publicKeyFilename = path.join(this.ncli.argv.notNull("dataFolder"), query.uid + "_rsa.pem");
		}
		crypt.loadKeys({public : publicKeyFilename});
		if (crypt.verify(query.uid, query.sign)){
			authorized = true;
		} else {
			throw this.ncli.Error("authentification-error", query ) ;
		}
	} catch(e){
		throw this.ncli.Error("authentification-error", query + "\n" + e.message );
	}

	callback(null, authorized);
};

Server.prototype.onioConnection = function(server, socket){
	this.ncli.log("hi", socket.handshake.query.uid  );
	var self = this;
	// Listen on the client and send any input to the terminal
	socket.on("server-input", function(data){
		self.ncli.log("server-input", data); 
		socket.emit("server-input-done", {text:"i did something"})
	});

	// When socket disconnects, destroy the terminal
	socket.on("disconnect", function(){
		this.ncli.log("bye");
	});

	socket.on("error", function(err){
		this.ncli.stderr(err);
	});
};

Server.prototype.close = function() {
	this.server.close();
};

Server.prototype.run = function(done) {
	this.server = http.createServer(app).listen(this.port, done);
	var io = require("socket.io")(this.server);
	var self = this;

	// When a new socket connects
	io.on("connection", function(socket){
		self.onioConnection(self, socket);
	});
	io.set("authorization", function(handshake, callback){
		self.onioAuthorization(handshake._query, handshake, callback);
	});
};

module.exports = Server;
