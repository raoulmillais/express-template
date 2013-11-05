#! /usr/bin/env node

var express = require('express'),
	path = require('path'),
	pkg = require('./package'),
	app = express(),
	server = require('http').createServer(app),
	hbjs = require('express3-handlebars'),
	routes = require('./routes'),
	port = 3000,
	url  = 'http://localhost:' + port + '/';

if(process.env.SUBDOMAIN){
	url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

// configuration
app.engine('handlebars', hbjs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.logger());
app.use(express.compress());
app.use(express.favicon(__dirname + '/client/images/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'client')));
if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);

// startup
server.listen(port);
console.log("%s server listening on port %s", pkg.name, port);
console.log(url);
