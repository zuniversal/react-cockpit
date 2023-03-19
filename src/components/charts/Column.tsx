import { Column } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

export const DemoColumn = (props) => {
  const windowWidth = useWindowWidth()
  const data = props.data
  const config = {
    data,
    isGroup: true,
    xField: 'company',
    yField: 'capacity',
    seriesField: 'name',
    appendPadding: 8,
    tooltip: {},
    syncViewPadding: true,
    height: windowWidth * 0.75,
    legend: {
      position: 'top',
      itemSpacing: 2,
      offsetX: windowWidth * 0.022,
    },
    /** 设置颜色 */
    //color: ['#1ca9e6', '#f88c24'],

    /** 设置间距 */
    // marginRatio: 0.1,
    // label: {
    //   // 可手动配置 label 数据标签位置
    //   position: 'middle',
    //   // 'top', 'middle', 'bottom'
    //   // 可配置附加的布局方法
    //   layout: [
    //     // 柱形图数据标签位置自动调整
    //     {
    //       type: 'interval-adjust-position',
    //     }, // 数据标签防遮挡
    //     {
    //       type: 'interval-hide-overlap',
    //     }, // 数据标签文颜色自动调整
    //     {
    //       type: 'adjust-color',
    //     },
    //   ],
    // },
  }
  return <Column {...config} />
}
