module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  publicPath: '',
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      exclude: /.htaccess/
    }
  }
}
