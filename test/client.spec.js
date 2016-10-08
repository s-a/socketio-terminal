"use strict";
process.env.NODE_ENV = "test";

  var Server = require("./../lib/server/index.js");
  var Cli = new require("n-cli");
  var cliServer = new Cli({ 
    handleUncaughtException : false,
    argv : ["--keyfolder", __dirname]
  });
  var server = new Server(cliServer);
  server.run();
  
var Config = require("user-appdata");
Config.prototype.set = function (settings) {
  this.settings = settings;
};
// setup

var Client = require("./../lib/client/index.js");
 
var path = require("path"); 
var should = require("should");
 


var testClient = function(argvArray){
  var NCli = new require("n-cli");
  var ncli = new NCli({ 
    handleUncaughtException : false,
    argv : argvArray
  });

  var client = new Client(ncli);
  return client;
} 

 

describe("#client", function () {
   it("should throw exception private-key-encrypt-error when using wrong username", function () { 
    should(function(){
      testClient(["client", 
      "--privatekey", path.join(__dirname, "deployager_rsa"), 
      "--publickey", path.join(__dirname, "deployager_rsa.pem"), 
      "--passphrase", "deployaga", 
      "--username", "deployager",  
      "--host", "localhost", 
      "--port", 8080]).connect();
    }).throw("private-key-encrypt-error");
  });

  it("should throw missing-parameter", function () { 
    should(function(){
      testClient(["client"]).connect();
    }).throw("missing-parameter");
  });

  it("should connect fine and execute command", function (done) {  
    var c = testClient([
      "client", 
      "--privatekey", path.join(__dirname, "deployager_rsa"), 
      "--publickey", path.join(__dirname, "deployager_rsa.pem"), 
      "--passphrase", "deployager", 
      "--username", "deployager",  
      "--host", "localhost", 
      "--port", "8080"]
    );
    var remotecommandDone = function(data){
      try{
        c.socket.disconnect();
      } catch(e) {}
        server.close(); 
        done(); 
    }; 

    var handlers = {
      connect : function (){
        c.executeOnServer({
          command : "do something",
          event : "server-did-something"
        }, remotecommandDone);
      }
    };
    c.connect(handlers);  
  });
  
});
