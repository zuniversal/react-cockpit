import { DualAxes } from '@ant-design/plots'
import { memo, useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'

const DualAxes1 = memo(DualAxes, () => true)

export const DemoDualAxes = (props) => {
  const { setChooseName, chooseName = '', minDiff = -10, maxDiff = 10 } = props
  const plotRef = useRef<any>()
  // 获取当前可视区域的高度，并设置为图表容器高度
  const height = 0.65 * document.body.clientWidth
  // 接取props中图例数据
  const columnData = props.columnData
  const lineData = props.lineData

  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey((prev) => prev + 1)
  }, [chooseName, columnData, lineData])

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
        nice: true,
        // min: minDiff,
        // max: maxDiff,
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
        dodgePadding: 1,
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
    onReady: (plot) => {
      plotRef.current = plot
    },
    interactions: [
      {
        type: 'element-selected',
        cfg: {
          start: [
            {
              trigger: 'element:click',
              action(evt) {},
            },
          ],
          end: [
            {
              trigger: 'element:click',
              action(evt) {
                if (!evt.event.data) {
                  return
                }
                console.log(evt.event.data.data)
                const nextCompany = evt.event.data.data.name
                if (chooseName !== nextCompany) {
                  setChooseName(nextCompany)
                }
              },
            },
          ],
        },
      },
    ],
  }

  useEffect(() => {
    plotRef.current.setState('inactive', (item) => {
      if (chooseName === '') {
        return false
      }
      return item.name !== chooseName
    })
  }, [chooseName, key])

  return <DualAxes1 key={key} {...config} />
}
