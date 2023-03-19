import { Column } from '@ant-design/plots'
import { PubSub } from 'pubsub-js'
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { DemoLine } from './DemoLine'

export function DemoDualAxes(props) {
  const [state, setState] = useState(true)
  const [title, setTitle] = useState('')
  const data = [
    {
      name: '江苏',
      type: '其他费用',
      value: 1000,
    },
    {
      name: '江苏',
      type: '福利费用',
      value: 2000,
    },
    {
      name: '江苏',
      type: '薪资成本',
      value: 1900,
    },
    {
      name: '成都',
      type: '其他费用',
      value: 500,
    },
    {
      name: '成都',
      type: '福利费用',
      value: 1000,
    },
    {
      name: '成都',
      type: '薪资成本',
      value: 1000,
    },
    {
      name: '武汉',
      type: '其他费用',
      value: 1000,
    },
    {
      name: '武汉',
      type: '福利费用',
      value: 1000,
    },

    {
      name: '武汉',
      type: '薪资成本',
      value: 2000,
    },
    {
      name: '合肥',
      type: '其他费用',
      value: 500,
    },
    {
      name: '合肥',
      type: '福利费用',
      value: 1000,
    },
    {
      name: '合肥',
      type: '薪资成本',
      value: 1500,
    },
    {
      name: '厦门',
      type: '其他费用',
      value: 1000,
    },
    {
      name: '厦门',
      type: '福利费用',
      value: 1200,
    },
    {
      name: '厦门',
      type: '薪资成本',
      value: 2000,
    },
    {
      name: '江门',
      type: '其他费用',
      value: 200,
    },
    {
      name: '江门',
      type: '福利费用',
      value: 1200,
    },
    {
      name: '江门',
      type: '薪资成本',
      value: 1800,
    },
  ]
  // const averageValue =
  //   data.map((d) => d.value).reduce((a, b) => a + b, 0) / data.length
  const config = {
    data,
    padding: 'auto',
    appendPadding: [0, 0, 10, 0],
    isStack: true,
    xField: 'name',
    autoFit: false,
    height: 230,
    yField: 'value',
    seriesField: 'type',
    color: ['#707E9D', '#5FCABB', '#6E94F2'],
    // legend: {
    //   position: 'bottom',
    //   itemSpacing: -10,
    //   offsetX: 30,
    //   flipPage: false,
    // },
    legend: false,
    yAxis: {
      max: 6000,
      nice: true,
      tickCount: 2,
      tickInterval: 2000,
      smooth: true,
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
          },
        },
      },
    },
    annotations: [
      {
        type: 'line',
        top: false,
        /** 起始位置 */
        start: ['min', 2200],
        /** 结束位置 */
        end: ['max', 2200],
        text: {
          content: 2200,
          position: 'right',
          offsetY: 8,
          offsetX: -12,
          style: {
            textAlign: 'right',
            fill: '#FF7979',
          },
        },
        style: {
          offsetX: -100,
          opacity: 0.5,
          lineDash: [2, 2],
          stroke: '#FF7979',
        },
      },
    ],
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
    maxColumnWidth: 17,
  }
  const plotRef = useRef<any>()
  //   useEffect(() => {
  // plotRef.current.setState('inactive', (item) => {
  //   if (title === '') {
  //     return false
  //   }
  //   return item.name !== title
  // })
  //   }, [title])
  return (
    <div>
      <h2 style={{ margin: 0, marginBottom: '20px', fontSize: 13 }}>
        基地人工成本分析
        <span
          style={{
            display: 'inline-block',
            width: '50px',
            paddingLeft: '10px',
            height: '24px',
            lineHeight: '24px',
            float: 'right',
            fontFamily: 'PingFang SC',
            fontStyle: 'normal',
            fontSize: '11px',
            color: '#383B46',
            background: '#F4F6F9',
            borderRadius: '11px',
          }}
          onClick={() => setState(!state)}
        >
          <img
            style={{ width: 12, height: 12, marginRight: 4 }}
            src={require('../../assets/icons/switch.svg')}
          />
          切换
        </span>
      </h2>
      <p style={{ margin: 0, fontSize: 10, color: '#8C8C8C' }}>(万元)</p>
      {state ? (
        <Column
          {...config}
          onReady={(plot) => {
            // plotRef.current = plot
            plot.on('plot:click', (evt) => {
              const { x, y } = evt
              const tooltipData = plot.chart.getTooltipItems({ x, y })
              //   setTitle(tooltipData[0].title)
              //   props.getChildTitle(tooltipData[0].title)
              PubSub.publish('title', tooltipData[0].title)
            })
          }}
        />
      ) : (
        <DemoLine />
      )}
    </div>
  )
}
