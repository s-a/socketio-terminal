# socketio-terminal





* * *

## Class: Server


### socketio-terminal.Server.Constructor(ncli) 

**Parameters**

**ncli**: `object`, Instance of n-cli.


**Example**:
```js
var Server = require("socketio-terminal/server");
var NCli = new require("n-cli");
var ncli = new NCli({ 
handleUncaughtException : false,
	argv : ["--keyfolder", __dirname]
});
var server = new Server(ncli);
server.run(); 
```

### socketio-terminal.Server.close() 

Disconnect all clients and close server.


### socketio-terminal.Server.run(done) 

**Parameters**

**done**: `function`, event handler triggered when server was started.




* * *










