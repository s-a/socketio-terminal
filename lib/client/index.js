"use strict";

var Crypt = require("ppkey");
var chalk = require("chalk");  

var Config = require("user-appdata"); 

var waiting = false;

function Client(ncli) { 
	this.ncli = ncli; 
	this.machine = "server";
	this.config = new Config({appname : ncli.packageJson.settings.name + "-client", defaultSettings : {}});
  
	var pack = require("./../../package.json");
	var s = "";
	s += "________                .__                                             \n";
	s += "\\______ \\   ____ ______ |  |   ____ ___.__._____     ____   ___________ \n";
	s += " |    |  \\_/ __ \\\\____ \\|  |  /  _ <   |  |\\__  \\   / ___\\_/ __ \\_  __ \\\n";
	s += " |    `   \\  ___/|  |_> >  |_(  <_> )___  | / __ \\_/ /_/  >  ___/|  | \\/\n";
	s += "/_______  /\\___  >   __/|____/\\____// ____|(____  /\\___  / \\___  >__|   \n";
	s += "        \\/     \\/|__|               \\/         \\//_____/      \\/       \n";
	s += "v" + pack.version + chalk.gray(" - " + this.config.filename) ;
 
	ncli.stdout(s);
 
	return this;
}
Client.prototype.run = function (){
};

 

 

 Client.prototype.executeOnServer = function(data, done){
	var self = this;
	self.socket.emit("server-input", data); 
	self.socket.once("server-input-done", function(data){ 
		done(data); 
	});
 };

Client.prototype.getCommandlinePrefix = function (){
	var color = chalk.yellow; 
	var result = color.bold(process.cwd()) + " --> " + color(this.config.settings.username + "@" + this.ncli.argv.host + ":" + this.ncli.argv.port + "> ");
 
	return result;
};

 

Client.prototype.connect = function(connect){
	var crypt = new Crypt();
	var theSign = ""; 
	try{
		//var passphrase = crypt.simpleDecrypt(this.ncli.argv.passphrase, this.ncli.argv.username);
		crypt.loadKeys({private : this.ncli.argv.privatekey,  passphrase: this.ncli.argv.passphrase});
	} catch(e){
		throw new this.ncli.Error("private-key-error", "error loading private key \"" + this.ncli.argv.privatekey + "\"");
	}
	try{
		theSign = crypt.encrypt(this.ncli.argv.username);
	} catch(e){
		console.error(e);
		throw new this.ncli.Error("private-key-encrypt-error", "error encrypting data with private key \"" + this.ncli.argv.privatekey + "\". Maybe the wrong passphrase?");
	}
	var url = "http://" + this.ncli.argv.host + ":" + this.ncli.argv.port + "?uid=" + this.ncli.argv.username + "&sign=" + theSign;


	this.ncli.stdout("connecting " + this.ncli.argv.username + "@" + this.ncli.argv.notNull("host") + ":" + this.ncli.argv.notNull("port"));

	this.socket = require("socket.io-client")(url);
	this.init();
	this.socket.on("connect", connect);
	this.socket.on("event", function(data){});
	this.socket.on("disconnect", function(){}); 
};

Client.prototype.init = function(){
	var self = this;

	process.stdin.on("data", function (data) {
		if (!waiting){
			var command = data.toString().trim();
			if (command.toLowerCase() === "exit" || command.toLowerCase() === "bye"){
				self.socket.disconnect();
			}

			if (command.toLowerCase() === "use server"){
				self.useMachine("server");
				return;
			}

			if (command.toLowerCase() === "use client"){
				self.useMachine("client");
				return;
			}
			if (self.machine === "server"){
				this.ncli.stdout("wait for remote command response..\n.");
				waiting = true;
				self.socket.emit("input", {command : command});
			}
		}
	});

	if (this.socket){
		this.socket.on("connect", function(){  
			self.ncli.stdout(chalk.green("connected to " + self.config.settings.username + "@" + self.ncli.argv.host + ":" + self.ncli.argv.port ) + "\n");
			self.ncli.stdout(self.getCommandlinePrefix() + "\n");
			//self.socket.emit("input", cmd);
		}); 

		this.socket.on("error", function(data){
			throw new this.ncli.Error("socket-error", data);
		});

		this.socket.on("disconnect", function(){
			self.ncli.log(self, "socket-disconnect");
			//throw new this.ncli.Error("socket-disconnect");
		});
	}

	return this;
};





module.exports = Client;
