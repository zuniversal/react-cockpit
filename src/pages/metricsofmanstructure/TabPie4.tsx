import { Bar } from '@ant-design/plots'
import { each, groupBy } from '@antv/util'
import React, { useState, useEffect } from 'react'

import styles from './CardMode.module.less'
export const TabPie4 = (props) => {
  const data = [
    {
      year: '18-25岁',
      value: 11000,
      type: '男',
    },
    {
      year: '18-25岁',
      value: 3826,
      type: '女',
    },
    {
      year: '26-30岁',
      value: 6000,
      type: '男',
    },
    {
      year: '26-30岁',
      value: 2315,
      type: '女',
    },
    {
      year: '31-40岁',
      value: 6000,
      type: '男',
    },
    {
      year: '31-40岁',
      value: 2488,
      type: '女',
    },
    {
      year: '41-50岁',
      value: 280,
      type: '男',
    },
    {
      year: '41-50岁',
      value: 28,
      type: '女',
    },
    {
      year: '50岁以上',
      value: 12,
      type: '男',
    },
  ]
  const data1 = [
    {
      year: '18-25岁',
      value: 1100,
      type: '男',
    },
    {
      year: '18-25岁',
      value: 38260,
      type: '女',
    },
    {
      year: '26-30岁',
      value: 600,
      type: '男',
    },
    {
      year: '26-30岁',
      value: 23150,
      type: '女',
    },
    {
      year: '31-40岁',
      value: 600,
      type: '男',
    },
    {
      year: '31-40岁',
      value: 24880,
      type: '女',
    },
    {
      year: '41-50岁',
      value: 2800,
      type: '男',
    },
    {
      year: '41-50岁',
      value: 2800,
      type: '女',
    },
    {
      year: '50岁以上',
      value: 120,
      type: '男',
    },
  ]
  const annotations = []
  each(groupBy(data, 'year'), (values, k) => {
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
    annotations,
    appendPadding: [0, 10, 0, 0],
    xField: 'value',
    height: 250,
    yField: 'year',
    seriesField: 'type',
    tooltip: false,
    // legend: {
    //   position: 'bottom',
    //   itemSpacing: -10,
    //   itemWhite: 30,
    //   flipPage: false,
    // },
    xAxis: {
      max: 20000,
      // nice: true,
      tickCount: 6,
      // tickInterval: 10000,

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
    yAsix: {
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
          },
        },
      },
    },
    minColumnWidth: 16,
    maxColumnHeight: 16,
  }
  return (
    <>
      <Bar {...config} />
      <div className={styles.legendList} style={{ padding: '2px 38%' }}>
        <div>
          <span />男
        </div>
        <div>
          <span style={{ background: '#5fcabb' }} />女
        </div>
      </div>
    </>
  )
}
// import { useEffect } from 'react'
// import * as echarts from 'echarts/core'
// import {
//   TooltipComponent,
//   GridComponent,
//   LegendComponent,
// } from 'echarts/components'
// import { BarChart } from 'echarts/charts'
// import { CanvasRenderer } from 'echarts/renderers'
// export function TabPie4() {
//   useEffect(() => {
//     echarts.use([
//       TooltipComponent,
//       GridComponent,
//       LegendComponent,
//       BarChart,
//       CanvasRenderer,
//     ])
//     var myChart = echarts.init(document.getElementById('main4'))
//     myChart.setOption({
//       grid: {
//         left: '0%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true,
//       },
//       xAxis: {
//         type: 'value',
//       },
//       yAxis: {
//         fontSize: 10,
//         type: 'category',
//         data: [
//           '18-25岁',
//           '26-30岁',
//           '31-40岁',
//           '41-50岁',
//           '50岁以上',
//         ].reverse(),
//         lineStyle: {
//           type: 'dashed',
//         },
//       },
//       series: [
//         {
//           name: '男',
//           type: 'bar',
//           stack: 'total',
//           emphasis: {
//             focus: 'series',
//           },
//           data: [11000, 6000, 6000, 280, 12].reverse(),
//         },
//         {
//           name: '女',
//           type: 'bar',
//           stack: 'total',
//           emphasis: {
//             focus: 'series',
//           },
//           data: [3826, 2315, 2488, 288, 0].reverse(),
//         },
//       ],
//     })
//   })
//   return (
//     <>
//       <div
//         id="main4"
//         style={{
//           height: '250px',
//           width: '100%',
//         }}
//       />
//     </>
//   )
// }
