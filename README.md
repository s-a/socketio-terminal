# socketio-terminal [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A client server module which acts like SSH but communicates via socket.io.

## Installation

```sh
$ npm install [-g|--save] socketio-terminal
```

## Usage
### Shell
```sh
$ socketio-terminal server [--keyfolder ./test/] [--port 8080];
$ socketio-terminal client --privatekey ./test/deployager_rsa --publickey ./test/deployager_rsa.pem --passphrase deployager --username deployager --host localhost --port 8080;
```
### Programmatically
API was born while TDD. If you need more public APIs please send a PR.
 - [Client API](/API/CLIENT.md) 
 - [Server API](/API/SERVER.md) 

## Limitations
Server cannot handle shell commands that require user stdinput while execution. If anyone knows a solution for this limitation then please add an issue at this repo!

## License

MIT © [s-a](https://github.com/s-a)


[npm-image]: https://badge.fury.io/js/socketio-terminal.svg
[npm-url]: https://npmjs.org/package/socketio-terminal
[travis-image]: https://travis-ci.org/s-a/socketio-terminal.svg?branch=master
[travis-url]: https://travis-ci.org/s-a/socketio-terminal
[daviddm-image]: https://david-dm.org/s-a/socketio-terminal.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/s-a/socketio-terminal
[coveralls-image]: https://coveralls.io/repos/s-a/socketio-terminal/badge.svg
[coveralls-url]: https://coveralls.io/r/s-a/socketio-terminal
