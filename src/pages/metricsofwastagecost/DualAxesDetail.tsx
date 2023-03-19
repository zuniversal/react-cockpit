import { DualAxes } from '@ant-design/plots'
import { memo, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const DualAxes1 = memo(DualAxes, () => {
  return true
})

export const DemoDualAxes = (props) => {
  // 获取当前可视区域的高度，并设置为图表容器高度
  const height = 0.65 * document.body.clientWidth
  const plotRef = useRef<any>()
  // 接取props中图例数据
  const {
    chooseName,
    setChooseName,
    setName,
    columnData,
    keys: key,
    lineData,
    setKeys,
  } = props

  let min = 0
  lineData?.map((item) => {
    if (Number(item.投入产出比) < 0) {
      min = Number(item.投入产出比)
    }
  })

  const length = 6

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
        formatter(value: string) {
          const val = value.split('-')[1]
          if (val.length > length) {
            const idx = val.length / length
            const idxInt = Math.trunc(val.length / length)
            let str = ''
            for (let i = 0; i < idxInt; i++) {
              if (i === 0) {
                str += val.slice(0, length) + '\n'
              } else {
                str += val.slice(i * length, i * length + length) + '\n'
              }
            }
            if (idx !== idxInt) {
              str += val.slice(idxInt * length)
            }
            return str
          }
          return val
        },
      },
    },
    yAxis: {
      label: {
        offsetY: 3,
      },
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
                const nextCompany = evt.event.data.data.name
                if (chooseName === nextCompany) {
                } else {
                  setChooseName(nextCompany)
                  setKeys(key + 1)
                  setName(nextCompany)
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
  }, [chooseName])

  return (
    <div>
      <DualAxes1 {...config} key={chooseName} />
    </div>
  )
}
