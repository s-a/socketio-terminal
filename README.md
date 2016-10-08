# socketio-terminal [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A client server solution which acts like SSH but communicates via socket.io.

## Installation

```sh
$ npm install [-g|--save] socketio-terminal
```

## Usage
### Shell
```sh
$ socketio-terminal client [--keyfolder ./test/];
$ socketio-terminal server --privatekey ./test/deployager_rsa --publickey ./test/deployager_rsa.pem --passphrase deployager --username deployager --host localhost --port 8080;
```
### Programmatically
 - [Client API](/API/CLIENT.md) 
 - [Server API](/API/SERVER.md) 

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
