const path = require('path')
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    port: 11011,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:4523/m1/1812979-0-default',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    externals: [
      'ace'
    ]
  },
  chainWebpack: config => {
    config.module.rule('sass').oneOfs.store.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: [path.resolve(__dirname, './src/assets/css/_var.sass'), path.resolve('node_modules', 'anso-ui/assets/customTheme/_var.sass')]
        })
        .end()
    })

    config.optimization.minimize(true)
    config.optimization
      .minimizer('terser')
      .tap(args => {
        const { terserOptions } = args[0]
        args[0].exclude = ['examples', 'node_modules']
        terserOptions.compress = Object.assign(terserOptions.compress, {
          warnings: false,
          drop_console: true,
          drop_debugger: false,
          pure_funcs: ['console.log', 'console.info']
          // exclude: /\/examples/ // 保留示例里的控制台信息
        })
        terserOptions.sourceMap = false
        terserOptions.parallel = true
        return args
      })
  }
}
