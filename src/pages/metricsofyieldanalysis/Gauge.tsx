import { Gauge, G2 } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { tofixed } from '../../utils'
import styles from './Gauge.module.less'
export const AnalysisGauge = (props) => {
  const { registerShape, Util } = G2 // 自定义 Shape 部分
  const windowWidth = useWindowWidth()

  registerShape('point', 'custom-gauge-indicator2', {
    draw(cfg, container) {
      // 使用 customInfo 传递参数
      const { indicator, defaultColor } = cfg.customInfo
      const { pointer, pin } = indicator
      const group = container.addGroup() // 获取极坐标系下画布中心点
      const center = this.parsePoint({
        x: 0,
        y: 0,
      }) // 绘制指针

      if (pointer) {
        const { startAngle, endAngle } = Util.getAngle(cfg, this.coordinate)
        const radius = this.coordinate.getRadius()
        const midAngle = (startAngle + endAngle) / 2
        const { x: x1, y: y1 } = Util.polarToCartesian(
          center.x,
          center.y,
          radius / 15,
          midAngle + 1 / Math.PI
        )
        const { x: x2, y: y2 } = Util.polarToCartesian(
          center.x,
          center.y,
          radius / 15,
          midAngle - 1 / Math.PI
        )
        const { x, y } = Util.polarToCartesian(
          center.x,
          center.y,
          radius * 0.65,
          midAngle
        )
        const { x: x0, y: y0 } = Util.polarToCartesian(
          center.x,
          center.y,
          radius * 0.1,
          midAngle + Math.PI
        )
        const path = [
          ['M', x0, y0],
          ['L', x1, y1],
          ['L', x, y],
          ['L', x2, y2],
          ['Z'],
        ] // pointer

        group.addShape('path', {
          name: 'pointer',
          attrs: {
            path,
            fill: defaultColor,
            ...pointer.style,
          },
        })
      }

      if (pin) {
        const pinStyle = pin.style || {}
        const {
          lineWidth = 2,
          fill = defaultColor,
          stroke = defaultColor,
        } = pinStyle
        const r = 6
        group.addShape('circle', {
          name: 'pin-outer',
          attrs: {
            x: center.x,
            y: center.y,
            ...pin.style,
            fill: 'transparent',
            r,
            lineWidth,
            stroke,
          },
        })
        group.addShape('circle', {
          name: 'pin-inner',
          attrs: {
            x: center.x,
            y: center.y,
            r: r * 0.7,
            stroke: 'transparent',
            fill,
          },
        })
      }

      return group
    },
  })
  const height = 0.3 * document.body.clientWidth
  const { contentValue, contentText } = props
  const config = {
    percent: contentValue,
    width: windowWidth * 0.4,
    height,
    range: {
      color: 'l(0) 0:#AABDEC 1:#6E94F2',
    },
    axis: {
      label: {
        offset: -18,
        style: {
          fontSize: 12,
        },
        formatter(v) {
          return Number(v) * 100
        },
      },
      tickLine: {
        style: {
          stroke: '#000',
          opacity: 0.6,
          lineWidth: 2,
        },
        length: -8,
      },
      subTickLine: {
        style: {
          stroke: '#D0D0D0',
        },
        count: 8,
        length: -6,
      },
    },
    indicator: {
      shape: 'custom-gauge-indicator2',
      pointer: {
        style: {
          stroke: '#678EF2',
          lineWidth: 1,
          fill: '#678EF2',
        },
      },
      pin: {
        style: {
          lineWidth: 0,
          stroke: '#000000',
          fill: '#000000',
        },
      },
    },
    statistic: {
      title: {
        offsetY: 16,
        formatter: ({ percent }) => {
          return tofixed(percent * 100, 2) + '%'
        },
        style: ({ percent }) => {
          return {
            fontSize: '14px',
            lineHeight: 1,
            fontFamily: 'DIN',
            fontWeight: 400,
            color: '#000000',
            fontStyle: 'normal',
          }
        },
      },
      content: {
        offsetY: 36,
        style: {
          fontSize: '11px',
          color: '#8C8FA0',
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontStyle: 'normal',
        },
        formatter: () => contentText,
      },
    },
  }
  return (
    <div className={styles.GaugeBox}>
      <Gauge {...config} />
    </div>
  )
}
