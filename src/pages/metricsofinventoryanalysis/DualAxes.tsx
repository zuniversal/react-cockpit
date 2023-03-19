import { DualAxes } from '@ant-design/plots'
import { memo } from 'react'
import ReactDOM from 'react-dom'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'

export const DemoDualAxes = (props) => {
  // 获取当前可视区域的高度，并设置为图表容器高度
  // const height = 0.65 * document.body.clientWidth
  const height = 210
  // 接取props中图例数据
  const columnData = props.columnData
  const lineData = props.lineData
  const segmentKey = props.segmentKey
  const { navigateToDetail } = useCurrentApp()
  const config = {
    data: [columnData, lineData],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'name',
    yField: ['value', '偏差(天数)'],
    xAxis: {
      label: {
        autoHide: false,
        formatter(val: string) {
          if (val.length > 3) {
            const idx = val.length / 3
            const idxInt = Math.trunc(val.length / 3)
            let str = ''
            for (let i = 0; i < idxInt; i++) {
              if (i === 0) {
                str += val.slice(0, 3) + '\n'
              } else {
                str += val.slice(i * 3, i * 3 + 3) + '\n'
              }
            }
            if (idx !== idxInt) {
              str += val.slice(idxInt * 3)
            }
            return str
          }
          return val
        },
      },
    },
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
      '偏差(天数)': {
        nice: false,
        tickCount: 5,
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
        color: ['#5183FD', '#5FCABB'],
        // dodgePadding: 1,
      },
      {
        geometry: 'line',
        color: '#E08142',
        smooth: true,
        lineStyle: {
          stroke: '#E08142',
          lineWidth: 2,
        },
        point: {
          shape: '',
          size: 2.5,
        },
        tooltip: {},
      },
    ],
    interactions: [
      {
        type: 'element-selected',
        cfg: {
          start: [
            {
              trigger: 'element:click',
              action(evt) {
                navigateToDetail({
                  applicationArea: evt.event.data.data.name,
                  segmentKey,
                  isGWH: props.isGWH,
                })
              },
            },
          ],
        },
      },
    ],
  }
  return <DualAxes {...config} />
}
