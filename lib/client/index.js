"use strict";

var Crypt = require("ppkey");   
var waiting = false;

function Client(ncli) { 
	this.ncli = ncli; 
	this.machine = "server";  
  	var Branding = require("./branding.js");
	var branding = new Branding(); 
	branding.log(this); 
	return this;
}  

Client.prototype.executeOnServer = function(data, done){
	var self = this;
	self.socket.emit("server-input", data); 
	self.socket.once("server-input-done", function(data){ 
		done(data); 
	});
};

Client.prototype.getCommandlinePrefix = function (){
	var color = this.ncli.color.yellow; 
	var result = color.bold(process.cwd()) + " --> " + color(this.ncli.argv.username + "@" + this.ncli.argv.host + ":" + this.ncli.argv.port + "> ");
 
	return result;
};

 

Client.prototype.connect = function(handlers){
	var crypt = new Crypt();
	var theSign = ""; 
	try{
		//var passphrase = crypt.simpleDecrypt(this.ncli.argv.passphrase, this.ncli.argv.username);
	} catch(e){
		// throw new this.ncli.Error("private-key-error", "error loading private key \"" + this.ncli.argv.privatekey + "\"");
	}
	crypt.loadKeys({private : this.ncli.argv.notNull("privatekey"),  passphrase: this.ncli.argv.notNull("passphrase")});
	try{
		theSign = crypt.encrypt(this.ncli.argv.notNull("username"));
	} catch(e){
		console.error(e);
		throw new this.ncli.Error("private-key-encrypt-error", "error encrypting data with private key \"" + this.ncli.argv.privatekey + "\". Maybe the wrong passphrase?");
	}
	var url = "http://" + this.ncli.argv.host + ":" + this.ncli.argv.port + "?uid=" + this.ncli.argv.username + "&sign=" + theSign;


	this.ncli.stdout("connecting " + this.ncli.argv.username + "@" + this.ncli.argv.notNull("host") + ":" + this.ncli.argv.notNull("port") + "\n");

	this.socket = require("socket.io-client")(url);
	var f = function(){};
	this.init();
	this.socket.on("connect", handlers.connect || f);
	this.socket.on("event", handlers.event || f);
	this.socket.on("disconnect", handlers.disconnect || f); 
};

Client.prototype.init = function(){
	var self = this;

	process.stdin.on("data", function (data) {
		process.stdin.pause();
			var command = data.toString().trim();
			if (command.toLowerCase() === "exit" || command.toLowerCase() === "bye"){
				self.socket.disconnect();
			} else {
				self.ncli.stdout("...\n");
				var remotecommandDone = function(data){
					if (data.exitcode === 0){
						self.ncli.stdout(self.ncli.color.green("exitcode: " + data.exitcode + "\n")); 
					} else {
						self.ncli.stderr(self.ncli.color.red("exitcode:" + data.exitcode + " "));
						self.ncli.stderr(self.ncli.color.red(data.stderr + "\n"));
					}
					self.ncli.stdout("$ ");
					process.stdin.resume(); 
				}; 

				self.executeOnServer({
					command : command
				}, remotecommandDone); 
			}

	});

	if (this.socket){
		this.socket.on("server-output", function(data){   
			self.ncli.stdout(data.stdout);
		}); 
		this.socket.on("connect", function(){  
			self.ncli.stdout(self.getCommandlinePrefix() + "\n$ ");
		}); 

		this.socket.on("error", function(data){
			throw new this.ncli.Error("socket-error", data);
		});

		this.socket.on("disconnect", function(){
			self.ncli.stdout("disconnected.\n"); 
		});
	}

	return this;
};





module.exports = Client;
