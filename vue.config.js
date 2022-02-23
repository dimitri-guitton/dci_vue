process.env.VUE_APP_VERSION = require( './package.json' ).version;

module.exports = {
    pluginOptions: {
        electronBuilder: {
            externals:       [ 'electron-store', 'clipboard' ],
            nodeIntegration: true,
        },
        builderOptions:  {
            appId: 'eco-atl-dci.fr',
            mac:   {
                target: [
                    {
                        target: 'dmg',
                    },
                ],
            },
        },
    },
};
