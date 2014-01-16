"use strict";
var connect = require('connect');
var http = require('http');
var optimist = require('optimist');
var path = require('path');
var reactMiddleware = require('react-page-middleware');

var equation = require('./modules/equation/module.js')

var express = require('express')

var argv = optimist.argv;

var PROJECT_ROOT = __dirname;
var FILE_SERVE_ROOT = path.join(PROJECT_ROOT, 'pages');

var port = argv.port;

var isServer = !argv.computeForPath;

var serverDefaults = {
  serverRender: true,
  skipES5Shim: false,
  useBrowserBuiltins: false,
  logTiming: true,
  useSourceMaps: true,
  pageRouteRoot: FILE_SERVE_ROOT,
  sourceMapsType: 'linked'
};

var computeDefaults = {
  serverRender: false,
  skipES5Shim: false,
  useBrowserBuiltins: false,
  logTiming: false,
  useSourceMaps: false,
  pageRouteRoot: FILE_SERVE_ROOT,
  sourceMapsType: 'linked'
};

var defaults = isServer ? serverDefaults : computeDefaults;

var buildOptions = {
  projectRoot: PROJECT_ROOT,
  skipES5Shim: argv.skipES5Shim == 'true',      // Skip shim if you know you have
                                                // a very modern browser.
  useBrowserBuiltins:                           // Include node util modules.
    'useBrowserBuiltins' in argv ?
    argv.useBrowserBuiltins === 'true' :
    defaults.useBrowserBuiltins,
  logTiming: 'logTiming' in argv ?              // Colored timing logs.
    argv.logTiming === 'true' :
    defaults.logTiming,
  sourceMapsType: 'sourceMapsType' in argv ?
    argv.sourceMapsType: defaults.sourceMapsType,
  pageRouteRoot: 'pageRouteRoot' in argv ?
    argv.pageRouteRoot : defaults.pageRouteRoot, // URLs based in this directory
  useSourceMaps: 'useSourceMaps' in argv ?
    argv.useSourceMaps === 'true' :
    defaults.useSourceMaps,                     // Generate client source maps.
  ignorePaths: function(p) {                    // Additional filtering
    return p.indexOf('__tests__') !== -1;
  },
  blacklistRE: argv.blacklistRE && new RegExp(argv.blacklistRE),
  serverRender: 'serverRender' in argv ?
    argv.serverRender === 'true': defaults.serverRender,
  dev: argv.dev === 'true'
};

if (!isServer) {
  reactMiddleware.compute(buildOptions)(argv.computeForPath, function(str) {
    process.stdout.write(str);
  });
} else {
  var app = express();


  equation.add_module( app )  


// map react to main game content
  app.use( '/static', reactMiddleware.provide(buildOptions))
    .use('/static', express.static(__dirname + '/pages'));




  var portToUse = port || 8080;
  http.createServer(app).listen(portToUse);
  console.log('Open http://localhost:' + portToUse + '/index.html');
}