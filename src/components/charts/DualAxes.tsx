import { DualAxes } from '@ant-design/plots'
import { memo } from 'react'
import ReactDOM from 'react-dom'

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
    xField: 'time',
    yField: ['value', '环比'],
    xAxis: {
      label: {
        // 取日期中的月份
        formatter: (v) => v.slice(-2),
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
      环比: {
        nice: true,
        label: {
          formatter: (val) => val + '%',
        },
        tickCount: 4,
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
        color: ['#5FCABB', '#609EDF'],
        columnStyle: ({ type }) => {
          if (type.includes('预测')) {
            return {
              // 柱状图描边
              fill: 'rgba(95, 202, 187, 0.3)',
              stroke: '#5FCABB',
              lineWidth: 1,
              lineDash: [2, 2],
              strokeOpacity: 0.7,
            }
          }
        },
      },
      {
        geometry: 'line',
        color: '#7368EF',
        smooth: true,
        lineStyle: {
          stroke: '#7368EF',
          lineWidth: 2,
        },
        point: {
          shape: '',
          size: 2.5,
        },
        tooltip: {
          formatter: (datum) => {
            // 如果是写死的常量则可以不进行声明
            return { name: '环比', value: datum.环比 + '%' }
          },
        },
      },
    ],
  }
  return <DualAxes1 {...config} />
}
