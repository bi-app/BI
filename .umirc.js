import { resolve } from 'path'
// ref: https://umijs.org/config/
export default {
  // treeShaking: true,
  publicPath: '/build/dist/', // /build/dist/ | http://cdn.com/foo
  history: 'hash',
  ignoreMomentLocale: true,
  targets: { ie: 9 },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true
      },
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader',
      },
      title: 'BI-app',
      dll: true,
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
      target: 'http://192.168.100.171:8010',
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
