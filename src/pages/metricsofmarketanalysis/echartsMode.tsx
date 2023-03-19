import { useWindowWidth } from '@react-hook/window-size'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useState, useEffect, useMemo } from 'react'

import decline from '../../assets/icons/decline.svg'
import rise from '../../assets/icons/rise.svg'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { accMul, debounce } from '../../utils/index'
export function EchartsMode(props) {
  const { navigateToDetail, user } = useCurrentApp()
  const [main, setMain] = useState('')
  const data = props.data
  const windowWidth = useWindowWidth()

  const title = []
  const marketShareData = []
  const permeabilityData = []
  const tooltip = {}

  // console.log(data)
  data &&
    data.map((item) => {
      title.push(item.groupCustomer)
      marketShareData.push(accMul(item.marketShare, 100))
      permeabilityData.push(accMul(item.permeability, 100))
      tooltip[item.groupCustomer] = item
    })

  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkAreaComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
  ])

  const color = ['#678EF2', '#5FCABB']

  const option = {
    grid: {
      right: 40,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter(params) {
        let str = `<div style="margin: 0px 0 0;line-height:18px;">
                      <div style="margin: 0px 0 0;line-height:18px;">
                        <div style="font-size:13px;color:#616161;font-weight:400;line-height:1;">${params[0].name}</div>
                        <div style="margin: 6px 0 0;line-height:1;">`

        for (let i = 0, l = params.length; i < l; i++) {
          const value1 = Number(tooltip[params[0].name].marketShareChain)
          const value2 = Number(tooltip[params[0].name].permeabilityChain)
          let color1 = ''
          if (value1 > 0) {
            color1 = '#F1965C'
          } else if (value1 === 0) {
            color1 = '#616161'
          } else {
            color1 = '#5FCABB'
          }
          let color2 = ''
          if (value2 > 0) {
            color2 = '#F1965C'
          } else if (value2 === 0) {
            color2 = '#616161'
          } else {
            color2 = '#5FCABB'
          }
          str += `<div style="margin: 0px 0 0;line-height:18px;">
                    <div style="margin: 0px 0 0;line-height:18px;">
                      <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color[i]};"></span>
                      <span style="font-size:13px;color:#616161;font-weight:400;margin-left:2px">${params[i].seriesName}</span>
                      <span style="float:right;margin-left:20px;font-size:13px;color:#616161;">${params[i].value}%</span>
                      <div style="clear:both"></div>
                    </div>`
          if (params[i].seriesName === '市占率') {
            str += `<div style="margin: 0px 0 0;line-height:18px;">
              <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span>
              <span style="font-size:13px;color:#616161;font-weight:400;margin-left:2px">市占率环比</span>
              <span style="float:right;margin-left:20px;font-size:14px;color:#666;">
                <span style="color: ${color1}">
                  ${value1 > 0 ? '+' : ''}
                  ${accMul(value1, 100)}%
                </span>
                ${value1 > 0 ? `<img style="width: 12px" src="${rise}" />` : ''}
                ${
                  value1 < 0
                    ? `<img style="width: 12px" src="${decline}" />`
                    : ''
                }
              </span>
              <div style="clear:both"></div>
            </div>`
          } else {
            str += `<div style="margin: 0px 0 0;line-height:1;">
              <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span>
              <span style="font-size:13px;color:#616161;font-weight:400;margin-left:2px">渗透率环比</span>
              <span style="float:right;margin-left:20px;font-size:14px;color:#666;">
              <span style="color: ${color2}">
                  ${value2 > 0 ? '+' : ''}
                  ${accMul(value2, 100)}%
                </span>
                ${value2 > 0 ? `<img style="width: 12px" src="${rise}" />` : ''}
                ${
                  value2 < 0
                    ? `<img style="width: 12px" src="${decline}" />`
                    : ''
                }
              </span>
              <div style="clear:both"></div>
            </div>`
          }
          str += `<div style="clear:both"></div></div>`
        }
        str += `<div style="clear:both"></div>
                        </div>
                        <div style="clear:both"></div>
                      </div>
                      <div style="clear:both"></div>
                    </div>`
        return str
      },
    },
    legend: {
      data: ['市占率', 'CALB渗透率'],
      bottom: 16,
      textStyle: {
        color: '#595959',
        fontSize: '10px',
      },
      icon: 'roundRect',
      itemHeight: 2,
      itemWidth: 8,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#8C8C8C',
            fontSize: '11px',
            fontFamily: 'PingFang SC',
            lineHeight: '18px',
          },
        },
        data: title,
        axisLabel: {
          interval: 0,
          formatter(val: string) {
            if (val.length > 4) {
              const idx = val.length / 4
              const idxInt = Math.trunc(val.length / 4)
              let str = ''
              for (let i = 0; i < idxInt; i++) {
                if (i === 0) {
                  str += val.slice(0, 4) + '\n'
                } else {
                  str += val.slice(i * 4, i * 4 + 4) + '\n'
                }
              }
              if (idx !== idxInt) {
                str += val.slice(idxInt * 4)
              }
              return str
            }
            return val
          },
        },
      },
    ],
    yAxis: [
      {
        name: '(市占率)',
        type: 'value',
        // max: 36,
        // min: 0,
        // interval: 9,
        nameTextStyle: {
          color: '#8C8C8C',
          fontSize: '11px',
          fontFamily: 'PingFang SC',
        },
        axisLabel: {
          show: true,
          interval: 0, // 使x轴文字显示全
          color: '#8C8C8C',
          fontSize: '10px',
          formatter: '{value}%', //y轴数值，带百分号
        },
        splitLine: {
          lineStyle: {
            type: 'dashed', //虚线
          },
          show: true, //隐藏
        },
      },
      {
        name: '(渗透率)',
        nameLocation: 'start',
        // max: 100,
        // min: 0,
        nameTextStyle: {
          color: '#8C8C8C',
          fontSize: '11px',
          fontFamily: 'PingFang SC',
        },
        alignTicks: true,
        type: 'value',
        inverse: true,
        axisLabel: {
          show: true,
          interval: 0, // 使x轴文字显示全
          color: '#8C8C8C',
          fontSize: '10px',
          formatter: '{value}%', //y轴数值，带百分号
        },
        splitLine: {
          lineStyle: {
            type: 'dashed', //虚线
          },
          show: true, //隐藏
        },
      },
    ],
    series: [
      {
        name: '市占率',
        type: 'line',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(81, 131, 253, 1)' },
            { offset: 1, color: 'rgba(81, 131, 253, 0.2)' },
          ]),
        },
        lineStyle: {
          width: 1.5,
          color: '#5183FD',
        },
        color: '#5183FD',
        data: marketShareData,
        smooth: true,
      },
      {
        name: 'CALB渗透率',
        type: 'line',
        yAxisIndex: 1,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(112, 204, 190, 0.2)' },
            { offset: 1, color: 'rgba(112, 204, 190, 1)' },
          ]),
        },
        lineStyle: {
          width: 1.5,
          color: '#5FCABB',
        },
        color: '#5FCABB',
        data: permeabilityData,
        smooth: true,
      },
    ],
  }

  useEffect(() => {
    const node = document.getElementById('main')
    setMain(node)
  }, [main])

  if (main !== '') {
    const myChart = echarts.init(main)
    myChart.setOption(option)
    // myChart.off('click')
    myChart.getZr().on('click', (params) => {
      //这里echarts有个奇怪的bug 点击一次触发两次，先这样解决，后续再找原因
      debounce(() => {
        clickEvent(params)
      }, 80)
    })
    let clickPage: string = ''
    const clickEvent = (params): void => {
      const pointInPixel = [params.offsetX, params.offsetY]
      if (myChart.containPixel('grid', pointInPixel)) {
        const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [
          params.offsetX,
          params.offsetY,
        ])[0]
        /*事件处理代码书写位置*/
        clickPage === title[xIndex]
          ? navigateToDetail({
              applicationArea: title[xIndex],
              type: 1,
              segmentKey: props.segmentKey,
            })
          : (clickPage = title[xIndex])
      }
    }
  }

  return (
    <>
      <div
        id="main"
        style={{
          height: '300px',
          width: windowWidth - 44,
          position: 'relative',
          zIndex: '103',
          top: '-20px',
        }}
      />
    </>
  )
}
