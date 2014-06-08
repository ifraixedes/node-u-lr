Micro LiveReload Server
=============================
![Downloads](http://img.shields.io/npm/dm/u-lr.svg)  ![Dependencies status](https://david-dm.org/ifraixedes/node-u-lr.png) [![MIT Licensed](http://img.shields.io/badge/license-MIT-blue.svg)](#license)

Micro Live Reload server is a websocket server which delivers a message whenever `notifyReload` server instance method is called; the only purpose of it is as a development tool.

__NOTE__: My aim to build this server was because I faced a problem with common [tiny-lr](https://github.com/mklabs/tiny-lr) server which implements [LiveReload](http://livereload.com/) wide extended live reload protocol and [gulp-livereload](https://github.com/vohof/gulp-livereload) and after I spent some hours figuring out the issue and I couldn't find it, I developed it and later on, I found a [workaround](https://github.com/vohof/gulp-livereload/pull/29), therefore I discourage to use it as a replacement of any __LiveReload implementation__ and the implementation will remain here as historical documentation.

__Be aware that its project is not currently maintained__

## Introduction
It is a module which exports a Server class method whose instances wrap a websocket server built with [engine.io](https://github.com/automattic/engine.io) that allows to send a websocket message (client side must use [engine.io-client](https://github.com/automattic/engine.io-client) which a basic implementation of a [browserify](https://github.com/substack/node-browserify) module is delivered by this server) each time that `notifyReload` of a server instances is called.

When the provided client side script for this server is used, it basically reloads the page calling in the browser `window.location.reload()`, without any other secret.

## Usage
### Install
`npm install u-lr`

### Functionality
The module export a Server class method whose constructor accept an options object which is provided straightaway to [attach of an instance of engine.io#Server](https://github.com/automattic/engine.io#methods-1), with only one optional parameter more, `port`, which is the port number to use by the HTTP Server and by default, it listens on 49000.

Each Server instance has three methods:
- start
- stop
 - notifyReload

All of them, __only receive one parameter__, a `callback` function, which is called with an `error` object if it something goes wrong, the well-known callback node convention.

`start` and `stop` are self-explained.
`notifyReload` is used to notify to server to send a websocket message to warn to the connected socket clients to reload the page.

The client side must be a [engine.io-client](https://github.com/automattic/engine.io-client) which listens messages (`message` event) which receive a data packet with a JSON object always with this values:
```javascript
{
	message: 'reload'
	data: {
		type: '*'
	}
}
```

The message content is not significant, because it only delivers one message and always with the same value, but I thought to use it, than an empty message, to easy backward compatibility if in some point I decided to extend it.

The server is a HTTP server with only has one route `/require-module`, any other request, it will send back a response with status code `501 Not Implemented`.

The mentioned route, send a [browserify](https://github.com/substack/node-browserify) module (javascript file) with a self container `require` function definition; this module can be required using `require('u-lr')`, which exports a function that receives one optional parameters, an object with this options:
- host: The host where the server is listening, by default `localhost`
- port: The port where the server is listening, by default `49000`

When the exported function is called, a client websocket connection is stablished and a `message` event listener is registered, which reload the page whenever a message is received.

##License
Just MIT, read LICENSE file for more information.
