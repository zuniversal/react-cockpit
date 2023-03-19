import { defineConfig } from 'umi';
import routes from './src/routes'; //
import path from 'path';

export default defineConfig({
  define: {
    'process.env': {
      ENV_SRC: 'umirc',
      UMI_ENV: 'production',
      NODE_ENV: 'production',

      WX_LOGIN_URL:
        'https://databack.calb-tech.com:8099/sys/thirdLogin/oauth2/wechat_enterprise/login',
      WX_WEBSOCKET_URL: 'wss://databack.calb-tech.com:8099',
    },
  },
});
