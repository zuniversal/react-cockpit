import { useWindowWidth } from '@react-hook/window-size'
import { PieChart } from 'echarts/charts'
import { ToolboxComponent, LegendComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useState } from 'react'
export const TabPie1 = (props) => {
  const windowWidth = useWindowWidth() - 44
  const data1 = [
    {
      name: '江苏公司',
      value: 10494,
    },
    {
      name: '厦门公司',
      value: 5816,
    },
    {
      name: '成都公司',
      value: 4962,
    },
    {
      name: '武汉公司',
      value: 3356,
    },
    {
      name: '合肥公司',
      value: 4962,
    },
    {
      name: '中创新航',
      value: 1492,
    },
    {
      name: '江苏研究院',
      value: 1053,
    },
    {
      name: '江门公司',
      value: 1111,
    },
  ]
  const data2 = [
    {
      name: '江苏公司',
      value: 1094,
    },
    {
      name: '厦门公司',
      value: 6816,
    },
    {
      name: '成都公司',
      value: 4262,
    },
    {
      name: '武汉公司',
      value: 4356,
    },
    {
      name: '合肥公司',
      value: 2962,
    },
    {
      name: '中创新航',
      value: 3492,
    },
    {
      name: '江苏研究院',
      value: 2053,
    },
    {
      name: '江门公司',
      value: 2311,
    },
  ]
  useEffect(() => {
    let data
    echarts.use([
      ToolboxComponent,
      LegendComponent,
      PieChart,
      CanvasRenderer,
      LabelLayout,
    ])
    if (
      props.title === '一级部门' ||
      props.title === '部门3' ||
      props.title === '部门5' ||
      props.title === ''
    ) {
      data = data1
    } else {
      data = data2
    }
    if (echarts !== null) {
      echarts.init(document.getElementById('main')).dispose()
    }
    const myChart = echarts.init(document.getElementById('main'))

    myChart.setOption({
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [20, 70],
          center: ['50%', '50%'],
          roseType: 'area',
          color: [
            '#6E94F2',
            '#5FCABB',
            '#707E9D',
            '#5D6C8F',
            '#766BF5',
            '#A098F9',
            '#E39F39',
            '#EEC78D',
          ],
          itemStyle: {
            borderRadius: 1,
          },
          labelLine: {
            length: 5,
            length2: 5,
          },
          label: {
            formatter: '{name|{b}}\n{time|{c} 人}',
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999',
              },
            },
          },
          data,
        },
      ],
    })
  })

  return (
    <>
      <div
        id="main"
        style={{
          height: '250px',
          width: windowWidth,
        }}
      />
    </>
  )
}
