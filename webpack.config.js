// var autoPrefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    devtool: 'cheap-module-source-map',
	entry: './src/client/main',
	externals: {
		'angular': true,
		// Wrapped in window because of hyphens
		'angular-ui-router': 'window["angular-ui-router"]'
	},
	module: {
		/*preLoaders: [
			{ test: /\.ts$/, loader: 'tslint' }
		],*/
		loaders: [
			{ test: /\.ts$/, loader: 'ts-loader' },
			{ test: /index\.html$/, loader: 'html', exclude: /node_modules/ }
			/*
			{
				test: /\.html$/,
				loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './src')) + '/!html',
				exclude: /index\.html$/
			}
			,
			{ test: /\.scss$/, loaders: [ 'style', 'css', 'sass', 'postcss' ] },
			{ test: /\.json/, loaders: [ 'json' ] }*/
		]
	},
	output: {
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({ template: 'src/client/index.html', inject: 'body' })
	],
	/*postcss: function() {
		return [
			autoPrefixer({ browsers: ['last 2 versions'] })
		];
	},*/
    resolve: {
        extensions: [ '', '.ts', '.js', '.json' ],
        modulesDirectories: ['./src/client', './vendor', 'node_modules']
    }
};