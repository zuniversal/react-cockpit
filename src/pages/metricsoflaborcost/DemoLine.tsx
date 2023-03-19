import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { PubSub } from 'pubsub-js'
import { useState, useEffect, useMemo, useRef } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import styles from './styles.module.less'
const data = [
  {
    name: '江苏',
    其他费用: 1000,
    福利费用: 2000,
    薪资成本: 1900,
  },
  {
    name: '成都',
    其他费用: 500,
    福利费用: 1000,
    薪资成本: 1000,
  },
  {
    name: '武汉',
    其他费用: 1000,
    福利费用: 1000,
    薪资成本: 2000,
  },
  {
    name: '合肥',
    其他费用: 500,
    福利费用: 1000,
    薪资成本: 1500,
  },
  {
    name: '厦门',
    其他费用: 1000,
    福利费用: 1200,
    薪资成本: 2000,
  },
  {
    name: '江门',
    其他费用: 200,
    福利费用: 1200,
    薪资成本: 1800,
  },
]

export function DemoLine(props) {
  const { navigateToDetail, user } = useCurrentApp()
  const chartRef = useRef()
  const windowWidth = useWindowWidth()

  useEffect(() => {
    const markLine = [{ name: 2200, yAxis: 2200 }]
    const positions = 'end'
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.on('click', function (params) {
        // 控制台打印数据的名称
        // props.getChildTitle(params.name)
        PubSub.publish('title', params.name)
      })

      chart.setOption({
        grid: { x: 40, y: 20, x2: 20, y2: 30 },
        // legend: {
        //   bottom: 0,
        //   data: ['其他费用', '福利费用', '薪资成本'],
        // },
        legend: false,
        tooltip: {
          enterable: true,
          hideDelay: 200,
          trigger: 'axis',
          renderMode: 'html',
          className: styles.pie_tooltip,
          formatter: (item) => {
            const [series1, series2, series3] = item
            const el = document.createElement('div')
            el.innerHTML = `<div>
            <div class="${styles.pie_tooltip_title}">
            ${series1.name}
            <div class="${styles.pie_tooltip_arrow}"></div>
            </div>
            <div class="${styles.pie_tooltip_desc}">
              <div class="${styles.pie_tooltip_color1}"></div>
              <div class="${styles.pie_series_name}">${series1.seriesName}</div>
              <div>${series1.value}</div>
            </div>
            <div class="${styles.pie_tooltip_desc}">
              <div class="${styles.pie_tooltip_color2}"></div>
              <div class="${styles.pie_series_name}">${series2.seriesName}</div>
              <div>${series2.value}</div>
            </div>
            <div class="${styles.pie_tooltip_desc}">
              <div class="${styles.pie_tooltip_color3}"></div>
              <div class="${styles.pie_series_name}">${series3.seriesName}</div>
              <div>${series3.value}</div>
            </div>
            </div>`
            el.addEventListener('click', () => {
              //   props.getChildTitle(series1.name)
              PubSub.publish('title', series1.name)
              //   navigateToDetail({ type: 'base', baseName: series1.name })
            })
            return el
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name),
        },
        yAxis: {
          max: 6000,
          interval: 2000,
          type: 'value',
        },
        series: [
          {
            name: '其他费用',
            data: data.map((item) => item['其他费用']),
            type: 'line',
            color: '#707E9D',
            smooth: true,
            markLine: {
              symbol: ['none', 'none'],
              data: markLine,
              lineStyle: {
                type: 'dashed',
                width: 0.5,
                color: '#FF7979',
              },
              label: {
                distance: -20,
                color: '#FF7979',
              },
            },
          },
          {
            name: '福利费用',
            data: data.map((item) => item['福利费用']),
            color: '#5FCABB',
            type: 'line',
            smooth: true,
          },
          {
            name: '薪资成本',
            data: data.map((item) => item['薪资成本']),
            color: '#5183FD',
            type: 'line',
            smooth: true,
          },
        ],
      })
    }
  }, [navigateToDetail])

  return (
    <>
      <div ref={chartRef} style={{ width: windowWidth - 44, height: 230 }} />
    </>
  )
}
