var Hapi = require('hapi');

// Create a server with a host and port
var server = Hapi.createServer('localhost', 3000);

// Add the static route
server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: { path: '.', listing: false, index: true }
    }
});

// Start the server
server.start();