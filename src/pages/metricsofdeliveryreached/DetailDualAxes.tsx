import { DualAxes, G2 } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

export const DeliveryDualAxes = (props) => {
  const windowWidth = useWindowWidth()
  const {
    chooseName,
    setChooseName,
    setChooseNameType,
    setTableTitle,
    tabKey,
    setCustomerNumber,
    setBaseName,
  } = props
  const plotRef = useRef<any>()
  const onReadyColumn = (plot: any) => {
    // 记录点击次数
    let count1 = 0
    let count2 = 0
    plotRef.current = plot
    plot.on('element:click', (...args: any) => {
      try {
        if (tabKey == '1') {
          count2 = 0
          count1++
          // 点击奇数次，表示进入 特定客户/基地；点击偶数次，表示退回 所有客户/基地
          if (count1 % 2 == 0) {
            setChooseName('')
            setTableTitle('全部')
            setChooseNameType('')
            setCustomerNumber('')
          } else {
            setChooseName(args[0].data.data.company)
            setTableTitle(args[0].data.data.company)
            setCustomerNumber(args[0].data.data.company)
            setChooseNameType('a')
          }
        } else if (tabKey == '2') {
          count1 = 0
          count2++
          if (count2 % 2 == 0) {
            setChooseName('')
            setTableTitle('全部')
            setChooseNameType('')
            setBaseName('')
          } else {
            setChooseName(args[0].data.data.company)
            setTableTitle(args[0].data.data.company)
            setBaseName(args[0].data.data.company)
            setChooseNameType('b')
          }
        }
      } catch (error) {}
    })
  }

  // 接取props中图例数据
  const columnData = props.topColumnData
  const lineData = props.topLineData
  console.log(columnData)

  const config = {
    data: [columnData, lineData],
    autoFit: false,
    xField: 'company',
    yField: ['value', '发货达成率'],
    padding: 'auto',
    appendPadding: [0, 10, 0, 10],
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
      发货达成率: {
        nice: true,
        tickCount: 4,
        label: {
          formatter: (val) => Number(val).toFixed(2) + '%',
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
        isStack: true,
        seriesField: 'name',
        color: ['#5FCABB', '#6E94F2'],
        // label: {
        //   position: 'top',
        //   offsetY: 12,
        // },
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
            return { name: '发货达成率', value: datum.发货达成率 + '%' }
          },
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
  return <DualAxes {...config} onReady={onReadyColumn} />
}
