import { Column } from '@ant-design/plots'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

export const MarketDualAxes = (props) => {
  // 获取当前可视区域的高度，并设置为图表容器高度
  const height = 0.85 * document.body.clientWidth
  // 接取props中图例数据
  const columnData = props.columnData
  const lineData = props.lineData
  const config = {
    data: columnData,
    xField: 'year',
    yField: 'value',
    isGroup: true,
    seriesField: 'category',
    yAxis: {
      value: {
        nice: true,
        tickCount: 4,
      },
      compareValue: {
        nice: true,
        tickCount: 4,
        label: {
          formatter: (val) => val + '%',
        },
      },
    },
    autoFit: true,
    tooltip: {
      columnStyle: {
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
      itemWidth: 140,
    },
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'category',
        color: ['#678EF2', '#5FCABB', '#766BF5', '#8B98BA'],
      },
    ],
  }
  return <Column {...config} />
}
