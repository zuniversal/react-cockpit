import React, { useState, useEffect } from 'react'
import { Pie } from '@ant-design/plots'

export const TabPie5 = (props) => {
  const data = [
    {
      type: '小时工',
      value: 19,
    },
    {
      type: '实习生',
      value: 25,
    },
    {
      type: '合同工',
      value: 25,
    },
    {
      type: '劳务外包',
      value: 30,
    },
  ]
  const data1 = [
    {
      type: '小时工',
      value: 190,
    },
    {
      type: '实习生',
      value: 250,
    },
    {
      type: '合同工',
      value: 100,
    },
    {
      type: '劳务外包',
      value: 300,
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
    angleField: 'value',
    colorField: 'type',
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
