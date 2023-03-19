import { DualAxes } from '@ant-design/plots'
import { memo, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const DualAxes1 = memo(DualAxes, () => {
  return true
})

export const DemoDualAxes1 = (props) => {
  // 获取当前可视区域的高度，并设置为图表容器高度
  const height = 0.65 * document.body.clientWidth
  // 接取props中图例数据
  const { columnData, lineData } = props

  let min = 0
  lineData?.map((item) => {
    if (Number(item.投入产出比) < 0) {
      min = Number(item.投入产出比)
    }
  })

  const config = {
    data: [columnData, lineData],
    padding: 'auto',
    appendPadding: [0, 0, 10, 0],
    autoFix: true,
    height,
    xField: 'name',
    yField: ['value', '投入产出比'],
    xAxis: {
      label: {
        autoHide: false,
      },
    },
    yAxis: {
      label: {
        offsetY: 3,
      },
      value: {
        nice: true,
        // tickCount: 4,
        // tickInterval: 200,
        grid: {
          line: {
            style: {
              stroke: 'rgba(217, 217, 217, 0.5)',
              lineDash: [4, 5],
            },
          },
        },
      },
      投入产出比: {
        nice: true,
        min,
        // max: 10,
        // tickCount: 5,
        label: {
          formatter: (val) => {
            return val + '%'
          },
        },
      },
    },
    legend: false,
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
        tooltip: {
          formatter: (datum) => {
            // 如果是写死的常量则可以不进行声明
            return { name: '投入产出比', value: datum.投入产出比 + '%' }
          },
        },
      },
    ],
  }

  return (
    <div>
      <DualAxes1 {...config} />
    </div>
  )
}
