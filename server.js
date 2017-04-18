const _ = require('lodash');
const restify = require('restify');
const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname);
const port = 3000;

let server = restify.createServer({
	name: 'react-playground',
	certificate: fs.readFileSync('../../apache/self-certs/local.novisecurity.com.crt'),
	key: fs.readFileSync('../../apache/self-certs/local.novisecurity.com.key')
});

server.pre(restify.pre.sanitizePath());
server.use(restify.queryParser());

// Always send index.html unless the request if for a file (request does not match *.*)
server.get(/^\/(?!v\d)(?!.*\.).*$/, restify.serveStatic({
	directory: path.resolve(root + '/dist'),
	file: 'index.html'
}));

// Send file if request matches *.*
server.get(/^\/(?!v\d).*\..*$/, restify.serveStatic({
	directory: path.resolve(root + '/dist')
}));

// https://api.darksky.net/forecast/${weatherAPIKey}/${loc.lat},${loc.long}
const weatherClient = restify.createJsonClient({ url: 'https://api.darksky.net' });
// https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
const nasaClientBase = 'https://images-api.nasa.gov';
const nasaAssetClientBase = 'https://images-assets.nasa.gov';
const nasaClient = restify.createJsonClient({ url: nasaClientBase });
const nasaAssetClient = restify.createJsonClient({ url: nasaAssetClientBase });

// Sends 200, check to see if server is online
server.get('/v1/weather/:lat/:long',
	(req, res, next) => {
		weatherClient.get('/forecast/c94b81d7a7777e9888b46ab3ffe940e6/' + req.params.lat + ',' + req.params.long, (err, clientReq, clientRes, data) => {
			if (err) return next(new restify.InternalServerError('Err'));
			res.send(data);
			next();
		});
	}
);

server.get('/v1/nasa',
	(req, res, next) => {
		if (_.keys(req.query).length < 1) return next(new restify.BadRequestError('No query'));

		var query = '?' + _.map(req.query, (val, key, i) => key + '=' + val).join('&');

		return new Promise((resolve, reject) => nasaClient.get('/search' + query, (err, clientReq, clientRes, data) => {
			if (err) reject('Could not get image collections');
			else if (!data || !data.collection || !data.collection.items) reject('Badly formed response');
			else resolve(data.collection.items);
		}))
		.then(items => Promise.all(_.map(items, item => {
			let path = encodeURI('/image/' + item.data[0].nasa_id + '/collection.json');
			return new Promise((resolve, reject) => nasaAssetClient.get(path, (err, clientReq, clientRes, data) => {
				err ? resolve(false) : resolve(data);
			}));
		})))
		.then(imageArrs => _.chain(imageArrs)
			.filter(imgArr => imgArr.length > 0)
			.compact()
			.map(imgArr => _.find(imgArr, imgUrl => imgUrl.includes('large')))
			.compact()
			.map(imgUrl => imgUrl.replace(/http\:/, 'https:'))
			.value())
		.then(imageUrls => {
			res.send(imageUrls);
			next();
		})
		.catch(err => {
			if (err) console.log(err);
			next(new restify.InternalServerError(_.isString(err) ? err : 'Something went wrong'));
		});
	}
);

// Listen
server.listen(port, () => {
	console.log('Listening on port: ', port);
});
