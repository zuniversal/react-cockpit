import { Column } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import React, { useState, useEffect, useRef, memo } from 'react'
import ReactDOM from 'react-dom'

const Column2 = memo(Column, () => true)

export const GrossprofitColumn = (props) => {
  const windowWidth = useWindowWidth()
  const {
    chooseName,
    setChooseName,
    setChooseNameType,
    setTableTitle,
    tabKey,
  } = props
  const plotRef = useRef<any>()
  const onReadyColumn = (plot: any) => {
    plotRef.current = plot
    // temp用来记录上一次点击的具体客户/基地
    const temp1 = []
    const temp2 = []
    // const setTableTitle = (a: any) => {}
    // const setChooseNameType = (a: any) => {}
    // const setChooseName = (a: any) => {}
    plot.on('element:click', (...args: any) => {
      try {
        if (tabKey == '1') {
          temp1.push(args[0].data.data.company)
          // 如果本次点击的具体客户/基地与上一次的相同
          if (temp1.length == 1) {
            setChooseName(args[0].data.data.company)
            setTableTitle(args[0].data.data.company)
            setChooseNameType('a')
          } else {
            if (temp1[temp1.length - 2] == temp1[temp1.length - 1]) {
              setChooseName('')
              setTableTitle('全部')
              setChooseNameType('')
              while (temp1.length != 0) {
                temp1.pop()
              }
            } else {
              setChooseName(args[0].data.data.company)
              setTableTitle(args[0].data.data.company)
              setChooseNameType('a')
            }
          }
        } else if (tabKey == '2') {
          temp2.push(args[0].data.data.company)
          if (temp2.length == 1) {
            setChooseName(args[0].data.data.company)
            setTableTitle(args[0].data.data.company)
            setChooseNameType('b')
          } else {
            if (temp2[temp2.length - 2] == temp2[temp2.length - 1]) {
              setChooseName('')
              setTableTitle('全部')
              setChooseNameType('')
              while (temp2.length != 0) {
                temp2.pop()
              }
            } else {
              setChooseName(args[0].data.data.company)
              setTableTitle(args[0].data.data.company)
              setChooseNameType('b')
            }
          }
        }
      } catch (error) {}
    })
  }

  // 接取props中图例数据
  const columnData = props.columnData

  let maxValue = 0
  let min = 0

  columnData.map((item) => {
    if (item.value > maxValue) {
      maxValue = item.value
    }
    if (item.value < 0 && item.value - 0.5 < min) {
      min = Number(item.value) - 0.5
    }
  })
  const maxLimit = {}
  if (maxValue > 0) {
    maxLimit['maxLimit'] = parseInt(maxValue + maxValue / 4, 10) + 1
  }
  const config = {
    data: columnData,
    autoFit: false,
    xField: 'company',
    yField: 'value',
    padding: 'auto',
    appendPadding: [0, 0, 20, 0],
    label: {
      position: 'top',
      offsetY: 10,
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
      nice: true,
      label: {
        formatter: function (val: string) {
          return Number(val).toFixed(2)
        },
      },
      min: min,
      grid: {
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
    meta: {
      value: {
        alias: '毛利额',
      },
    },
  }
  useEffect(() => {
    plotRef.current.setState('inactive', (item) => {
      if (chooseName === '') {
        return false
      }
      return item.company !== chooseName
    })
  }, [chooseName])

  return <Column2 {...config} onReady={onReadyColumn} key={chooseName} />
}
