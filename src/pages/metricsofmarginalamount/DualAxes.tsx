import { DualAxes } from '@ant-design/plots'
import { memo } from 'react'

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
    yField: ['value', 'price'],
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
      price: {
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
        label: {
          formatter: (val) => {
            return val + '%'
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      flipPage: false,
      marker: (name) => {
        if (name === '环比' || name === '边际率') {
          return {
            symbol: 'hyphen',
          }
        }
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        marginRatio: 0.1,
        color: ['#5183FD', '#5FCABB', '#A3A6FF'],
      },
      {
        geometry: 'line',
        seriesField: 'name',
        smooth: true,
        color: ['#766BF5', '#E08142'],
        lineStyle: {
          lineWidth: 2,
        },
        point: { shape: '', size: 2.5 },
        tooltip: {
          formatter: (datum) => {
            return { name: datum.name, value: datum.price + '%' }
          },
        },
      },
    ],
  }
  return <DualAxes1 {...config} />
}
