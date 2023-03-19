import { DualAxes } from '@ant-design/plots'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { tofixed } from '../../utils'

export const AnalysisDualAxes = (props) => {
  const { ColumnData, LineData, isGWH } = props
  const height = 0.65 * document.body.clientWidth
  const { navigateToDetail } = useCurrentApp()
  const config = {
    data: [ColumnData, LineData],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'factoryStage',
    yField: ['value', '产能达成率'],
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
        min: 0,
        max: 100,
        label: {
          formatter: (val) => val + '%',
        },
        tickCount: 4,
      },
    },
    legend: {
      position: 'bottom',
      flipPage: false,
    },
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        marginRatio: 0.1,
        color: ['#5183FD', '#5FCABB', '#A3A6FF'],
        tooltip: {
          formatter: (datum) => {
            return { name: datum.type, value: tofixed(datum.value, 4) }
          },
        },
      },
      {
        geometry: 'line',
        // seriesField: 'name',
        smooth: true,
        color: '#E08142',
        lineStyle: {
          lineWidth: 2,
        },
        point: { shape: '', size: 2.5 },
        tooltip: {
          formatter: (datum) => {
            return {
              name: '产能达成率',
              value: tofixed(datum.产能达成率, 2) + '%',
            }
          },
        },
      },
    ],
    interactions: [
      {
        type: 'element-selected',
        cfg: {
          start: [
            {
              trigger: 'element:click',
              action(evt) {
                if (!evt.event.data) {
                  return
                }
                navigateToDetail({
                  factoryStage: evt.event.data.data.factoryStage,
                  unitMode: isGWH ? 'Gwh' : '千支',
                })
              },
            },
          ],
        },
      },
    ],
  }
  return <DualAxes {...config} />
}
