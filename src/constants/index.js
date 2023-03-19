// import { animate, createProperty } from '@/utils';
export const isDev = process.env.NODE_ENV === 'development';

export const URL_PREFIX = `http://81.68.218.18:31002`;
export const WS_DEV = `188.131.235.243:31002`;
export const WS_HOST = window.location.host;

const { protocol = 'http:', hostname } = window.location;
const wsMap = {
  'http:': 'ws:',
  'https:': 'wss:',
}[protocol];

export const WS_PREFIX = `${wsMap}//${isDev ? WS_DEV : WS_HOST}`;

export const TEST_URL = `/api`;
export const PROXY_URL = `/api`;
export const DOWNLOAD_URL = '/api/download/';
export const BASE_URL = isDev ? PROXY_URL : TEST_URL;
export const URL = `${BASE_URL}`;

export const SELECT_TXT = '请选择';
export const INPUT_TXT = '请输入';
export const REQUIRE = '字段必填！';
export const SELECT_TXT_EN = 'Please select ';
export const INPUT_TXT_EN = 'Please input ';
export const REQUIRE_EN = 'Mandatory Field!';
export const WORD = 'keyword';

export const SIZE = 10;
export const PAGE = 1;

export const LOGIN = '/login?test=y';
export const showTabbarConfig = [
  '/',
  '/news',
  '/radar',
  '/me',
];

export const SIM_XLSX = '/sim.xlsx';

const animations = [];

// export const ANIMATE = createProperty(animations, animate);
