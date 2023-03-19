import moment from 'moment';

import styles from './styles.module.less';

const defaultInitializer = (index: number) => index;
export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer,
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

export function formatDate(date0: Date | string) {
  const date = date0 instanceof Date ? date0 : new Date(date0);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}`;
}

export function isWxWork() {
  return /wxwork/i.test(navigator.userAgent);
}

export function removeNegativeData({
  data,
  angleField,
  colorField,
}: {
  data: any[];
  colorField: string;
  angleField: string;
}) {
  return data.filter((item) => {
    const value = item[angleField];
    return value >= 0;
  });
}

export function pushLog(level0: string, message0: string) {
  let level = level0;
  let message = message0;
  if (typeof level !== 'string') {
    level = '<Invalid Level>';
  }
  if (typeof message !== 'string') {
    message = '<Invalid Content>';
  }
  try {
    const logsText = localStorage.getItem('logs');
    let logsJSON = [];
    if (logsText) {
      try {
        logsJSON = JSON.parse(logsText);
        if (!Array.isArray(logsJSON)) {
          logsJSON = [];
        }
      } catch (e) {
        logsJSON = [];
      }
    }

    if (logsJSON.length > 19) {
      logsJSON = logsJSON.slice(0, 19);
    }

    logsJSON.unshift({ level, message });
    localStorage.setItem('logs', JSON.stringify(logsJSON));
  } catch (e) {}
}

pushLog('log', `Start at ${new Date()}`);

// 保留x位小数
export function tofixed(
  num: number | undefined,
  count: number = 2,
  fallback: string = '/',
): string {
  try {
    return num.toFixed(count);
  } catch (error) {
    return fallback;
  }
}

export function toFixedNumber(num: number, digits: number = 2, base?: number) {
  const pow = Math.pow(base || 10, digits);
  return Math.round(num * pow) / pow;
}

// 获取地址栏的参数
export function getUrlParams(value: string) {
  try {
    const url = decodeURI(window.location.search);
    const object = {};
    if (url.indexOf('?') != -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1];
      }
    }
    return object[value];
  } catch (e) {}
}
/**
 * 封装事件埋点函数（待优化）
 * @author guaoao
 * @param interfaceAddress 接口地址
 * @param interfaceName 接口名称
 * @param pageName 页面名称
 * @param pageAddress 页面地址
 * @param eventName  事件名称
 * @param pageAfterName 跳转后页面名称
 * @param pageAfterClick 跳转后页面地址
 * @param operationTime 操作时间(系统当前时间)
 * @param requestTime  接口请求时长 0
 * @param eventType 事件类型: button/search
 * @param platform 访问平台: 经营驾驶舱ckpt/洞鉴dj
 * @param interfaceParam 传递参数
 * @param pageAfterClick 跳转后的页面地址
 * @param pageAfterName 跳转后的页面名称
 * @return void
 */

interface EventPointParams {
  pageName: string;
  pageAddress: string;
  eventName: string;
  operationTime?: string;
  interfaceParam?: string;
  interfaceName?: string;
  interfaceAddress?: string;
  pageAfterName?: string;
  pageAfterClick?: string;
  level1?: string;
  level2?: string;
  level3?: string;
  eventType?: string;
}
export function sendBuriedPoint(params: EventPointParams): void {
  const NOLOG = localStorage.getItem('NOLOG');
  if (NOLOG === 'y') return;
  console.log(params, 123123);
  const query = JSON.stringify({
    eventType: 'button',
    requestTime: 0,
    operationTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
    platform: 'ckpt',
    ...params,
  });
  fetch('/api/potaleventoperationlog/potalEventOperationLog/recordEvent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Token': localStorage.getItem('token'),
      platform: 'ckpt',
    },
    body: query,
  }).then((data) => {});
}

function stringify(params: Record<string, any>) {
  const url = new URL(location.origin);
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }

  return url.search.slice(1);
}
/**
 * 封装页面埋点函数
 * @author pageName: string //页面名称
 * @author requestParam: string //请求参数
 * @author accessDepth: string //访问深度
 * @author requestUrl: string //请求地址
 * @author level1?: string, //一级埋点
 * @author level2?: string, //二级埋点
 * @author level13: string, //三级埋点
 * @author requestUrlReal?: string //请求地址真实
 * @return Promise
 */
interface PagePointParams {
  pageName: string; //页面名称
  requestParam: string; //请求参数
  accessDepth: string; //访问深度
  requestUrl: string; //请求地址
  level1?: string; //一级埋点
  level2?: string; //二级埋点
  level3?: string; //三级埋点
  requestUrlReal?: string; //请求地址真实
}
export async function sendPagePoint<T = any>(
  params: PagePointParams,
): Promise<T> {
  const NOLOG = localStorage.getItem('NOLOG');
  if (NOLOG === 'y') {
    return Promise.resolve({ result: 'error' });
  }
  const query = { ...params, platform: 'ckpt' };
  if (!query.requestUrlReal) {
    query.requestUrlReal = query.requestUrl;
  }
  const response = await fetch(
    '/api/datapageaccesslog/dataPageAccessLog/addLog',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Access-Token': localStorage.getItem('token')!,
        platform: 'ckpt',
      },
      body: stringify(query),
    },
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = (await response.json()) as T;
  return data;
}
// 两个数相乘
export function accMul(arg1, arg2) {
  try {
    let m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    );
  } catch (e) {}
}
/**
 * 防抖
 * @parmas fn 回调函数
 * @parmas time 规定时间
 */
export const debounce = (function () {
  const timer = {};
  return function (func, wait = 500) {
    const context = this; // 注意 this 指向
    const args = arguments; // arguments中存着e
    // 根据方法内容作为键值,保证唯一性
    const randomText = String(args[0]).replace(/[\r\n]|\s+/g, '');
    const name = 'debounce' + randomText;
    if (timer[name]) clearTimeout(timer[name]);
    timer[name] = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
})();

/**
 * 节流(规定的时间才触发)
 * @parmas fn 结束完运行的回调
 * @parmas delay 规定时间
 */
export const throttle = (function () {
  let timeout = null;
  return function (func, wait = 500) {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
})();

/**
 * 时间(月和日如果是小于10的前面加上0)
 * @parmas value 时间的日或者年
 */
export function formatDateValue(value) {
  const date = Number(value) > 9 ? value : `0${value}`;
  return date;
}

export function createTooltipFormater(props) {
  const {
    onClickTooltip,
    valueFormatter = (series) => series.value,
    extra = () => '',
  } = props;
  const enterable = !!onClickTooltip;

  return (item) => {
    const el = document.createElement('div');
    console.log(item);
    const series = item
      .map((seriesItem) => {
        return `<div class="${styles.tooltip_desc}">
        <div class="${styles.tooltip_desc_label}">
        ${seriesItem.marker}
      <div class="${styles.series_name}">${seriesItem.seriesName}</div>
      </div>
      <div>${valueFormatter(seriesItem)}</div>
    </div>`;
      })
      .join('');

    el.innerHTML = `<div>
    <div class="${styles.tooltip_title}">
      <pre>${item[0].name}</pre>
      <div class="${styles.tooltip_arrow}" style="display: ${
      enterable ? 'block' : 'none'
    }"></div>
    </div>
    ${series}
    ${extra(item)}
    </div>`;
    el.addEventListener('click', () => {
      onClickTooltip && onClickTooltip(item);
    });
    return el;
  };
}

export const colors = [
  '#5183FD',
  '#5FCABB',
  '#707E9D',
  '#5D6C8F',
  '#766BF5',
  '#A098F9',
  '#E39F39',
  '#E4B36A',
  '#EEC78D',
  '#D0DCFA',
];
