import { Pie } from '@ant-design/plots'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { removeNegativeData } from '../../utils'

export const DemoPie = (props) => {
  const { navigateToDetail } = useCurrentApp()
  //获取当前可视区域的高度
  // console.log(document.body.clientWidth)
  // 设置图表容器高度
  const height = 0.6 * document.body.clientWidth
  const data = props.data
  //往饼图中心文字传参示例
  const customHtmlData = props.customHtmlData || { content: [], title: {} }
  const customHtmlDataItems = customHtmlData.content.map((item, index) => {
    return (
      <div
        key={index}
        style={{
          fontSize: 10,
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          height: 20,
        }}
      >
        {item.type}&nbsp;{item.value}
      </div>
    )
  })

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    color: [
      '#6E94F2',
      '#5FCABB',
      '#707E9D',
      '#5D6C8F',
      '#766BF5',
      '#A098F9',
      '#E39F39',
      '#E4B36A',
      '#EEC78D',
      '#D0DCFA',
    ],
    padding: 'auto',
    appendPadding: [20, 0, 20, 0],
    radius: 1,
    innerRadius: 0.7,
    label: {
      type: 'spider',
      labelHeight: 12,
      style: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: 'DIN',
        fontWeight: 400,
      },
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
    },
    legend: false,
    autoFit: true,
    height,
    tooltip: {
      formatter: (datum) => {
        // 获取点击图例的相关内容
        const Item = data.filter((item, index) => {
          if (item.type == datum.type) {
            return item
          }
        })
        return {
          title: Item[0].type,
          name: '库存量',
          salesValue: Item[0].value + '(Gwh)',
        }
      },
      containerTpl: `
          <div class="g2-tooltip">
            <!-- 列表容器，会自己填充 -->
            <ul class="g2-tooltip-list"></ul>
          </div>
        `,
      itemTpl: `
          <ul class="g2-tooltip-list">
            <li class="g2-tooltip-list-item">
              <span class="g2-tooltip-marker" style="background-color: {color}"></span>
              <span class="g2-tooltip-name">{title}</span>
            </li>
            <li class="g2-tooltip-list-item">
              <span class="g2-tooltip-marker""></span>
              <span class="g2-tooltip-name">{name}:</span>
              <span class="g2-tooltip-value">{salesValue}</span>
            </li>
        </ul>
        `,
      domStyles: {
        'g2-tooltip-name': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 10,
        },
        'g2-tooltip-value': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 10,
        },
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
    ],
    statistic: {
      title: false,
      content: {
        //往饼图中心文字传参示例
        customHtml: (container, view, datum, data) => {
          return (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'PingFang SC',
                  fontWeight: 500,
                  height: 20,
                  color: '#58575F',
                }}
              >
                {customHtmlData.title.type}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontFamily: 'DIN Alternate',
                  fontWeight: 700,
                  height: 20,
                  color: '#000000',
                  marginBottom: 5,
                }}
              >
                {customHtmlData.title.value}
              </div>
              {customHtmlDataItems}
            </div>
          )
        },
      },
    },
  }
  return <Pie {...config} data={removeNegativeData(config)} />
}
