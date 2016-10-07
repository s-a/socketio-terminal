"use strict";

function Branding(){
    return this;
}

Branding.prototype.log = function(server){
    var cli = server.ncli;
    var color = server.ncli.color;
    cli.stdout("\n");
    cli.stdout("               _____===_____\n");
    cli.stdout("        ______/-------------\\______\n");
    cli.stdout("       `-----------| O |-----------´\n");
    cli.stdout("              `-\---`---´---/-´\n");
    cli.stdout("                `-._===_.-´         " + color.bold.yellow("port:") + color.yellow(server.port) + "\n");
    cli.stdout("---------------------------------------------\n"); 
    cli.stdout(color.bold.yellow("Public key folder : "));
    cli.stdout(color.yellow(cli.config.dataFolder) + "\n\n");
};

module.exports = Branding;