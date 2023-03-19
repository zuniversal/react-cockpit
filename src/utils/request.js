// 封装的项目通用的 请求方法 操作
// 根据请求方式 自动判别是否显示操作 tips
import { useRequest } from 'ahooks';
import { isDev, LOGIN, noRedirectLoginPath, URL } from '@/constants';
import { getToken, removeItem, tips, wrapParams } from './tool';
import axios from 'axios';
import { history } from 'umi';

export const NORMAL_CODE = 200;
export const AUTH_FAIL = 104000;
export const NO_AUTH = 401;

// 业务状态码
const codeMap = {
  100: '正常码',
  100000: '正常码',
  105001: '系统错误',
  104000: '用户认证错误',
  104001: '错误的验证信息',
  104002: '参数错误',
  104003: '用户不存在',
  104004: '密码错误',
  104005: '第三方API错误',
  104006: 'API访问错误',
};

export const getCodeMsg = (code) => {
  const codeItem = codeMap[code];
  return codeItem || `${code} - 未知状态码！`;
};

// http状态码
const statusMap = {
  400: '400 错误请求！',
  401: '401 无访问权限！',
  404: '404 请求路径不存在！',
  500: '500 服务端报错！',
};

export const getStatusMsg = (status, url) => {
  const statusItem = statusMap[status];
  return statusItem || `${url} - 未知状态！`;
};

export const isTips = (res) => {
  // console.log('  isTips  !res ', !res, res, history);
  if (!res) {
    tips('未知错误！', 2);
    return;
  }

  const { status, data, config } = res;
  const { code } = data;
  const { noTips, noTipsAll } = res.config.customInfo;
  const { url } = config;

  if (status === NO_AUTH) {
    history.replace(LOGIN);
    return;
  }

  if (noTipsAll) {
    return;
  }

  // http状态码提示
  if (statusMap[status]) {
    tips(statusMap[status], 2);
    return;
  }
  return;
};

const instance = axios.create({
  baseURL: URL,
  timeout: 300000,
  // timeout: 0,
});

export const handleParams = (params) => {
  return params;
};

export class Request {
  http = null;

  constructor() {
    this.http = instance;
    this.http.interceptors.request.use(
      (config) => {
        const tokenRes = getToken();
        if (tokenRes) {
          config.headers['X-Access-Token'] = tokenRes;
        }

        // config.data = wrapParams(config.data);
        const formatParams = wrapParams(
          config.method === 'get' || config.method === 'delete'
            ? config.params
            : config.data,
        );
        config.customInfo = handleParams(formatParams);
        const { noTips, extraPayload, ...rest } = formatParams;
        if (config.method === 'post') {
        } else if (config.method !== 'put') {
          config.data = config.params = rest;
        }
        return config;
      },
      (err) => Promise.reject(err),
    );

    this.http.interceptors.response.use(
      (res) => {
        // console.log(' 返回请求 ： ', res.data);
        this.handleResponse(res);
        const { result, ...rest } = res.data;
        return result;
      },
      (err) => {
        console.log(' 请求发生错误了：', err, err.message, err.response, {
          ...err,
        });
        this.handleResponse(err.response);
        if (err.message.indexOf('timeout') > -1) {
          tips('请求超时！', 0);
        } else {
          console.log(' 发送错误 ： ', { ...err.response }, err.response);
        }
        return Promise.reject(err);
      },
    );
  }
  handleResponse = (res) => {
    // console.log(' handleResponse,  , ： ', res);
    isTips(res);
  };
}

export const request = new Request();
const { http } = request;

export const parseUrl = (url, params) => URL + url;

// export const get = (url, params, options) => useRequest(() => http.get(url, { params: params }), options);
// export const post = (url, params, options) => {
//   console.log(' url, params, options ： ', url, params, options,  )//
//   return useRequest(() => http.post(url, params), options)
// };
// export const put = (url, params, options) => useRequest(() => http.put(url, params), options);
// export const patch = (url, params, options) => useRequest(() => http.patch(url, params), options);
// export const remove = (url, params, options) => useRequest(() => http.delete(url, { params }), options);

export const get = (url, params) => http.get(url, { params: params });
export const post = (url, params) => {
  console.log(' url, params ： ', url, params); //
  return http.post(url, params);
};
export const put = (url, params) => http.put(url, params);
export const patch = (url, params) => http.patch(url, params);
export const remove = (url, params) => http.delete(url, { params });

// 不显示 tips 的方法
export const noTipsGet = (url, params, options) =>
  get(url, { ...params, noTips: true }, options);
export const noTipsPost = (url, params, options) =>
  post(url, { ...params, noTips: true }, options);
export const noTipsPut = (url, params, options) =>
  put(url, { ...params, noTips: true }, options);
export const noTipsPatch = (url, params, options) =>
  patch(url, { ...params, noTips: true }, options);
export const noTipsRemove = (url, params, options) =>
  remove(url, { ...params, noTips: true }, options);

export const blobGet = (url, params, options, o) =>
  http({
    method: 'get',
    url,
    data: { ...params, noTips: true },
    responseType: 'blob',
  });
export const blobPost = (url, params, o) =>
  http({
    method: 'post',
    url,
    data: { ...params, noTips: true },
    responseType: 'blob',
  });

export const req = {
  get,
  post,
  put,
  patch,
  remove,
  noTipsGet,
  noTipsPost,
  noTipsPut,
  noTipsPatch,
  noTipsRemove,
  blobGet,
  blobPost,
};
