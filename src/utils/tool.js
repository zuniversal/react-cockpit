import moment from 'moment';
import { Toast } from 'antd-mobile'

export const arrMapObj = (
  arr = [],
  { key = 'value', label = 'label' } = {},
) => {
  // export const arrMapObj = (arr = []) => {
  const obj = {};
  arr.forEach(v => (obj[v[key]] = v[label]));
  return obj;
};

export const arrMapColor = arr =>
  arrMapObj(arr, { key: 'value', label: 'color' });

export const filterObjSame = (data, key = 'id') => {
  const temp = [];
  // const deWeightTwo = () => {
  //   console.log(' deWeightTwo   ,   ： ',   )
  data.forEach(a => {
    let check = temp.every(b => a[key] != b[key]);
    // console.log(' temp 222 ： ', data, temp, check, key,  )//
    check ? temp.push(a) : '';
  });
  // return data;
  // console.log(' temp ： ', data, temp,  )//
  return temp.filter(v => v.value != undefined);
  // }
};

export const getDataMap = (text, dataMap) => {
  const val = dataMap[text];
  return val ? val : text;
};

export const objNum2str = (data = {}, config = []) => {
  const newObj = {
    ...data,
  };
  const res = config.forEach(key => {
    if (newObj[key]) {
      newObj[key] = `${newObj[key]}`;
    }
  });
  return newObj;
};

export const formatSelectList = (
  data = [],
  labelKey = 'name',
  idKey = 'id',
) => {
  console.log(' datadatadata ： ', data); //
  const res = data.map(v => ({
    ...v,
    label: v[labelKey],
    value: `${v[idKey]}`,
    value: v[idKey],
    // title: v[labelKey] + '2222222222',
  }));
  // console.log(' formatSelectList res ： ', res);
  return res;
};

export const getWeek = (data, isGetWeek) => {
  // console.log(' getWeek   data,   ： ', data  )
  return data
    .map(v => {
      // const isWeek = business.isWeekDay(moment(`2020-10-${v}`))
      // const isWeek = business.isWeekDay(moment(v));
      const isWeek = false;
      // console.log(' onChange   isWeek, ,   ： ', isWeek, datasss, v  )
      if (isGetWeek) {
        return isWeek ? v : null;
      } else {
        return !isWeek ? v : null;
      }
    })
    .filter(v => v);
};
const datasss = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const resss = getWeek(datasss);

export const nowYear = new Date().getFullYear();
export const nowMonth = new Date().getMonth() + 1;
export const nowMonthPad = `${new Date().getMonth() + 1}`.padStart(2, '0');
export const nowDay = new Date().getDate();
export const nowYearMonth = `${nowYear}-${nowMonth}`;
export const nowYearMonthDay = `${nowYear}-${nowMonth}-${nowDay}`;
export const nowYearMonthDayFull = `${nowYear}-${`${nowMonth}`.padStart(
  2,
  '0',
)}-${nowDay}`;

export const getCountDays = (month = nowMonth, year = nowYear) =>
  new Date(year, month, 0).getDate();
// export const getMonthDays = ({month, year, isPad}) =>
//   Array.from({ length: getCountDays(month, year) }, (_, index) => isPad ? `${index + 1}`.padStart(2, '0') : `${index + 1}`);
export const getMonthDays = (month, year) =>
  Array.from({ length: getCountDays(month, year) }, (_, index) =>
    `${index + 1}`.padStart(2, '0'),
  );
export const formatMonthDay = (data, month = nowMonth, year = nowYear) =>
  data.map(v => `${year}-${month}-${v}`);
export const getNowMonthDays = formatMonthDay(getMonthDays());
export const getNowMonthDaysPad = () => formatMonthDay(months, nowMonthPad);
export const getMonthWeekDays = getWeek(getNowMonthDays, true);
export const getMonthWeekDaysSimple = getMonthWeekDays.map(
  v => v.split('-')[v.split('-').length - 1],
);

var day = getCountDays();
var months = getMonthDays();
var formatMonthDayformatMonthDay = formatMonthDay(months);

export const dateFormat = 'YYYY/MM/DD';
export const monthFormat = 'YYYY/MM';

export const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

export const mockDate = moment('2020/02/02', dateFormat);
export const mockMonth = moment('2020/02/02', monthFormat);

export const w320 = '';
export const w240 = 'w-240';

