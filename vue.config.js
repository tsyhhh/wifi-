module.exports = {
  lintOnSave: false,
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // 静态资源存放的文件夹(相对于ouputDir)
  assetsDir: "assets",
  // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
  devServer: {
    host: 'localhost',
    port: '8080', // 端口号
    https: false, // https: {type:Bollean}
    open: true, // 配置自动启动浏览器
    // 配置代理
    proxy: {
      "/api": {
        target: 'http://118.31.171.61/api', // 想要访问接口域名
        changeOrigin: true, // 开启跨域,在本地创建一个虚拟服务,然后发送请求的数据,并同时接收请求的数据,这样服务端和服务端进行数据交互就不会有问题
        pathRewrite: {
          "^/api": '', // 利用这个地面的值拼接上target里面的地址
        }
      }
    }
  }
}
