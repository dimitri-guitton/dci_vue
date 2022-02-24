process.env.VUE_APP_VERSION = require( './package.json' ).version;

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions:  {
                win:     {
                    target:                    [ 'nsis' ],
                    verifyUpdateCodeSignature: false,
                },
                mac:     {
                    category: 'public.app-category.productivity',
                },
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
