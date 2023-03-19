import { Column } from '@ant-design/plots'
import { each, groupBy } from '@antv/util'
export const TabPie7 = (props) => {
  const data = [
    {
      name: 'L1',
      num: 4000,
      type: '3级',
    },
    {
      name: 'L1',
      num: 4000,
      type: '2级',
    },
    {
      name: 'L1',
      num: 4000,
      type: '1级',
    },
    {
      name: 'L2',
      num: 30,
      type: '6级',
    },
    {
      name: 'L2',
      num: 50,
      type: '5级',
    },

    {
      name: 'L2',
      num: 1529,
      type: '4级',
    },
    {
      name: 'L3',
      num: 432,
      type: '9级',
    },
    {
      name: 'L3',
      num: 321,
      type: '8级',
    },
    {
      name: 'L3',
      num: 1929,
      type: '7级',
    },

    {
      name: 'L4',
      num: 213,
      type: '12级',
    },
    {
      name: 'L4',
      num: 221,
      type: '11级',
    },
    {
      name: 'L4',
      num: 19529,
      type: '10级',
    },
    {
      name: 'L5',
      num: 54,
      type: '15级',
    },
    {
      name: 'L5',
      num: 312,
      type: '14级',
    },
    {
      name: 'L5',
      num: 9529,
      type: '13级',
    },

    {
      name: 'L6',
      num: 2,
      type: '17级',
    },
    {
      name: 'L6',
      num: 18,
      type: '16级',
    },
    {
      name: 'L7',
      num: 2,
      type: '21级',
    },
    {
      name: 'L7',
      num: 3,
      type: '20级',
    },
    {
      name: 'L7',
      num: 5,
      type: '19级',
    },

    {
      name: 'L8',
      num: 1,
      type: '23级',
    },
  ]
  const data1 = [
    {
      name: 'L1',
      num: 2000,
      type: '3级',
    },
    {
      name: 'L1',
      num: 4500,
      type: '2级',
    },
    {
      name: 'L1',
      num: 4300,
      type: '1级',
    },
    {
      name: 'L2',
      num: 300,
      type: '6级',
    },
    {
      name: 'L2',
      num: 50,
      type: '5级',
    },

    {
      name: 'L2',
      num: 1529,
      type: '4级',
    },
    {
      name: 'L3',
      num: 432,
      type: '9级',
    },
    {
      name: 'L3',
      num: 3210,
      type: '8级',
    },
    {
      name: 'L3',
      num: 1929,
      type: '7级',
    },

    {
      name: 'L4',
      num: 2132,
      type: '12级',
    },
    {
      name: 'L4',
      num: 221,
      type: '11级',
    },
    {
      name: 'L4',
      num: 19529,
      type: '10级',
    },
    {
      name: 'L5',
      num: 540,
      type: '15级',
    },
    {
      name: 'L5',
      num: 312,
      type: '14级',
    },
    {
      name: 'L5',
      num: 9529,
      type: '13级',
    },

    {
      name: 'L6',
      num: 2,
      type: '17级',
    },
    {
      name: 'L6',
      num: 180,
      type: '16级',
    },
    {
      name: 'L7',
      num: 20,
      type: '21级',
    },
    {
      name: 'L7',
      num: 30,
      type: '20级',
    },
    {
      name: 'L7',
      num: 50,
      type: '19级',
    },

    {
      name: 'L8',
      num: 1,
      type: '23级',
    },
  ]
  const annotations = []
  each(groupBy(data, 'name'), (values, k) => {
    const value = values.reduce((a, b) => a + b.num, 0)
    annotations.push({
      type: 'text',
      position: [k, value],
      content: `${value}`,
      style: {
        textAlign: 'center',
        fontSize: 10,
        fill: '#09111A',
      },
      offsetY: -10,
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
    xField: 'name',
    yField: 'num',
    height: 250,
    padding: [40, 20, 40, 45],
    seriesField: 'type',
    color: [
      '#707E9D',
      '#5FCABB',
      '#5183FD',
      '#707E9D',
      '#5FCABB',
      '#5183FD',
      '#707E9D',
      '#5FCABB',
      '#5183FD',
      '#707E9D',
      '#5FCABB',
      '#5183FD',
      '#707E9D',
      '#5FCABB',
      '#5183FD',
      '#5FCABB',
      '#5183FD',
      '#707E9D',
      '#5FCABB',
      '#5183FD',
      '#5183FD',
    ],
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      max: 30000,
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
          },
        },
      },
    },
    legend: false,
    annotations,
  }
  return (
    <div style={{ position: 'relative' }}>
      <p
        style={{
          position: 'absolute',
          fontSize: '10px',
          color: '#8C8C8C',
        }}
      >
        (人数)
      </p>
      <Column {...config} />
    </div>
  )
}
// import React, { useEffect } from 'react'
// import * as echarts from 'echarts/core'
// import {
//   TooltipComponent,
//   GridComponent,
//   LegendComponent,
// } from 'echarts/components'
// import { BarChart } from 'echarts/charts'
// import { CanvasRenderer } from 'echarts/renderers'
// export function TabPie7() {
//   useEffect(() => {
//     echarts.use([
//       TooltipComponent,
//       GridComponent,
//       LegendComponent,
//       BarChart,
//       CanvasRenderer,
//     ])
//     var myChart = echarts.init(document.getElementById('main7'))
//     myChart.setOption({
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           // Use axis to trigger tooltip
//           type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
//         },
//       },
//       grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true,
//       },
//       yAxis: {
//         type: 'value',
//       },
//       xAxis: {
//         type: 'category',
//         data: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
//       },
//       series: [
//         {
//           name: '1级',
//           type: 'bar',
//           stack: 'total',

//           emphasis: {
//             focus: 'series',
//           },
//           color: ['#5183FD'],
//           data: [9592, 3000, 1500, 92, 592, 18, 4, 0],
//         },
//         {
//           name: '2级',
//           type: 'bar',
//           stack: 'total',

//           emphasis: {
//             focus: 'series',
//           },
//           color: ['#5FCABB'],
//           data: [2097, 2097, 2097, 2097, 2097, 2, 1, 1],
//         },
//         {
//           name: '3级',
//           type: 'bar',
//           stack: 'total',

//           emphasis: {
//             focus: 'series',
//           },
//           color: ['#707E9D'],
//           data: [972, 972, 972, 972, 972, 0, 1, 0],
//         },
//       ],
//     })
//   })
//   return (
//     <>
//       <div
//         id="main7"
//         style={{
//           height: '250px',
//           width: '100%',
//         }}
//       />
//     </>
//   )
// }
