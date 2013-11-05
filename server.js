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

if (process.env.NODE_ENV === 'production' || process.argv[2] === 'production') {
	console.log('Running in production');
	app.set('env', 'production');
} else {
	app.set('env', 'development');
}

/*
* Per-environment config
*/
if (app.get('env') === 'development') {
	app.set('views', __dirname + '/views');
	app.use(express.static(path.join(__dirname, '.tmp')));
	app.use(express.static(path.join(__dirname, 'client')));
	app.use(express.logger('dev'));
	app.use(express.favicon(__dirname + '/client/images/favicon.ico'));
	app.use(express.errorHandler());
} else if (app.get('env') === 'production') {
	app.set('views', __dirname + '/dist/views');
	app.use(express.static(path.join(__dirname, 'dist/client')));
	app.use(express.logger());
	app.use(express.favicon(__dirname + '/dist/client/images/favicon.ico'));
}

// configuration
app.engine('handlebars', hbjs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);

// routes
app.get('/', routes.index);

// startup
server.listen(port);
console.log("%s server listening on port %s", pkg.name, port);
console.log(url);
