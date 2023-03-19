import { useWindowWidth } from '@react-hook/window-size'
import { PieChart } from 'echarts/charts'
import { ToolboxComponent, LegendComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect } from 'react'
export const TabPie2 = (props) => {
  const windowWidth = useWindowWidth() - 44
  const data1 = [
    {
      name: '大学专科',
      value: 10032,
    },
    {
      name: '大学本科',
      value: 5329,
    },
    {
      name: '中等专科',
      value: 499,
    },
    {
      name: '高中',
      value: 7392,
    },
    {
      name: '初中',
      value: 1454,
    },
    {
      name: '中专/职业高中/技校',
      value: 967,
    },
    {
      name: '职业高中',
      value: 499,
    },
    {
      name: '博士',
      value: 47,
    },
  ]
  const data2 = [
    {
      name: '大学专科',
      value: 1032,
    },
    {
      name: '大学本科',
      value: 3290,
    },
    {
      name: '中等专科',
      value: 4992,
    },
    {
      name: '高中',
      value: 3392,
    },
    {
      name: '初中',
      value: 2454,
    },
    {
      name: '中专/职业高中/技校',
      value: 1967,
    },
    {
      name: '职业高中',
      value: 2499,
    },
    {
      name: '博士',
      value: 3447,
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
      echarts.init(document.getElementById('main1')).dispose()
    }
    const myChart = echarts.init(document.getElementById('main1'))
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
        id="main1"
        style={{
          height: '250px',
          width: windowWidth,
        }}
      />
    </>
  )
}
