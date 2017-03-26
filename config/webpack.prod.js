const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'prod';
console.log('Webpack ENV: ', ENV);

module.exports = webpackMerge(commonConfig, {
	devtool: 'hidden-source-map',

	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]

});
