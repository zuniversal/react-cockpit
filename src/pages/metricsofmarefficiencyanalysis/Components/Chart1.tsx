import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useState, useEffect, useMemo, useRef } from 'react'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import styles from './styles.module.less'

const data = [
  {
    name: '江苏',
    总人均产能: 12,
    一线人均产能: 11,
  },
  {
    name: '厦门',
    总人均产能: 12,
    一线人均产能: 13,
  },
  {
    name: '武汉',
    总人均产能: 10,
    一线人均产能: 20,
  },
  {
    name: '江门',
    总人均产能: 20,
    一线人均产能: 15,
  },

  {
    name: '合肥',
    总人均产能: 30,
    一线人均产能: 20,
  },
  {
    name: '成都',
    总人均产能: 32,
    一线人均产能: 14,
  },
]

export function Chart1(props) {
  const { navigateToDetail, user } = useCurrentApp()
  const chartRef = useRef()
  const windowWidth = useWindowWidth()
  const selectedDataIndex = useRef(-1)

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.setOption({
        grid: { x: 30, y: 20, x2: 20, y2: 60 },
        legend: {
          bottom: 0,
          data: ['总人均产能', '一线人均产能'],
        },
        tooltip: {
          enterable: true,
          hideDelay: 200,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          renderMode: 'html',
          className: styles.pie_tooltip,
          formatter: (item) => {
            const [series1, series2] = item
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
            </div>`
            el.addEventListener('click', () => {
              navigateToDetail({ type: 'base', baseName: series1.name })
            })
            return el
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name),
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          min: 0,
          max: 40,
          type: 'value',
        },
        series: [
          {
            name: '总人均产能',
            data: data.map((item) => item['总人均产能']),
            type: 'line',
            color: '#766BF5',
            smooth: true,
          },
          {
            name: '一线人均产能',
            data: data.map((item) => item['一线人均产能']),
            color: '#E08142',
            type: 'line',
            smooth: true,
          },
        ],
      })
      chart.getZr().off('click')
      chart.getZr().on('click', (event) => {
        if (chart.containPixel('grid', [event.offsetX, event.offsetY])) {
          const [dataIndex] = chart.convertFromPixel({ seriesIndex: 0 }, [
            event.offsetX,
            event.offsetY,
          ])
          if (selectedDataIndex.current === dataIndex) {
            navigateToDetail({ type: 'base', baseName: data[dataIndex].name })
          }
          selectedDataIndex.current = dataIndex
        }
      })
    }
  }, [navigateToDetail])

  return (
    <>
      <div
        style={{
          color: '#8C8C8C',
          fontSize: '12px',
          paddingBottom: '10px',
        }}
      >
        (Kwh/人)
      </div>
      <div
        ref={chartRef}
        style={{ width: windowWidth - 44, height: windowWidth * 0.6 }}
      />
    </>
  )
}