export const downLoad = (
  url,
  { name, prefix = '/api/downloads/' } = { name: '默认文件名' },
) => {
  let a = document.createElement('a');
  a.download = name; // 设置下载的文件名，默认是'下载'
  a.href = prefix + url;
  console.log(' a.href  ： ', a.href); //
  document.body.appendChild(a);
  a.click();
  a.remove(); // 下载之后把创建的元素删除
};

export const downLoadFile = (clickItem, { downEle = 'qrCode' }) => {
  const canvasImg = document.getElementById(downEle); // 获取canvas类型的二维码
  const img = new Image();
  img.src = canvasImg.toDataURL('image/png'); // 将canvas对象转换为图片的data url
  // const downLink = document.getElementById('down_link');
  // console.log(' img ： ', img, clickItem, canvasImg,  )//
  clickItem.href = img.src;
  clickItem.download = '二维码'; // 图片name
};

// 把base64 转 file文件
export const dataURLtoFile = (dataurl, filename) => {
  console.log(' dataURLtoFile ： ', filename); //
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  console.log(' u8arr ： ', u8arr); //
  return new File([u8arr], filename, { type: mime });
};

export const createIndexArr = (length = 6) =>
  Array.from({ length }, (_, index) => index);

export const createArr = (length = 6) => {
  const res = Array.from(
    { length },
    (_, index) => {},
    // console.log(_, index)
  );
  // console.log('  res ：', res);
  return res;
};

export const createObj = (length = 6) => {
  const res = Array.from({ length }, () => ({}));
  console.log('  res ：', res);
  return res;
};

export const mockTbData = (params = {}) => {
  const mockDataSource = new Array(20).fill(0);
  const { columns = mockDataSource } = params;
  // Array.from({ length: end }, (_, index) => index); // undefined 0
  // Array(length).map(() => init); Array.from({ length: 8 }, () => ({}));
  // Array.from({ length }, () => ({}));
  // Array(length).fill({}); Array(8).fill(0)
  return mockDataSource.map((v, i) => {
    const start = 10;
    const childrenObj = {};
    const obj = {};
    columns.forEach((v, index) => {
      // obj[`field${index}`] = `FieldFieldFieldFieldFieldField`;
      // obj[v.dataIndex] = `${v.dataIndex}-${i}`;
      obj[v.dataIndex] = `${v.title}-${i}`;
      obj[`field${index}`] = `Field${i}`;
      childrenObj[`field${start * index}`] = `Field_${i}`;
    });
    // console.log(' objobj ： ', obj,  )//
    const item = {
      id: i,
      d_id: i,
      ...obj,
      key: i,
      // [`field${i}`]: `Field${i}`,
    };
    const childrenItem = {
      id: start * (i + 1),
      d_id: start * (i + 1),
      ...childrenObj,
      key: i,
      // [`field${i}`]: `Field${i}`,
    };
    if (params && params.haveChildren) {
      item.children = [childrenItem];
    }

    return item;
  });
};

// const NUM_LEN = 9;
const NUM_LEN = 20;
// const NUM_LEN = 5
const WORD_LEN = 10;
const LETTER_LEN = 20;
// const LETTER_LEN = 8

const lengthMap = {
  num: NUM_LEN,
  word: WORD_LEN,
  letter: LETTER_LEN,
};

// 处理表格文本的长度 根据文本的类型返回对应的限定的长度值
export const getLengthLimit = text => {
  let textLength = text.length;
  if (!isNaN(text)) {
    // console.log(' 数字 ： ',    )//
    // textLength = lengthMap.num
    return lengthMap.num;
  } else if (/^[a-zA-Z\s]+$/.test(text)) {
    // console.log(' 字母 ： ',    )//
    // textLength = lengthMap.letter
    return lengthMap.letter;
  } else if (/^[\u4e00-\u9fa5]+$/.test(text)) {
    // console.log(' 文字 ： ',    )//
    // textLength = lengthMap.word
    return lengthMap.word;
  } else {
    // console.log(' 文字 ： ',    )//
    // textLength = lengthMap.word
    // return 15;
    return 20;
  }
  console.log(' 默认长度 ： ', isNaN(text), text, textLength);
  return textLength;
};

// 得到最终的格式化后的文本
export const foramtText = text => {
  // if (text == undefined) {
  if (!text) {
    return text;
  }
  const textStr = `${text}`;
  let lengthLimit = getLengthLimit(textStr);
  const txt =
    textStr.length > lengthLimit
      ? `${textStr}`.slice(0, lengthLimit) + '...'
      : textStr;
  // console.log(' lengthLimit, textStr, textStr.length ： ', txt, lengthLimit, textStr.length, textStr,   )//
  return txt;
};

