import { DualAxes } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import { memo, useEffect, useRef } from 'react'

const Column2 = memo(DualAxes, () => {
  return true
})

export const SalesDualAxes = (props) => {
  const {
    setChooseName,
    setChooseNameType,
    setTableTitle,
    tabKey,
    chooseName,
    visibleSaleType,
    columnData,
    lineData,
  } = props
  const windowWidth = useWindowWidth()
  const metaFlag = visibleSaleType === 'salesQuantity' ? '销售量' : '销售额'
  const plotRef = useRef<any>()
  let maxValue = 0
  columnData.map((item) => {
    if (item.value > maxValue) {
      maxValue = item.value
    }
  })
  const maxLimit = {}
  if (maxValue > 0) {
    maxLimit['maxLimit'] = parseInt(maxValue + maxValue / 4, 10) + 1
  }

  const config = {
    data: [columnData, lineData],
    autoFit: false,
    padding: 'auto',
    appendPadding: [0, 0, 10, 0],
    xField: 'company',
    yField: ['value', '销售量'],
    label: {
      position: 'top',
      offsetY: 10,
    },
    meta: {
      value: {
        alias: metaFlag,
      },
    },
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
        ...maxLimit,
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
          formatter(val: string) {
            return parseInt(val)
          },
        },
      },
      销售量: {
        nice: true,
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
        // dodgePadding: 1,
        isGroup: true,
        seriesField: 'name',
      },
      {
        geometry: 'line',
        color: '#5fcabb',
        smooth: true,
        lineStyle: {
          stroke: '#5fcabb',
          lineWidth: 2,
        },
        point: {
          shape: '',
          size: 2.5,
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
                const nextCompany = evt.event.data.data.company
                if (tabKey == '1') {
                  if (chooseName === nextCompany) {
                    setChooseName('')
                    setTableTitle('全部')
                    setChooseNameType('')
                  } else {
                    setChooseName(nextCompany)
                    setTableTitle(nextCompany)
                    setChooseNameType('a')
                  }
                } else {
                  if (chooseName === nextCompany) {
                    setChooseName('')
                    setTableTitle('全部')
                    setChooseNameType('')
                  } else {
                    setChooseName(nextCompany)
                    setTableTitle(nextCompany)
                    setChooseNameType('b')
                  }
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
      return item.company !== chooseName
    })
  }, [chooseName])

  return <Column2 {...config} key={chooseName} />
}
