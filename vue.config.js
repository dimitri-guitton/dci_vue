process.env.VUE_APP_VERSION = require( './package.json' ).version;

module.exports = {
  publicPath:
                 process.env.NODE_ENV === 'production' ? '/metronic8/vue/demo1/' : '/',
  pluginOptions: {
    electronBuilder: {
      outputDir: 'releases',
    },
  },
};
