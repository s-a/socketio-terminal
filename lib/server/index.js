"use strict";
   
var Crypt = require("ppkey");
var express = require("express"); 
var http = require("http");
var path = require("path");
var app = express();
var sh = require("shelljs"); 

 
function Server(ncli){
	this.ncli = ncli;
	this.port = this.ncli.argv.port || 8080; 
	var Branding = require("./branding.js");
	var branding = new Branding(); 
	branding.log(this);

	return this;
}
 
 
Server.prototype.executeLocal = function(command, ondata, done){ 
	var child = sh.exec(command, {async: true, silent:(process.env.NODE_ENV === "test")}, done);
	child.stdout.on("data", ondata); 
};

Server.prototype.onioAuthorization = function(query, handshake, callback){
	var crypt = new Crypt();
	var authorized = false; 
	var publicKeyFilename;
 
	publicKeyFilename = path.join((this.ncli.argv.keyfolder || this.ncli.config.dataFolder), query.uid + "_rsa.pem");
 
	crypt.loadKeys({public : publicKeyFilename});
	if (crypt.verify(query.uid, query.sign)){
		authorized = true;
	} else {
		throw this.ncli.Error("authentification-error", query ) ;
	} 

	callback(null, authorized);
};

Server.prototype.onioConnection = function(server, socket){
	this.ncli.log("hi", socket.handshake.query.uid  );
	var self = this; 
	
	socket.on("server-input", function(data){
		self.ncli.log("server-input",  socket.handshake.query.uid, data); 
		
		var ondata = function(text){
			socket.emit("server-output", {stdout: text});
		};

		var done = function(exitcode, stdout, stderr){
			socket.emit("server-input-done", {exitcode:exitcode, stdout:stdout, stderr:stderr});
		};
		debugger;
		self.executeLocal(data.command.toString(), ondata, done); 
	});
 
	socket.on("disconnect", function(){
		self.ncli.log("bye", socket.handshake.query.uid);
	});

	socket.on("error", function(err){
		self.ncli.stderr(err);
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
