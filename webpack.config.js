let getConfig = (env) => {
	switch (env) {
		case 'prod':
		case 'staging':
		case 'production':
			return './config/webpack.prod';
		case 'dev':
		case 'development':
		default:
			return './config/webpack.dev';
	}
};

module.exports = require(getConfig(process.env.NODE_ENV));