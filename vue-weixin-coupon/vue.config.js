module.exports = {
  devServer: {
    proxy: {
      '/member-mall': {
        target: 'http://192.168.2.28:8081',
        ws: true,
        changeOrigin: true
      }
    }
  },
  outputDir: 'coupon',
  assetsDir: 'coupon',
  indexPath: 'coupon.html'
}