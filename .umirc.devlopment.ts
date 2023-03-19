import { defineConfig } from 'umi';
import routes from './src/routes'; //
import path from 'path';

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
});
