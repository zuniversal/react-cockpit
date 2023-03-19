import { Column } from '@ant-design/plots'
import { PubSub } from 'pubsub-js'
import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
export function DemoDualAxes1(props) {
  const data1 = [
    {
      name: '07',
      type: '其他费用',
      value: 1000,
    },
    {
      name: '07',
      type: '福利费用',
      value: 2000,
    },
    {
      name: '07',
      type: '薪资成本',
      value: 1900,
    },
    {
      name: '08',
      type: '其他费用',
      value: 500,
    },
    {
      name: '08',
      type: '福利费用',
      value: 1000,
    },
    {
      name: '08',
      type: '薪资成本',
      value: 1000,
    },
    {
      name: '09',
      type: '其他费用',
      value: 1000,
    },
    {
      name: '09',
      type: '福利费用',
      value: 1000,
    },

    {
      name: '09',
      type: '薪资成本',
      value: 2000,
    },
    {
      name: '10',
      type: '其他费用',
      value: 500,
    },
    {
      name: '10',
      type: '福利费用',
      value: 1000,
    },
    {
      name: '10',
      type: '薪资成本',
      value: 1500,
    },
    {
      name: '11',
      type: '其他费用',
      value: 1000,
    },
    {
      name: '11',
      type: '福利费用',
      value: 1200,
    },
    {
      name: '11',
      type: '薪资成本',
      value: 2000,
    },
    {
      name: '12',
      type: '其他费用',
      value: 200,
    },
    {
      name: '12',
      type: '福利费用',
      value: 1200,
    },
    {
      name: '12',
      type: '薪资成本',
      value: 1800,
    },
  ]
  const data2 = [
    {
      name: '07',
      type: '其他费用',
      value: 1500,
    },
    {
      name: '07',
      type: '福利费用',
      value: 2500,
    },
    {
      name: '07',
      type: '薪资成本',
      value: 600,
    },
    {
      name: '08',
      type: '其他费用',
      value: 1500,
    },
    {
      name: '08',
      type: '福利费用',
      value: 800,
    },
    {
      name: '08',
      type: '薪资成本',
      value: 1100,
    },
    {
      name: '09',
      type: '其他费用',
      value: 2200,
    },
    {
      name: '09',
      type: '福利费用',
      value: 2100,
    },

    {
      name: '09',
      type: '薪资成本',
      value: 600,
    },
    {
      name: '10',
      type: '其他费用',
      value: 1200,
    },
    {
      name: '10',
      type: '福利费用',
      value: 1400,
    },
    {
      name: '10',
      type: '薪资成本',
      value: 1800,
    },
    {
      name: '11',
      type: '其他费用',
      value: 300,
    },
    {
      name: '11',
      type: '福利费用',
      value: 1200,
    },
    {
      name: '11',
      type: '薪资成本',
      value: 500,
    },
    {
      name: '12',
      type: '其他费用',
      value: 1200,
    },
    {
      name: '12',
      type: '福利费用',
      value: 1200,
    },
    {
      name: '12',
      type: '薪资成本',
      value: 1600,
    },
  ]
  const [title, setTitle] = useState('江苏')
  useEffect(() => {
    PubSub.subscribe('title', function (topic, title) {
      //message 为接收到的消息  这里进行业务处理
      setTitle(title)
    })
  }, [])
  let data = data1
  useMemo(() => {
    if (title === '江苏' || title === '武汉' || title === '厦门') {
      data = data1
    } else {
      data = data2
    }
  }, [title])

  const config = {
    data,
    isStack: true,
    xField: 'name',
    height: 230,
    yField: 'value',
    seriesField: 'type',
    color: ['#707E9D', '#5FCABB', '#6E94F2'],
    // legend: {
    //   position: 'bottom',
    //   itemSpacing: -10,
    //   offsetX: 30,
    //   // offsetY: 20,
    //   flipPage: false,
    // },
    legend: false,
    yAxis: {
      max: 6000,
      nice: true,
      tickCount: 2,
      tickInterval: 2000,
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
          },
        },
      },
    },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
    maxColumnWidth: 17,
  }

  return (
    <div>
      <h2 style={{ margin: ' 12px 0', fontSize: 13, color: '#000' }}>
        近6个月成本趋势-{title ? title : '全部'}
      </h2>
      <p style={{ margin: 0, fontSize: 10, color: '#8C8C8C' }}>(万元)</p>
      <Column {...config} />
    </div>
  )
}
