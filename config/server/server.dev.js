const server = {
	development: {
		server: {
			baseDir: 'dist'
		},
		watchOptions: {
			ignoreInitial: true,
			ignored: ['*.txt', '.DS_Store', '.git', '.idea', 'dist/js/vendors.js']
		},
		tunnel: false,
		host: 'localhost',
		port: 3333,
		logPrefix: "development",
		open: false,
		injectChanges: true
	},

	production: {
		server: {
			baseDir: 'www'
		},
		tunnel: false,
		host: 'localhost',
		port: 3334,
		logPrefix: "production",
		open: true
	}
};

module.exports = server;