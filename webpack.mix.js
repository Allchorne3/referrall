let mix = require('laravel-mix')
const path = require('path')

mix
	// Directories
	.copyDirectory('./site/src/assets', 'public/assets')
	.copyDirectory('./site/_redirects', 'public/')

	// JavaScript
	.js('./site/src/scripts/app.js', 'public/scripts').vue().setPublicPath('public')

	// CSS
	.sass('./site/src/style/style.scss', 'public/style/style.css')
	
	// Configure webpack alias
	.webpackConfig({
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'site/src')
			}
		}
	})
