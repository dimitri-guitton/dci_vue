process.env.VUE_APP_VERSION = require( './package.json' ).version;

module.exports = {
    pluginOptions: {
        electronBuilder: {
            'files':        [
                'static/**/*',
            ],
            builderOptions: {
                publish: [
                    {
                        provider:    'github',
                        releaseType: 'draft',
                    },
                ],
            },
            nodeIntegration: true,
            externals:       [ 'clipboard' ],
        },
    },
};
