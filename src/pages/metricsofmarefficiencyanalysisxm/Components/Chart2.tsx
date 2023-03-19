import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import styles from './styles.module.less'

export function Chart2(props) {
  const { navigateToDetail } = useCurrentApp()
  const chartRef = useRef()
  const { currentUnit = 'Kwh/h', data = [], onClickTooltip } = props
  const windowWidth = useWindowWidth()

  const enterable = !!onClickTooltip
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.setOption({
        grid: { x: 30, y: 40, x2: 10, y2: 20 },
        tooltip: {
          enterable,
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
            function formatNum(num) {
              return num.toFixed(2)
            }
            el.innerHTML = `<div>
            <div class="${styles.pie_tooltip_title}">
            ${series1.name}
            <div class="${styles.pie_tooltip_arrow}" style="display: ${
              enterable ? 'block' : 'none'
            }"></div>
            </div>
            <div class="${styles.pie_tooltip_desc}">
              <div class="${
                styles.pie_tooltip_item
              }" style="background-color: ${series1.color}"></div>
              <div class="${styles.pie_series_name}">${series1.seriesName}</div>
              <div>${formatNum(series1.value)}</div>
            </div>
            <div class="${styles.pie_tooltip_desc}">
              <div class="${
                styles.pie_tooltip_item
              }" style="background-color: ${series2.color}"></div>
              <div class="${styles.pie_series_name}">${series2.seriesName}</div>
              <div>${formatNum(series2.value)}</div>
            </div>
            </div>`
            el.addEventListener('click', () => {
              onClickTooltip && onClickTooltip(item)
            })
            return el
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name),
          axisLabel: { interval: 0, fontSize: 10 },
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          min: 0,
          max: 40,
          type: 'value',
          name: `(${currentUnit})`,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        series: [
          {
            name: '实际人效',
            data: data.map((item) => item['实际人效']),
            type: 'bar',
            color: '#5183FD',
            smooth: true,
            barMaxWidth: 4,
            itemStyle: {},
          },
          {
            name: '目标人效',
            data: data.map((item) => item['目标人效']),
            color: '#5FCABB',
            type: 'bar',
            barMaxWidth: 4,
            smooth: true,
            itemStyle: {},
          },
        ],
      })
    }
  }, [navigateToDetail, enterable, data, onClickTooltip, currentUnit])

  return (
    <div
      ref={chartRef}
      style={{ width: windowWidth - 44, height: windowWidth * 0.6 }}
    />
  )
}
