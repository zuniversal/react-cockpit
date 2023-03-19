import { Column } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import { memo, useEffect, useRef } from 'react'

const Column2 = memo(Column, () => {
  return true
})

export const LosscostDualAxes = (props) => {
  const {
    setChooseName,
    setChooseNameType,
    setTableTitle,
    tabKey,
    chooseName,
    visibleSaleType,
  } = props
  const windowWidth = useWindowWidth()
  const metaFlag = visibleSaleType === 'salesQuantity' ? '销售量' : '销售额'
  // 接取props中图例数据
  const columnData = props.columnData
  const plotRef = useRef<any>()
  let maxValue = 0
  columnData.map((item) => {
    if (item.value > maxValue) {
      maxValue = item.value
    }
  })
  const maxLimit = {}
  if (maxValue > 0) {
    maxLimit['maxLimit'] = parseInt(maxValue + maxValue / 4, 10)
  }

  const config = {
    data: columnData,
    autoFit: false,
    // padding: [17, 17, 17, 17],
    padding: 'auto',
    appendPadding: [0, 0, 20, 0],
    xField: 'company',
    yField: 'value',
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
        formatter: function (val: string) {
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
      ...maxLimit,
      value: {
        nice: true,
        min: 0,
        tickCount: 4,
      },
      value1: {
        nice: true,
        min: 0,
        tickCount: 4,
      },
      grid: {
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
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
