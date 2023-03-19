import { DualAxes } from '@ant-design/plots'
import React, { useState, useEffect, useRef, memo } from 'react'
import ReactDOM from 'react-dom'

import { Loading } from '../../components/loading/Loading'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
const DualAxes1 = memo(DualAxes, () => true)
export const Detail1DualAxes = (props) => {
  const { uvData1, transformData1, setTarget, target, target1 } = props
  const height = 0.65 * document.body.clientWidth
  const plotRef = useRef<any>()
  // if (uvData1.length === 0 && transformData1.length === 0) {
  //   return <Loading style={{ height: '25vh', width: '90vw' }} />
  // }

  const config = {
    data: [uvData1, transformData1],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'target',
    yField: ['value', 'price'],
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
      value: {
        min: 0,
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
        min: 0,
        nice: true,
        tickCount: 4,
        label: null,
        grid: {
          line: {
            style: {
              stroke: 'rgba(217, 217, 217, 0.5)',
              lineDash: [4, 5],
            },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      flipPage: false,
      marker: (name) => {
        if (name === '市场售价' || name === '公司售价') {
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
        color: ['#E08142', '#766BF5'],
        lineStyle: {
          lineWidth: 2,
        },
        point: { shape: '', size: 2.5 },
        tooltip: {
          formatter: (datum) => {
            return { name: datum.name, value: datum.price }
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
                const nextTarget = evt.event.data.data.target
                if (uvData1.length === 0) {
                  if (target === nextTarget) {
                    setTarget(target1)
                  } else {
                    setTarget(nextTarget)
                  }
                } else {
                  if (target === nextTarget) {
                    setTarget(target1)
                  } else {
                    setTarget(nextTarget)
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
    try {
      plotRef.current.setState('inactive', (item) => {
        if (target === '') {
          return false
        }
        return item.target !== target
      })
    } catch (error) {}
  }, [target])
  return <>{uvData1.length > 0 && <DualAxes1 {...config} key={target} />}</>
}