export const linkUrlFn = (params = [], path = '') => (text, record, index) => {
  let linkUrl = path;
  // let res = params.forEach((key) => linkUrl += `${key}=${record[key] != undefined ? record[key] : ''}&`)
  let paramsStr = params
    .map(key => `${key}=${record[key] != undefined ? record[key] : ''}`)
    .join('&');
  linkUrl += paramsStr;
  // console.log(' linkUrl ： ', linkUrl, paramsStr);
  return linkUrl;
};

export const INPUT_TXT = 'Please Input ';
export const SUCC_TXT = 'Action Successful o(*￣︶￣*)o ！';

export const confirms = (type = 1, msg, time = 3, cb) => {
  // console.log('confirms ：', type, time, cb, )
  const msgMap = {
    0: 'error',
    1: 'success',
    2: 'warn',
  }[type];

  // message.config({
  //   duration: 3,
  //   duration: 30000,
  // });
  // message[msgMap](msg, time, cb);
  Toast.show({
    content: msg,
    afterClose: () => {
      console.log('afterClose',)
    },
  })
};

export const tips = (msg, type = 1, time = 5, cb) => {
  console.log('confirms ：', type, time, cb);
  const msgMap = {
    0: 'error',
    1: 'success',
    2: 'warn',
  }[type];
  // message[msgMap](msg, time, cb);
  Toast.show({
    content: msg,
    afterClose: () => {
      console.log('afterClose',)
    },
  })
};

// export const isNoTips = res => JSON.parse(res.config.data).noTips
// export const tipsConfirm = res => {
//     const {code, mes, } = res.data
//     const codeExist = code !== 1 && code != undefined
//     if (codeExist || (codeExist && isNoTips(res))) {
//         console.log('confirmsconfirmsconfirms ：', res.data, code !== 1, code != undefined, !isNoTips(res), (code !== 1 && code != undefined), (code !== 1 && isNoTips(res)) )
//         confirms(code, mes,  )
//     }
// }
export const isNoTips = res => {
  // console.log(' codeExistcodeExist ： ', res.config, res.config.datas,  )
  return res.config.datas.noTips;
};
export const tipsConfirm = res => {
  const { code, msg } = res.data;
  const codeExist = code !== 1 && code != undefined;
  console.log(
    ' %c tipsConfirm 返回提示 ： ',
    `color: #333; font-weight: bold`,
    code === 1,
    !!isNoTips(res),
    isNoTips(res),
    res.config.datas,
    code,
    res,
    res.config.url,
  );
  // if (!(!code !== 1 && !!isNoTips(res))) {
  //   //
  //   // console.log(' codeExist confirmsconfirmsconfirms ：', res.datas, code !== 1, code != undefined, !isNoTips(res), (code !== 1 && code != undefined), (code !== 1 && isNoTips(res)) )
  //   confirms(code, msg);
  // }
};
export const wrapParams = p => ({
  ...p,
  // other: 'xxx',
});

export const copyData = o => JSON.parse(JSON.stringify(o));

export const setItem = (k, v, isString) =>
  v && localStorage.setItem(k, isString ? v : JSON.stringify(v));
export const getItem = k => JSON.parse(localStorage.getItem(k));
export const removeItem = k => localStorage.removeItem(k);
export const setItems = (k, v) => sessionStorage.setItem(k, JSON.stringify(v));
export const getItems = k => JSON.parse(sessionStorage.getItem(k));
export const removeItems = k => sessionStorage.removeItem(k);

let t;
export const debounce = (cb, ...v) => {
  console.log(' debounce cb, v ： ', cb, v);
  if (t) clearTimeout(t);
  t = setTimeout(() => cb(...v), 300);
};
export const getAll = p => Promise.all(p).then(res => Promise.all(res));
export const OPTIONS = p => ({ headers: { Authorization: p } });

export const randomNumber = (n1, n2) => {
  if (arguments.length === 2) {
    return Math.round(n1 + Math.random() * (n2 - n1));
  } else if (arguments.length === 1) {
    return Math.round(Math.random() * n1);
  } else {
    return Math.round(Math.random() * 255);
  }
};
export const rc = () =>
  '#' +
  Math.random()
    .toString(16)
    .substring(2)
    .substr(0, 6);
export const disabledDate = c => c && c.valueOf() < Date.now();
export const ts = t => Date.parse(new Date(t));
export const color = (n = 10) => {
  // console.log('n ：', n);
  const color = [];
  for (let i = 0; i < n; i++) {
    color.push(rc());
  }
  return color;
};
export const animate = n => `animated ${n}`;
export const createProperty = (arr, f) => {
  const origin = {};
  arr.forEach((v, i) => (origin[v] = f(v)));
  return origin;
};

