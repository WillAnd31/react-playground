const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const helpers = require('./helpers');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'dev';
console.log('Webpack ENV: ', ENV);

module.exports = webpackMerge(commonConfig, {
	devtool: 'source-map',
	watch: true,

	plugins: [
		new LiveReloadPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new DefinePlugin({
			'ENV': JSON.stringify(ENV)
		})
	]
});
