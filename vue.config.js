process.env.VUE_APP_VERSION = require( './package.json' ).version;

module.exports = {
    pluginOptions: {
        electronBuilder: {
            outputDir:       'releases',
            nodeIntegration: true,
            externals:       [ 'clipboard' ],
        },
    },
};
