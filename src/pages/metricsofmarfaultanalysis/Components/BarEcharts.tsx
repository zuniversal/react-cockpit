import { PopoverMenu } from 'antd-mobile/es/components/popover/popover-menu'
import { BarChart } from 'echarts/charts'
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
import { useState, useEffect, useMemo, useRef } from 'react'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'

// const data = [
//   { name: '设备1', 制卷: 180, 制芯: 180, 化成: 180 },
//   { name: '设备3', 制卷: 170, 制芯: 160, 化成: 160 },
//   { name: '设备5', 制卷: 150, 制芯: 160, 化成: 160 },
//   { name: '设备7', 制卷: 120, 制芯: 140, 化成: 130 },
//   { name: '设备10', 制卷: 100, 制芯: 120, 化成: 120 },
//   { name: '设备2', 制卷: 90, 制芯: 100, 化成: 100 },
//   { name: '设备4', 制卷: 90, 制芯: 90, 化成: 80 },
//   { name: '设备8', 制卷: 60, 制芯: 70, 化成: 80 },
//   { name: '设备6', 制卷: 60, 制芯: 60, 化成: 60 },
//   { name: '设备9', 制卷: 40, 制芯: 50, 化成: 60 },
// ]

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  BarChart,
  CanvasRenderer,
  UniversalTransition,
])

export function BarEcharts(props) {
  const { unit, data } = props
  const chartRef = useRef()

  useEffect(() => {
    const chart = echarts.init(chartRef.current)
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        bottom: 0,
      },
      grid: {
        top: 0,
        left: '3%',
        right: '4%',
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: {
          lineStyle: {
            type: 'dashed', //虚线
          },
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: data.map((item) => item.workcellName),
        axisTick: {
          show: false,
        },
        inverse: true,
        axisLine: {
          lineStyle: {
            color: 'rgba(217, 217, 217, 0.5);',
          },
        },
      },
      series: [
        {
          name: unit === 'a' ? '产量' : 'min',
          type: 'bar',
          color: '#5183FD',
          data: data.map((item) => {
            if (unit === 'a') {
              return item.outputEffect
            }
            return item.ptdEquipFailTime
          }),
        },
      ],
    })
  }, [data, unit])

  return (
    <div
      ref={chartRef}
      style={{
        height: '300px',
        zIndex: '103',
      }}
    />
  )
}
