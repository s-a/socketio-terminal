# socketio-terminal





* * *

## Class: Client


### socketio-terminal.Client..(ncli) 

**Parameters**

**ncli**: `object`, Instance of n-cli.


**Example**:
```js
var Server = require("socketio-terminal/server");
var NCli = new require("n-cli");
var ncli = new NCli({ 
handleUncaughtException : false,
	argv : [
		"--privatekey", "./test/deployager_rsa", 
		"--publickey", "./test/deployager_rsa.pem", 
		"--passphrase", "deployager", 
		"--username", "deployager", 
		"--host", "localhost", 
		"--port", "8080"	 
	]
});
var server = new Server(ncli);
server.run(); 
```

### socketio-terminal.Client.executeOnServer(command, done) 

**Parameters**

**command**: `string`, shell command to execute.

**done**: `function`, event handler triggered when server was started.


### socketio-terminal.Client.connect(command, handlers) 

**Parameters**

**command**: `string`, shell command to execute.

**handlers**: `object`, bundle of event handlers handlers {connect:onconnect, event:onevent, disconnect:ondisconnect}.




* * *