export const TOKEN_PREFIX = ''; //

export const getToken = (k = 'token', prefix = TOKEN_PREFIX) => {
  const token =
    localStorage.getItem(k) != undefined ? localStorage.getItem(k) : '';
  // console.log(' prefix, k ： ', prefix, k, token);
  return prefix + token;
};

export const getPlatformToken = () => getToken('guest_token') ?? getToken();

export const getUserInfo = (k = 'userInfo') => getItem(k);

// export const getToken = (k = 'user_info') =>
//   getItem(k) != undefined ? getItem(k).token : '';

export const wipe = (s, t = 'px') => s.substring(0, s.lastIndexOf(t));
export const dateForm = (d, j = '-', s = '-') =>
  d
    .split('T')[0]
    .split(s)
    .join(j);
export const dateSplit = (d, s = '-') => d.split('T')[0].split(s);
export const newDate = a => new Date(a[0], a[1] - 1, a[2]);
export const daysLen = (s, e) => (e - s) / 86400000 + 1;
export const dateArrToLon = (d, i) => new Date(d + i * 86400000);
export const toLocale = d => d.toLocaleDateString();
// 2018-03-10T00:00:00.000Z => 2018/3/10
export const stampToLocale = d => toLocale(new Date(d));
export const createRow = l => {
  const arr = [];
  for (let i = 0; i < l; i++) {
    arr.push(i);
  }
  return arr;
};

// 去重
export const filterArr = keys =>
  keys.filter((v, i, arr) => arr.indexOf(v) === i);

export const filterObjArr = (arr, key) => {
  let newArr = [];
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      newArr.push(arr[i]);
      obj[arr[i][key]] = true;
    }
  }
  return newArr;
};

export const filterArrOForm = (arr, k, e = 'data') =>
  arr
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map(v => (v = { [k]: v, [e]: [] }));

export const mergeArr = (o, a, k, e = 'data') => {
  // console.log('a, k ：', o, a, k, e);
  const arr = [];
  a.map(v => {
    o.forEach(item => {
      if (item[k] === v[k]) {
        v[e].push(item);
      }
    });
    // console.log('  item ：', v[k], v[e])
    return v;
  });
  return a;
};

export const addProp = (arr, con, k, p) =>
  arr.map(v => ({ ...v, [p]: con.filter(item => item[k] === v[k])[0][p] }));

export const findDOMNode = (d, c) => d.findDOMNode(c);

// redux

const extension = window.devToolsExtension;
// console.log(' extension ： ', extension, extension ? '111' : 222);
export const tools = extension ? extension() : undefined;

export const showTotal = total => `Total ${total}`;

export const pagination = total => ({
  pageSize: SIZE,
  total,
  showSizeChanger: true,
  showTotal,
});

// 格式化部分提交数据 处理为 null
export const format2Null = (data = {}, keys = []) => {
  const formatObj = {
    ...data,
  };
  keys.forEach(k => (formatObj[k] = !data[k] && data[k] != 0 ? null : data[k]));
  return formatObj;
};

export const format2Str = (data = {}, keys = []) => {
  const formatObj = {
    ...data,
  };
  keys.forEach(
    k => (formatObj[k] = data[k] != undefined ? `${data[k]}` : null),
  );
  return formatObj;
};

export const num2Str = (data = {}, keys = []) => {
  const formatObj = {
    ...data,
  };
  keys.forEach(k => (formatObj[k] = isNaN(data[k]) ? data[k] : `${data[k]}`));
  return formatObj;
};

export const openTab = url => window.open(url);

export const recursiveKeys = (data = [], allKeys = []) => {
  data.forEach((v, i) => {
    allKeys.push(v.key);
    if (v.children) {
      recursiveKeys(v.children, allKeys);
    }
  });
};

export const formatDuring = second => {
  const days = parseInt(second / (60 * 60 * 24));
  const hours = parseInt((second % (60 * 60 * 24)) / (60 * 60));
  const minutes = parseInt((second % (60 * 60)) / 60);
  const seconds = (second % 60) / 1000;
  return days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分钟';
};

export const toFixed = (num = '', decimal = 2) => {
  num = num.toString();
  let index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  return parseFloat(num).toFixed(decimal);
};

export const vh = val => window.document.body.offsetHeight * 0.01 * val;