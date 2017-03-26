const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

const appStylesExtract = new ExtractTextPlugin('styles.min.css');

module.exports = {
	context: helpers.fromRoot(''),
	target: 'web',
	stats: {
		assets: false,
		chunks: true,
		modules: true,
		timings: true,
		warnings: false,
		errors: true,
		errorDetails: true
	},

	entry: {
		app: helpers.fromRoot('client/bootstrap.jsx'),
		styles: helpers.fromRoot('client/styles/index.scss')
	},

	resolve: {
		extensions: ['.js', '.jsx'],
		mainFiles: ['index'],
		modules: [
			helpers.fromRoot('client'),
			'node_modules'
		]
	},

	output: {
		path: helpers.fromRoot('dist'),
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js',
		sourceMapFilename: '[file].map'
	},

	module: {
		rules: [
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(png|jpe?g|gif|mp4|svg|woff|woff2|vtt|ttf|eot|ico)$/,
				loader: 'file-loader',
				query: { name: '/assets/[name].[ext]' }
			},
			{
				test: /\.scss$/,
				include: /styles/,
				exclude: /node_modules/,
				loader: appStylesExtract.extract([
					'css-loader?minimize&sourceMap',
					'postcss-loader',
					'resolve-url-loader',
					'sass-loader?sourceMap'
				])
			}
		]
	},

	plugins: [
		appStylesExtract,
		new webpack.ProgressPlugin(),
		new webpack.LoaderOptionsPlugin({
			options: {
				context: helpers.fromRoot(''),
				postcss: [precss(), autoprefixer()],
				output: {
						path: helpers.fromRoot('dist')
				},
				sassLoader: {
					includePaths: [
						helpers.fromRoot('node_modules'),
						helpers.fromRoot('client'),
					]
				},
				htmlLoader: {
					minimize: true,
					removeAttributeQuotes: false,
					caseSensitive: true,
					customAttrSurround: [
						[/#/, /(?:)/],
						[/\*/, /(?:)/],
						[/\[?\(?/, /(?:)/]
					],
					customAttrAssign: [/\)?\]?=/]
				}
			}
		}),

		new HtmlWebpackPlugin({
			template: helpers.fromRoot('client/index.html'),
			inject: 'body',
			hash: true,
			favicon: helpers.fromRoot('client/images/WillAndFavicon.png')
		})
	]
};
