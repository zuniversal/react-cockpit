import { defineConfig } from 'umi';
import routes from './src/routes';
import path from 'path';

const SERVE_PROXY_ORIGIN_PROD = 'http://datafront.calb-tech.com:8090';
const SERVE_PROXY_ORIGIN_DEV = 'http://devdatafront.calb-tech.com:8091';
const SERVE_PROXY_ORIGIN_UAT = 'https://uatdatafront.calb-tech.com:8092';

const { UMI_ENV = SERVE_PROXY_ORIGIN_DEV } = process.env;

const apiMap = {
  production: SERVE_PROXY_ORIGIN_PROD,
  development: SERVE_PROXY_ORIGIN_DEV,
  uat: SERVE_PROXY_ORIGIN_UAT,
};

const apiTarget = apiMap[UMI_ENV] || SERVE_PROXY_ORIGIN_DEV;
console.log(' process ： ', apiTarget);

export default defineConfig({
  define: {
    'process.env': {
      ENV_SRC: 'umirc',
      UMI_ENV: 'dev',
      NODE_ENV: 'dev',

      WX_LOGIN_URL:
        'https://uatdataback.calb-tech.com:8101/sys/thirdLogin/oauth2/wechat_enterprise/login',
      WX_WEBSOCKET_URL: 'ws://devdataback.calb-tech.com:8100',
    },
  },
  // history: { type: 'hash' },
  routes,

  // dva: {skipModelValidate: true },
  // lowImport: {
  //   libs: ['dva']
  // },
  proxy: {
    '/api': {
      target: apiTarget,
      changeOrigin: true,
      pathRewrite: {
        // '^/api': '',
      },
    },
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  chainWebpack(config) {
    config.optimization.splitChunks({
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'async',
          minChunks: 1,
          minSize: 0,
        },
      },
    });
  },
  mfsu: false,
  npmClient: 'npm',
  model: {},
  dva: {},
  // plugins: ['@umijs/plugins/dist/dva', '@umijs/plugins/dist/model'],
});
