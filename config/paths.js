const path = {

	html: {
		src: 'app/index.html',
		dist: 'dist/',
		watch: 'app/**/*.html'
	},

	fonts: {
		src: 'app/media/fonts/**/*.*',
		dist: 'dist/media/fonts/',
		watch: 'app/media/fonts/**/*.*'
	},

	images: {
		src: 'app/media/images/**/*.*',
		dist: 'dist/media/images/',
		watch: 'app/media/images/**/*.*'
	},

	video: {
		src: 'app/media/video/**/*.*',
		dist: 'dist/media/video/',
		watch: 'app/media/video/**/*.*'
	},

	scripts: {
		src: 'app/scripts/main.js',
		dist: 'dist/scripts/',
		watch: 'app/scripts/**/*.*'
	},

	styles: {
		src: 'app/styles/main.scss',
		vendors: 'app/styles/vendor.scss',
		dist: 'dist/styles/',
		watch: 'app/styles/**/*.*'
	}
};

module.exports = path;