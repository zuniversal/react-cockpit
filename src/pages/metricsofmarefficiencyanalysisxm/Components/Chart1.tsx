import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import styles from './styles.module.less'

export function Chart1(props) {
  const { navigateToDetail } = useCurrentApp()
  const chartRef = useRef()
  const {
    currentUnit = 'Kwh/h',
    data = [],
    onClickDataIndex,
    onClickTooltip,
  } = props
  const windowWidth = useWindowWidth()
  const selectedDataIndex = useRef(-1)

  const enterable = !!onClickTooltip

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.setOption({
        grid: { x: 30, y: 40, x2: 10, y2: 20 },
        legend: {
          top: 10,
          right: 10,
          data: ['实际人效', '目标人效'],
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { fontSize: 10 },
        },
        tooltip: {
          enterable,
          hideDelay: 200,
          trigger: 'axis',
          renderMode: 'html',
          axisPointer: {
            type: 'shadow',
          },
          className: styles.pie_tooltip,
          formatter: (item) => {
            const [series1, series2] = item
            const el = document.createElement('div')
            function formatNum(num) {
              return num?.toFixed(2)
            }
            let str = `<div>
            <div class="${styles.pie_tooltip_title}">
            ${series1.name}
            <div class="${styles.pie_tooltip_arrow}" style="display: ${
              enterable ? 'block' : 'none'
            }"></div>
            </div>`
            item.map((value) => {
              str += `<div class="${styles.pie_tooltip_desc}">
                <div class="${
                  styles.pie_tooltip_item
                }" style="background-color: ${value.color}"></div>
                <div class="${styles.pie_series_name}">${value.seriesName}</div>
                <div>${formatNum(value.value)}</div>
              </div>`
            })
            str += `</div>`
            el.innerHTML = str
            el.addEventListener('click', () => {
              onClickTooltip && onClickTooltip(item)
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
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: '目标人效',
            data: data.map((item) => item['目标人效']),
            color: '#5FCABB',
            type: 'bar',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
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
            onClickDataIndex && onClickDataIndex(dataIndex)
          }
          selectedDataIndex.current = dataIndex
        }
      })
    }
  }, [
    navigateToDetail,
    data,
    onClickDataIndex,
    enterable,
    onClickTooltip,
    currentUnit,
  ])

  return (
    <div
      ref={chartRef}
      style={{ width: windowWidth - 44, height: windowWidth * 0.6 }}
    />
  )
}
