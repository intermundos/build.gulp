const path = {

	html: {
		src: 'app/html/index.html',
		watch: 'app/html/**/*.html',
		dist: 'dist/',
		www: 'www/'
	},

	fonts: {
		src: 'app/media/fonts/**/*.*',
		dist: 'dist/media/fonts/',
		watch: 'app/media/fonts/**/*.*',
		www: 'www/media/fonts/'
	},

	images: {
		src: 'app/media/images/**/*.*',
		watch: 'app/media/images/**/*.*',
		dist: 'dist/media/images/',
		www: 'www/media/images/',
	},

	video: {
		src: 'app/media/video/**/*.*',
		watch: 'app/media/video/**/*.*',
		dist: 'dist/media/video/',
		www: 'www/media/video/',
	},

	scripts: {
		src: 'app/scripts/main.js',
		vendors: 'app/scripts/vendors.js',
		watch: ['app/scripts/**/*.*', '!app/scripts/vendors.js'],
		dist: 'dist/scripts/',
		www: 'www/scripts/',
	},

	styles: {
		src: 'app/styles/main.scss',
		vendors: 'app/styles/vendors.scss',
		watch: 'app/styles/**/*.*',
		www: 'www/styles/',
		dist: 'dist/styles/',
	}
};

module.exports = path;