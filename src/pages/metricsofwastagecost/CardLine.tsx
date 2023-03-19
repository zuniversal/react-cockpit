import { Line } from '@ant-design/plots'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'

export const MarketLine = (props) => {
  const { user } = useCurrentApp()
  const height = 0.55 * document.body.clientWidth
  // 接收数据
  const lineData = props.lineData
  const color = props.colorConfig // 颜色配置

  const config = {
    data: lineData,
    seriesField: 'category',
    xField: 'date',
    yField: 'value',
    smooth: true,
    height,
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
      grid: {
        line: {
          style: {
            lineDash: [3, 3],
          },
        },
      },
    },
    xAxis: {
      label: {
        // 只显示两位日期
        formatter: (v) => {
          return v.slice(-2)
        },
      },
      tickLine: {
        style: {
          lineDash: [3, 3],
        },
      },
    },
    color,
    tooltip: {},
    legend: false,
    lineStyle: (item) => {
      // if (CardName == '') {
      //   return {
      //     opacity: 1,
      //   }
      // } else {
      //   if (item.category == CardName) {
      //     return {
      //       opacity: 1,
      //     }
      //   } else {
      //     return {
      //       opacity: 0.3,
      //     }
      //   }
      // }
      return {
        opacity: 1,
      }
    },
    autoFit: true,
    point: {
      shape: 'circle',
    },
  }
  // @ts-ignore
  return (
    <div style={{ position: 'relative', zIndex: 103 }}>
      <Line {...config} />
    </div>
  )
}
