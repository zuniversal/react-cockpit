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
import { useState, useEffect, useMemo } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { accMul, debounce } from '../../utils/index'
import styles from './pie.module.less'
export function PieEcharts(props) {
  const width = useWindowWidth()
  const { navigateToDetail, user } = useCurrentApp()
  const [main, setMain] = useState('')
  const title = []

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
  const data = props.data

  useEffect(() => {
    const node = document.getElementById('pieCharts')
    setMain(node)
  }, [main])

  if (main !== '') {
    const myChart = echarts.init(main)
    myChart.setOption({
      tooltip: {
        enterable: true,
        trigger: 'item',
        hideDelay: 200,
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
          <span>损耗金额</span>
          <span>${item.data.value}</span>
          </div>
          </div>`
          // el.addEventListener('click', () => {
          //   navigateToDetail({ factoryStage: item.data.name })
          // })
          return el
        },
      },
      legend: false,
      color: ['#707E9D', '#6E94F2', '#5D6C8F', '#5FCABB'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: '60%',
          data,
          label: {
            formatter: '{b}  {d}%',
          },
          labelLine: {
            length: 0,
            length2: 4,
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
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          id="pieCharts"
          style={{
            height: width * 0.6,
            width: width - 44,
            // margin: '-56px -20% 0',
          }}
        />
      </div>
    </>
  )
}
