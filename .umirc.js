import { resolve } from 'path'
// ref: https://umijs.org/config/
export default {
  // treeShaking: true,
  publicPath: '/build/', // /build/dist/ | http://cdn.com/foo
  history: 'hash',
  ignoreMomentLocale: true,//忽略 moment 的 locale 文件，用于减少尺寸。
  targets: { ie: 9 },
  outputPath: './build',
  hash: true,//开启 hash 文件后缀
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true,
      },
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader',
      },
      title: 'BI-app',
      dll: {
        include: ["dva", "dva/router", "dva/saga", "dva/fetch", "antd/es"],
      },
      esLint: false,
      // locale: {
      //   enable: true,
      //   default: 'en-US',
      // },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  theme: './config/theme.config.js',
  proxy: {
    '/api': {
      target: 'http://192.168.100.101:8076',
      changeOrigin: true,
      // pathRewrite: { "^/api" : "" }
    },
  },
  alias: {
    assets: resolve(__dirname, './src/assets/'),
    components: resolve(__dirname, './src/components'),
    api: resolve(__dirname, './src/services/'),
    utils: resolve(__dirname, './src/utils/'),
    themes: resolve(__dirname, './src/themes'),
  },
}
