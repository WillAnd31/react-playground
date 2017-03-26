const restify = require('restify');
const path = require('path');
const port = 3000;
const root = path.resolve(__dirname);

let server = restify.createServer({
	name: 'react-playground'
});

server.pre(restify.pre.sanitizePath());

// Respond to all requests that aren't files with index.html
server.get(/^\/(?!.*\.).*$/, restify.serveStatic({
	directory: path.resolve(root + '/dist'),
	file: 'index.html'
}));

// Respond to all requests for files to the relative directory
server.get(/^\/.*\..*$/, restify.serveStatic({
	directory: path.resolve(root + '/dist')
}));

server.listen(port, () => {
	console.log('Listening on port: ', port);
});
