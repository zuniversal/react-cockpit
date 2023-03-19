import { DualAxes } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import { useEffect, useRef } from 'react'

import { tofixed } from '../../utils'
export const ManufacturingDualAxes = (props) => {
  const windowWidth = useWindowWidth()
  const setFactoryStage = props.setFactoryStage
  const setTitle = props.setTitle
  const entity = props.entity ?? ''
  const company = props.company ?? ''

  const columnData = props.columnData
  const lineData = props.lineData
  const plotRef = useRef<any>()

  const config = {
    data: [columnData, lineData],
    autoFit: false,
    padding: 'auto',
    appendPadding: [0, 0, 0, 12],
    xField: 'company',
    yField: ['value', '产能达成率'],
    xAxis: {
      label: {
        autoHide: false,
        formatter(val: string) {
          let idx = -1
          if (val.length > 5) {
            if (val.indexOf('（') !== -1) {
              idx = val.indexOf('（')
              return val.slice(0, idx) + '\n' + val.slice(idx)
            } else {
              if (/^[a-zA-Z]+$/.test(val)) {
                if (val.length > 7) {
                  idx = Math.trunc(val.length / 2)
                  return val.slice(0, idx) + '\n' + val.slice(idx)
                } else {
                  return val
                }
              } else {
                idx = Math.trunc(val.length / 2)
                return val.slice(0, idx) + '\n' + val.slice(idx)
              }
            }
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
      产能达成率: {
        nice: true,
        tickCount: 4,
        label: {
          formatter: (val) => tofixed(Number(val), 2) + '%',
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
        // dodgePadding: 1,
        isGroup: true,
        seriesField: 'name',
      },
      {
        geometry: 'line',
        color: '#6E94F2',
        smooth: true,
        lineStyle: {
          stroke: '#6E94F2',
          lineWidth: 2,
        },
        point: {
          shape: '',
          size: 2.5,
        },
        tooltip: {
          formatter: (datum) => {
            // 如果是写死的常量则可以不进行声明
            return { name: '产能达成率', value: datum.产能达成率 + '%' }
          },
        },
      },
    ],
  }

  useEffect(() => {
    plotRef.current.setState('inactive', (item) => {
      if (company === '') {
        return false
      }
      return item.company !== company
    })
  }, [company])

  return (
    <DualAxes
      onReady={(plot) => {
        plotRef.current = plot
      }}
      interactions={[
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
                  const nextCompany = evt.event.data.data.company
                  if (entity === '') {
                    if (company === nextCompany) {
                      setTitle('全部')
                      setFactoryStage('')
                    } else {
                      setTitle(nextCompany)
                      setFactoryStage(nextCompany)
                    }
                  } else {
                    if (company === nextCompany) {
                      setTitle('全部')
                      setFactoryStage('')
                    } else {
                      setTitle(nextCompany)
                      setFactoryStage(nextCompany)
                    }
                  }
                },
              },
            ],
          },
        },
      ]}
      {...config}
    />
  )
}
