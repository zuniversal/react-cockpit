import { arrMapObj, arrMapColor, createIndexArr } from '@/utils';

export const ynConfig = [
  {
    value: 1,
    label: '是',
  },
  {
    value: 0,
    label: '否',
  },
];

export const ynConfigMap = arrMapObj(ynConfig);

export const stringReg = /^[\u4e00-\u9fa5a-zA-Z ]+$/;

export const stringNameRule = {
  required: true,
  message: 'Please enter the correct name!',
  pattern: stringReg,
};

export const stringRule = {
  required: true,
  message: 'Please input string!',
  pattern: stringReg,
};

export const phoneRule = {
  required: true,
  message: '请输入正确的手机号',
  message: 'Please enter the correct mobile number',
  // pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
  pattern: /^[0-9]*$/,
};

export const emailRule = {
  required: true,
  message: '邮箱格式不正确',
  message: 'Incorrect mailbox format',
  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
};