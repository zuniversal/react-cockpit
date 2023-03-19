import { useWindowWidth } from '@react-hook/window-size'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import styles from './styles.module.less'
export function PieEcharts(props) {
  const { data } = props
  const width = useWindowWidth()
  const { navigateToDetail } = useCurrentApp()
  const chartRef = useRef()

  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkAreaComponent,
    PieChart,
    CanvasRenderer,
    UniversalTransition,
  ])

  useEffect(() => {
    const myChart = echarts.init(chartRef.current)
    myChart.setOption({
      tooltip: {
        enterable: true,
        trigger: 'item',
        hideDelay: 200,
        // position: (point) => {
        //   return point
        // },
        renderMode: 'html',
        className: styles.pie_tooltip,
        formatter: (item) => {
          const el = document.createElement('div')
          el.innerHTML = `<div>
          <div class="${styles.pie_tooltip_title}">
          ${item.data.name}
          <div class="${styles.pie_tooltip_arrow}"></div>
          </div>
          <div class="${styles.pie_tooltip_desc}">
          <span>影响产量</span>
          <span>${item.data.value}</span>
          </div>
          </div>`
          el.addEventListener('click', () => {
            navigateToDetail({ factoryStage: item.data.name })
          })
          return el
        },
      },
      legend: false,
      color: ['#5183FD', '#5FCABB'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: '60%',
          data: data.map((item) => {
            return {
              name: item.factory,
              value: item.outputEffect,
            }
          }),
          label: {
            formatter: '{b}\n{d}%',
          },
          labelLine: {
            // minTurnAngle: 90,
            // maxSurfaceAngle: 90,
            // length: 4,
            // length2: 4,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
  }, [data, navigateToDetail])

  return (
    <>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          ref={chartRef}
          style={{
            height: width * 0.6,
            width: width - 44,
          }}
        />
      </div>
    </>
  )
}
