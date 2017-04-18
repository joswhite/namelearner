var autoPrefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
// var indexHTMLPath = process.env.NAMELEARNER_DEV

module.exports = {
    devtool: 'cheap-module-source-map',
	entry: './src/client/main',
	externals: {
		'angular': true,
		// Wrapped in window because of hyphens
        'angular-resource': 'window["angular-resource"]',
		'angular-ui-router': 'window["angular-ui-router"]'
	},
	module: {
		/*preLoaders: [
			{ test: /\.ts$/, loader: 'tslint' }
		],*/
		loaders: [
			{ test: /\.ts$/, loader: 'ts-loader' },
			{ test: /(index|login)\.html$/, loader: 'html', exclude: /node_modules/ },
			{
				test: /\.html$/,
				loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './src/client')) + '/!html',
				exclude: /(index|login)\.html$/
			},
			{ test: /\.scss$/, loaders: [ 'style', 'css', 'sass', 'postcss' ] }
			/*{ test: /\.json/, loaders: [ 'json' ] }*/
		]
	},
	output: {
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({ template: 'src/client/index.html', inject: 'body' }),
		new HtmlWebpackPlugin({ template: 'src/client/login.html', inject: false, filename: 'login.html' })
	],
	postcss: function() {
		return [
			autoPrefixer({ browsers: ['last 2 versions'] })
		];
	},
    resolve: {
        extensions: [ '', '.ts', '.js', '.json' ],
        modulesDirectories: ['./src/client', './vendor', 'node_modules']
    }
};