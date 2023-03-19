import { DualAxes } from '@ant-design/plots'
import { Card, ErrorBlock } from 'antd-mobile'
import { useState } from 'react'
import ReactDOM from 'react-dom'

import { Loading } from '../../components/loading/Loading'

import { tofixed } from '../../utils'

export const Detail2DualAxes = (props) => {
  const { uvData2, transformData2 } = props
  let pre = ''
  const height = 0.65 * document.body.clientWidth
  // if (uvData2.length === 0 && transformData2.length === 0) {
  //   return <Loading style={{ height: '25vh', width: '90vw' }} />
  // }
  const config = {
    data: [uvData2, transformData2],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'time',
    yField: ['value', 'price'],
    xAxis: {
      label: {
        autoHide: false,
        formatter(val: string) {
          let str = ''
          if (pre === val.split('-')[0]) {
            str = val.split('-')[1]
          } else {
            str = val.split('-')[0].slice(2) + '.' + val.split('-')[1]
          }
          pre = val.split('-')[0]
          return str
        },
      },
    },
    yAxis: {
      value: {
        min: 0,
        nice: true,
        tickCount: 4,
        grid: {
          line: {
            style: {
              stroke: 'rgba(217, 217, 217, 0.5)',
              lineDash: [4, 5],
            },
          },
        },
      },
      price: {
        min: 0,
        nice: true,
        tickCount: 4,
        label: null,
        grid: {
          line: {
            style: {
              stroke: 'rgba(217, 217, 217, 0.5)',
              lineDash: [4, 5],
            },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      flipPage: false,
      marker: (name) => {
        if (name === '市场售价' || name === '公司售价') {
          return {
            symbol: 'hyphen',
          }
        }
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        marginRatio: 0.1,
        color: ['#5183FD', '#5FCABB', '#A3A6FF'],
      },
      {
        geometry: 'line',
        seriesField: 'name',
        smooth: true,
        color: ['#E08142', '#766BF5'],
        lineStyle: {
          lineWidth: 2,
        },
        point: { shape: '', size: 2.5 },
        tooltip: {
          formatter: (datum) => {
            return { name: datum.name, value: datum.price }
          },
        },
      },
    ],
    interactions: [
      {
        type: 'element-selected',
        cfg: {
          start: [
            {
              trigger: 'element:click',
              action(evt) {},
            },
          ],
        },
      },
    ],
  }

  return <DualAxes {...config} />
}
