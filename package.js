Package.describe({
  name: 'mmack:m-stream',
  version: '0.0.1',
  summary: 'A Cavalier ES2015 re-write of Arunoda\'s Meteor-Streams package.',
  git: 'https://github.com/10thfloor/m-stream.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.1');
  api.use('ecmascript');
  api.mainModule('./lib/client-stream.js', 'client');
  api.mainModule('./lib/server-stream.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mmack:m-stream');
  api.mainModule('./lib/client-stream.js', 'client');
  api.mainModule('./lib/server-stream.js', 'server');
});
