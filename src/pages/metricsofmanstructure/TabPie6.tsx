import { Bar } from '@ant-design/plots'
import { each, groupBy } from '@antv/util'
import React, { useState, useEffect } from 'react'

import styles from './CardMode.module.less'
export const TabPie6 = (props) => {
  const data = [
    {
      name: '现场技术通道-技术',
      value: 5000,
      type: 'L1',
    },
    {
      name: '现场技术通道-技术',
      value: 1000,
      type: 'L2',
    },
    {
      name: '现场技术通道-技术',
      value: 1000,
      type: 'L3',
    },
    {
      name: '现场技术通道-技术',
      value: 1000,
      type: 'L4',
    },
    {
      name: '现场技术通道-技术',
      value: 1000,
      type: 'L5',
    },
    {
      name: '现场技术通道-技术',
      value: 1000,
      type: 'L6',
    },
    {
      name: '现场技术通道-技术',
      value: 1000,
      type: 'L7',
    },
    {
      name: '现场技术通道-技术',
      value: 7000,
      type: 'L8',
    },
    {
      name: '技术通道',
      value: 1000,
      type: 'L1',
    },
    {
      name: '技术通道',
      value: 100,
      type: 'L2',
    },
    {
      name: '技术通道',
      value: 100,
      type: 'L3',
    },
    {
      name: '技术通道',
      value: 100,
      type: 'L4',
    },
    {
      name: '技术通道',
      value: 100,
      type: 'L5',
    },
    {
      name: '技术通道',
      value: 100,
      type: 'L6',
    },
    {
      name: '技术通道',
      value: 200,
      type: 'L7',
    },
    {
      name: '技术通道',
      value: 600,
      type: 'L8',
    },

    {
      name: '专业通道',
      value: 600,
      type: 'L1',
    },
    {
      name: '专业通道',
      value: 20,
      type: 'L2',
    },
    {
      name: '专业通道',
      value: 50,
      type: 'L3',
    },
    {
      name: '专业通道',
      value: 50,
      type: 'L4',
    },
    {
      name: '专业通道',
      value: 50,
      type: 'L5',
    },
    {
      name: '专业通道',
      value: 30,
      type: 'L6',
    },
    {
      name: '专业通道',
      value: 40,
      type: 'L7',
    },
    {
      name: '专业通道',
      value: 200,
      type: 'L8',
    },

    {
      name: '现场技术通道-管理',
      value: 300,
      type: 'L1',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L2',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L3',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L4',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L5',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L6',
    },
    {
      name: '现场技术通道-管理',
      value: 30,
      type: 'L7',
    },
    {
      name: '现场技术通道-管理',
      value: 100,
      type: 'L8',
    },
    {
      name: '技术管理通道',
      value: 200,
      type: 'L1',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L2',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L3',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L4',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L5',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L6',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L7',
    },
    {
      name: '技术管理通道',
      value: 30,
      type: 'L8',
    },

    {
      name: '管理通道',
      value: 50,
      type: 'L1',
    },
    {
      name: '管理通道',
      value: 10,
      type: 'L5',
    },
    {
      name: '管理通道',
      value: 30,
      type: 'L8',
    },
    {
      name: '营销通道',
      value: 30,
      type: 'L1',
    },
  ]
  const data1 = [
    {
      name: '现场技术通道-技术',
      value: 500,
      type: 'L1',
    },
    {
      name: '现场技术通道-技术',
      value: 100,
      type: 'L2',
    },
    {
      name: '现场技术通道-技术',
      value: 100,
      type: 'L3',
    },
    {
      name: '现场技术通道-技术',
      value: 100,
      type: 'L4',
    },
    {
      name: '现场技术通道-技术',
      value: 10000,
      type: 'L5',
    },
    {
      name: '现场技术通道-技术',
      value: 10000,
      type: 'L6',
    },
    {
      name: '现场技术通道-技术',
      value: 1800,
      type: 'L7',
    },
    {
      name: '现场技术通道-技术',
      value: 5000,
      type: 'L8',
    },
    {
      name: '技术通道',
      value: 3000,
      type: 'L1',
    },
    {
      name: '技术通道',
      value: 1040,
      type: 'L2',
    },
    {
      name: '技术通道',
      value: 1040,
      type: 'L3',
    },
    {
      name: '技术通道',
      value: 1000,
      type: 'L4',
    },
    {
      name: '技术通道',
      value: 100,
      type: 'L5',
    },
    {
      name: '技术通道',
      value: 100,
      type: 'L6',
    },
    {
      name: '技术通道',
      value: 200,
      type: 'L7',
    },
    {
      name: '技术通道',
      value: 600,
      type: 'L8',
    },

    {
      name: '专业通道',
      value: 600,
      type: 'L1',
    },
    {
      name: '专业通道',
      value: 20,
      type: 'L2',
    },
    {
      name: '专业通道',
      value: 50,
      type: 'L3',
    },
    {
      name: '专业通道',
      value: 50,
      type: 'L4',
    },
    {
      name: '专业通道',
      value: 50,
      type: 'L5',
    },
    {
      name: '专业通道',
      value: 30,
      type: 'L6',
    },
    {
      name: '专业通道',
      value: 40,
      type: 'L7',
    },
    {
      name: '专业通道',
      value: 200,
      type: 'L8',
    },

    {
      name: '现场技术通道-管理',
      value: 300,
      type: 'L1',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L2',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L3',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L4',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L5',
    },
    {
      name: '现场技术通道-管理',
      value: 40,
      type: 'L6',
    },
    {
      name: '现场技术通道-管理',
      value: 30,
      type: 'L7',
    },
    {
      name: '现场技术通道-管理',
      value: 100,
      type: 'L8',
    },
    {
      name: '技术管理通道',
      value: 200,
      type: 'L1',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L2',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L3',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L4',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L5',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L6',
    },
    {
      name: '技术管理通道',
      value: 10,
      type: 'L7',
    },
    {
      name: '技术管理通道',
      value: 30,
      type: 'L8',
    },

    {
      name: '管理通道',
      value: 50,
      type: 'L1',
    },
    {
      name: '管理通道',
      value: 10,
      type: 'L5',
    },
    {
      name: '管理通道',
      value: 30,
      type: 'L8',
    },
    {
      name: '营销通道',
      value: 30,
      type: 'L1',
    },
  ]
  const annotations = []
  each(groupBy(data, 'name'), (values, k) => {
    const value = values.reduce((a, b) => a + b.value, 0)
    annotations.push({
      type: 'text',
      position: [k, value],
      content: `${value}`,
      style: {
        textAlign: 'center',
        fontSize: 10,
        fill: '#09111A',
      },
      offsetX: 12,
    })
  })
  const config = {
    data:
      props.title === '一级部门' ||
      props.title === '部门3' ||
      props.title === '部门5' ||
      props.title === ''
        ? data
        : data1,
    isStack: true,
    color: [
      '#6e94f2',
      '#5fcabb',
      '#5d6c8f',
      '#e39f39',
      '#766bf5',
      '#6e94f2',
      '#a098f9',
      '#e4b36a',
    ],
    annotations,
    xField: 'value',
    height: 250,
    yField: 'name',
    seriesField: 'type',
    // tooltip: false,
    legend: false,
    // legend: {
    //   position: 'bottom',
    //   itemSpacing: -10,
    //   itemWhite: 30,
    //   flipPage: false,
    // },
    xAxis: {
      max: 20000,
      label: {
        // layout: 'center',
        formatter: (val) => {
          return val + '人'
        },
        style: {
          fontSize: 10,
          padding: -100,
        },
      },
      style: {
        fontSize: 10,
        fontWeight: 300,
        textAlign: 'left',
        textBaseline: 'middle',
        shadowColor: 'white',
        shadowBlur: 10,
      },
    },
    yAxis: {
      label: {
        offsetX: -20,
        formatter: (val) => {
          if (val.length > 5) {
            return val.substring(0, 4) + '\n' + val.substring(4)
          } else {
            return val
          }
        },
        style: {
          textAlign: 'center',
          fontSize: 10,
          padding: -100,
        },
      },
      style: {
        fontSize: 10,
        fontWeight: 300,
        textAlign: 'left',
        textBaseline: 'middle',
        shadowColor: 'white',
        shadowBlur: 10,
      },
    },
    // yAsix: {
    //   grid: {
    //     line: {
    //       style: {
    //         lineDash: [2, 2],
    //       },
    //     },
    //   },
    // },
    minColumnWidth: 16,
    maxColumnHeight: 16,
  }
  return (
    <>
      <Bar {...config} />
      <div className={styles.legendList}>
        <div>
          <span />
          L1
        </div>
        <div>
          <span style={{ background: '#5fcabb' }} />
          L2
        </div>
        <div>
          <span style={{ background: '#5d6c8f' }} />
          L3
        </div>
        <div>
          <span style={{ background: '#e39f39' }} />
          L4
        </div>
        <div>
          <span style={{ background: '#766bf5' }} />
          L5
        </div>
        <div>
          <span style={{ background: '#6e94f2' }} />
          L6
        </div>
        <div>
          <span style={{ background: '#a098f9' }} />
          L7
        </div>
        <div>
          <span style={{ background: '#e4b36a' }} />
          L8
        </div>
      </div>
    </>
  )
}
