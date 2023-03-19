import React, { useState, useEffect } from 'react'
import { Pie } from '@ant-design/plots'

export function TabPie3(props) {
  const data = [
    {
      type: '一年以内',
      value: 19,
    },
    {
      type: '五年以上',
      value: 25,
    },
    {
      type: '3-5年',
      value: 25,
    },
    {
      type: '1-3年',
      value: 30,
    },
  ]
  const data1 = [
    {
      type: '一年以内',
      value: 39,
    },
    {
      type: '五年以上',
      value: 15,
    },
    {
      type: '3-5年',
      value: 20,
    },
    {
      type: '1-3年',
      value: 40,
    },
  ]
  const config = {
    appendPadding: 10,
    data:
      props.title === '一级部门' ||
      props.title === '部门3' ||
      props.title === '部门5' ||
      props.title === ''
        ? data
        : data1,
    autoFit: false,
    angleField: 'value',
    colorField: 'type',
    width: 330,
    height: 250,
    radius: 0.5,
    color: ['#6E94F2', '#5FCABB', '#707E9D', '#5D6C8F'],
    label: {
      type: 'spider',
      labelHeight: 8,
      content: '{name}\n{percentage}',
    },
    legend: false,
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  }
  return <Pie {...config} />
}
