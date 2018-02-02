var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: path.join(__dirname, 'client.js'),
	output: {
		filename: path.join(__dirname, '/public/bundle.js')
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'stage-0', 'react']
				}
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	}
};
