import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

const graph = {
  categories: [
    {
      name: '原材料',
    },
    {
      name: '单体',
    },
    {
      name: '集成',
    },
  ],
  nodes: [
    {
      id: '0',
      name: '原材料',
      symbolSize: 50,
      x: 170,
      y: 273,
      category: 0,
      hasData: true,
    },
    {
      id: '1',
      name: '单体',
      symbolSize: 36,
      x: 129,
      y: 233,
      category: 1,
      hasData: true,
    },
    {
      id: '2',
      name: '集成',
      symbolSize: 36,
      x: 219,
      y: 303,
      category: 2,
      hasData: true,
    },
    {
      id: '3',
      name: '磷酸铁锂',
      symbolSize: 18,
      x: 49,
      y: 171,
      category: 1,
    },
    {
      id: '4',
      name: '铝箔',
      symbolSize: 18,
      x: 49,
      y: 227,
      category: 1,
    },
    {
      id: '5',
      name: '壳体',
      symbolSize: 18,
      x: 95,
      y: 204,
      category: 1,
    },
    {
      id: '6',
      name: '隔膜',
      symbolSize: 18,
      x: 148,
      y: 188,
      category: 1,
    },
    {
      id: '7',
      name: '盖板组件',
      symbolSize: 18,
      x: 210,
      y: 177,
      category: 1,
    },
    {
      id: '8',
      name: '电解液',
      symbolSize: 18,
      x: 204,
      y: 214,
      category: 1,
    },
    {
      id: '9',
      name: '镍钴',
      symbolSize: 18,
      x: 67,
      y: 264,
      category: 1,
    },
    {
      id: '10',
      name: '导电浆体',
      symbolSize: 18,
      x: 264,
      y: 228,
      category: 1,
    },
    {
      id: '11',
      name: '石墨',
      symbolSize: 18,
      x: 49,
      y: 303,
      category: 1,
    },
    {
      id: '12',
      name: '铜箔',
      symbolSize: 18,
      x: 103,
      y: 315,
      category: 1,
    },
    {
      id: '13',
      name: '粘结剂',
      symbolSize: 18,
      x: 47,
      y: 368,
      category: 1,
    },
    {
      id: '14',
      name: '箱体',
      symbolSize: 18,
      category: 2,

      x: 231,
      y: 371,
    },
    {
      id: '15',
      name: '箱盖',
      symbolSize: 18,
      category: 2,

      x: 297,
      y: 348,
    },
    {
      id: '16',
      name: '防爆阀',
      symbolSize: 18,

      x: 306,
      y: 285,
      category: 2,
    },
    {
      id: '17',
      name: '导电排',
      symbolSize: 18,

      x: 264,
      y: 267,
      category: 2,
    },
    {
      id: '18',
      name: '扎带',
      symbolSize: 18,
      x: 266,
      y: 395,
      category: 2,
    },
    {
      id: '19',
      name: '密封垫',
      symbolSize: 18,
      x: 291,
      y: 449,
      category: 2,
    },
    {
      id: '20',
      name: '标准件',
      symbolSize: 18,
      x: 230,
      y: 478,
      category: 2,
    },
    {
      id: '21',
      name: '液冷管',
      symbolSize: 18,
      x: 210,
      y: 429,
      category: 2,
    },
    {
      id: '22',
      name: '模切见',
      symbolSize: 18,
      x: 177,
      y: 402,
      category: 2,
    },
    {
      id: '23',
      name: '电器件',
      symbolSize: 18,
      x: 129,
      y: 385,
      category: 2,
    },
    {
      id: '24',
      name: '注塑件',
      symbolSize: 18,
      x: 158,
      y: 346,
      category: 2,
    },
  ],
  links: [
    {
      source: '0',
      target: '1',
    },
    {
      source: '0',
      target: '2',
    },
    {
      source: '1',
      target: '3',
    },
    {
      source: '1',
      target: '4',
    },
    {
      source: '1',
      target: '5',
    },
    {
      source: '1',
      target: '6',
    },
    {
      source: '1',
      target: '7',
    },
    {
      source: '1',
      target: '8',
    },
    {
      source: '1',
      target: '9',
    },
    {
      source: '1',
      target: '10',
    },
    {
      source: '1',
      target: '11',
    },
    {
      source: '1',
      target: '12',
    },
    {
      source: '1',
      target: '13',
    },
    {
      source: '2',
      target: '14',
    },
    {
      source: '2',
      target: '15',
    },
    {
      source: '2',
      target: '16',
    },
    {
      source: '2',
      target: '17',
    },
    {
      source: '2',
      target: '18',
    },
    {
      source: '2',
      target: '19',
    },
    {
      source: '2',
      target: '20',
    },
    {
      source: '2',
      target: '21',
    },
    {
      source: '2',
      target: '22',
    },
    {
      source: '2',
      target: '23',
    },
    {
      source: '2',
      target: '24',
    },
  ],
}

export function KeyRawMeterial(props) {
  const { expanded, data } = props
  const windowWidth = useWindowWidth()
  const chartRef = useRef()

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.setOption({
        color: ['#6E94F2', '#5FCABB', '#707E9D'],
        // legend: [
        //   {
        //     data: graph.categories.map(function (a) {
        //       return a.name
        //     }),
        //   },
        // ],
        series: [
          {
            type: 'graph',
            layout: 'none',
            data: graph.nodes
              .map((item) => {
                let symbolSize = item.symbolSize
                if (!expanded) {
                  symbolSize = [20, 12, 12][item.category]
                  if (item.symbolSize === 36) {
                    symbolSize = 16
                  }
                }
                let name = item.name
                const target = data.find(
                  (item2) => name === item2.criticalMaterial
                )
                const hasData = !!target
                if (target) {
                  if (target.labst && target.meins) {
                    name += '\n'
                    name += target.labst
                    name += target.meins
                  }
                }
                return {
                  hasData,
                  ...item,
                  name,
                  symbolSize,
                }
              })
              .filter((item) => item.hasData),
            links: graph.links,
            categories: graph.categories,
            // roam: 'scale',
            roam: false,
            left: expanded ? 40 : 'center',
            label: {
              show: true,
              position: 'bottom',
              fontSize: expanded ? 12 : 8,
              formatter: '{b}',
            },
            labelLayout: {
              hideOverlap: false,
              // moveOverlap: 'shiftY',
            },
            zoom: expanded ? 1 : 1.4,
            scaleLimit: expanded
              ? {
                  min: 0.8,
                  max: 1.8,
                }
              : { min: 0.8, max: 1.8 },
            lineStyle: {
              color: 'source',
              curveness: 0.4,
              width: 1.5,
            },
          },
        ],
      })
    }
  }, [expanded, data])

  return (
    <div
      ref={chartRef}
      key={expanded}
      // 这里的高度和其他图表保持一致
      style={{ width: windowWidth - 44, height: expanded ? 440 : 160 }}
    />
  )
}
