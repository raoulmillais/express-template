# Opinionated Express App Template

A stripped down, slightly less opinionated version of appleYak's [grunt-express-workflow](https://github.com/appleYaks/grunt-express-workflow)

## Pre-requisites

`npm install -g yo node-inspector nodemon grunt-cli`

## What's included?

### Server
* Express
* Handlebars view engine

### Client
* Compass and SASS
* SASS version of twitter bootstrap
* Lodash
* jQuery

### Build
* jshint
* Preconfigured grunt for clientside productionisation: run `grunt build`
* Preconfigured grunt for watching with nodemon and node-inspector for 
debugging: run `grunt server`
* Watching (without a running server): run `grunt watch`
* Compass / Sass compilations, css minification, clean and copy

## TODO

* Configure requirejs
* Test on nodejitsu
