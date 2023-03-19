import { Line } from '@ant-design/plots'
import { uniq, findIndex } from '@antv/util'
import React, { useState, useEffect } from 'react'

export const DemoLine = (props) => {
  // const [data, setData] = useState([])

  // useEffect(() => {
  //   asyncFetch()
  // }, [])

  // const asyncFetch = () => {
  //   fetch(
  //     'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json'
  //   )
  //     .then((response) => response.json())
  //     .then((json) => setData(json))
  //     .catch((error) => {
  //       console.log('fetch data failed', error)
  //     })
  // }
  const height = 0.65 * document.body.clientWidth
  const data = props.lineData
  const COLOR_PLATE_10 = [
    '#678EF2',
    '#3AACFF',
    '#5FCABB',
    '#EEC24F',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  ]
  const config = {
    data,
    autoFix: true,
    height,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    // yAxis: {
    //   label: {
    //     // 数值格式化为千分位
    //     formatter: (v) =>
    //       `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    //   },
    // },
    tooltip: {
      domStyles: {
        'g2-tooltip-name': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 13,
          color: '#56555C',
        },
        'g2-tooltip-value': {
          fontFamily: 'DIN',
          fontWeight: 400,
          fontSize: 13,
          color: '#56555C',
        },
        'g2-tooltip-title': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 13,
          color: '#56555C',
        },
      },
    },
    legend: {
      position: 'bottom',
      flipPage: false,
      offsetY: 10,
    },
    color: COLOR_PLATE_10,
    point: {
      shape: 'circle',
      style: {
        r: 4,
      },
    },
  }

  return <Line {...config} />
}
