#!/usr/bin/env node

"use strict";

var Cli = new require("n-cli");
var cli = new Cli({
  handleUncaughtException : true
});

cli.on("server", function(){
    var Server = require("./server/index.js");
    var server = new Server(this);
    server.run(function(){
      cli.stdout("server started at " + server.port + "\n");
    }); 
}); 
     
cli.on("client", function(){
    var Client = require("./client/index.js");
    var client = new Client(this);
    client.connect({connected : function(){
      cli.stdout("client started at " + client.port + "\n");
    }}); 
});