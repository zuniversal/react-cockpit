import { useWindowWidth } from '@react-hook/window-size'
import { LineChart } from 'echarts/charts'
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
export function DetailEcharts() {
  const [main, setMain] = useState('')
  const windowWidth = useWindowWidth()
  const width = windowWidth * 0.35
  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkAreaComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
  ])

  const option = {
    tooltip: false,
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      axisLabel: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(81, 131, 253, 1)' },
            { offset: 1, color: 'rgba(81, 131, 253, 0.2)' },
          ]),
        },
        lineStyle: {
          width: 1,
          color: '#5183FD',
        },
        color: '#5183FD',
        data: [
          [1, 2],
          [2, 6],
          [3, 5],
          [4, 10],
          [5, 4],
          [6, 8],
          [7, 4],
        ],
      },
    ],
  }

  useEffect(() => {
    const node = document.getElementById('workOrder')
    setMain(node)
  }, [main])

  if (main !== '') {
    const myChart = echarts.init(main)
    myChart.setOption(option)
  }

  return (
    <>
      <div
        id="workOrder"
        style={{
          height: '40px',
          width,
          position: 'relative',
          zIndex: '103',
        }}
      />
    </>
  )
}
