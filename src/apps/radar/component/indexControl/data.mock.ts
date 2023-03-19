import React from 'react'
import {
  stock,
  production,
  sale,
  resources,
  plan,
  sales,
  userImg,
} from '../../importFile'
let data = [
  {
    url: stock,
    title: '库存',
    subtitle: '1项告警   1项预警',
    frontComponent: '/metrics/metricsofinventoryanalysis',
    type: '1574200938699243522',
    children: [
      {
        title: '库存分析',
        warning: {
          //告警
          type: 0,
          reason: '超过告警值10Gwh',
          time: '2022.12.27 10:23',
          state: false,
          router: '/',
        },
        children: [
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
        ],
      },
      {
        title: '库存分析',
        warning: {
          //预警
          type: 1,
          reason: '超过预警值2Gwh',
          time: '2022.12.27 10:23',
          state: false,
        },
        children: [
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
        ],
      },
    ],
  },
  {
    url: production,
    title: '生产',
    subtitle: '1项告警',
    frontComponent: '/metrics/metricsofmanufacturing',
    type: '1574200938699243522',
    children: [
      {
        title: '生产分析',
        warning: {
          //告警
          type: 0,
          reason: '超过告警值10Gwh',
          time: '2022.12.27 10:23',
          state: false,
          router: '/',
        },
        children: [
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
        ],
      },
    ],
  },
  {
    url: sale,
    title: '销售',
    subtitle: '1项告警',
    frontComponent: '/metrics/metricsofsales',
    type: '1574200938699243522',
    children: [
      {
        title: '销售分析',
        warning: {
          //告警
          type: 0,
          reason: '超过告警值10Gwh',
          time: '2022.12.27 10:23',
          state: false,
          router: '/',
        },
        children: [
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
        ],
      },
    ],
  },
  {
    url: resources,
    title: '人力',
    subtitle: '1项告警',
    frontComponent: '/metrics/metricsoflaborcost',
    type: '1574200938699243522',
    children: [
      {
        title: '人力分析',
        warning: {
          //告警
          type: 0,
          reason: '超过告警值10Gwh',
          time: '2022.12.27 10:23',
          state: false,
          router: '/',
        },
        children: [
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
        ],
      },
    ],
  },
  {
    url: plan,
    title: '计划',
    subtitle: '1项告警',
    frontComponent: '/metrics/metricsofmarworkorderanalysis',
    children: [
      {
        title: '计划分析',
        warning: {
          //告警
          type: 0,
          reason: '超过告警值10Gwh',
          time: '2022.12.27 10:23',
          state: false,
          router: '/',
        },
        children: [
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
        ],
      },
    ],
  },
  {
    url: sales,
    title: '售后',
    subtitle: '1项告警',
    frontComponent: '/metrics/metricsofdeliveryreached',
    children: [
      {
        title: '售后分析',
        warning: {
          //告警
          type: 0,
          reason: '超过告警值10Gwh',
          time: '2022.12.27 10:23',
          state: false,
          router: '/',
        },
        children: [
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
          {
            company: '某某某某岗',
            picture: userImg,
            name: '张三',
            phone: '1234567890',
          },
        ],
      },
    ],
  },
]

export default data
