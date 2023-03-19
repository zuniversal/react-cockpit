import { DualAxes } from '@ant-design/plots'
import { memo } from 'react'

import { accMul } from '../../utils/index'

const DualAxes1 = memo(DualAxes, () => {
  return true
})

export const DemoDualAxes = (props) => {
  // 获取当前可视区域的高度，并设置为图表容器高度
  const height = 0.65 * document.body.clientWidth
  // 接取props中图例数据
  const columnData = props.columnData
  const lineData = props.lineData
  const config = {
    data: [columnData, lineData],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'name',
    yField: ['value', 'CALB渗透率'],
    yAxis: {
      value: {
        nice: true,
        tickCount: 4,
        grid: {
          line: {
            style: {
              stroke: 'rgba(217, 217, 217, 0.5)',
              lineDash: [4, 5],
            },
          },
        },
      },
      CALB渗透率: {
        nice: true,
        min: 2,
        tickCount: 5,
        label: {
          formatter: (val) => val + '%',
        },
      },
    },
    legend: {
      position: 'bottom',
    },
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
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        color: ['#5183FD'],
        dodgePadding: 1,
      },
      {
        geometry: 'line',
        color: '#5FCABB',
        smooth: true,
        lineStyle: {
          stroke: '#5FCABB',
          lineWidth: 2,
        },
        point: {
          shape: '',
          size: 2.5,
        },
        tooltip: {
          formatter: (val) => {
            console.log('val', val)
            return {
              name: 'CALB渗透率',
              value: accMul(val['CALB渗透率'] || 0, 100) + '%',
            }
          },
        },
      },
    ],
  }
  return <DualAxes1 {...config} />
}
