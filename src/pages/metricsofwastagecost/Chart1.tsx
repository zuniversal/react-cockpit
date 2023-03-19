import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import styles from './index.module.less'

export function Chart1(props) {
  const { navigateToDetail } = useCurrentApp()
  const chartRef = useRef()
  const { data = [], onClickDataIndex, onClickTooltip } = props
  const windowWidth = useWindowWidth()
  const selectedDataIndex = useRef(-1)

  const enterable = !!onClickTooltip

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.setOption({
        grid: { x: 60, y: 10, x2: 10, y2: 40 },
        legend: {
          bottom: 0,
          data: ['总损耗成本', '单位损耗成本'],
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { fontSize: 10 },
        },
        tooltip: {
          enterable,
          confine: true,
          hideDelay: 200,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          renderMode: 'html',
          className: styles.tooltip,
          formatter: (value) => {
            console.log(value)
            let str = `<div style="margin: 0px 0 0;line-height:1;">
            <div style="margin: 0px 0 0;line-height:1;">
              <div style="color:rgb(89, 89, 89);font-weight:400;line-height:1;font-size:12px;">${value[0].name}</div>`
            value.map((item) => {
              str += `<div style="margin: 10px 0 0;line-height:1;" >
              <div style="margin: 0px 0 0;line-height:1;">
                <div style="margin: 0px 0 0;line-height:1;">
                  <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                  <span style="font-size:12px;color:rgb(89, 89, 89);margin-left:2px">${item.seriesName}</span>
                  <span style="font-size:12px;float:right;margin-left:20px;color:rgb(89, 89, 89);">${item.value}</span>
                </div>
            </div>`
            })
            str += `</div>
            </div>
          </div>
        </div>`
            return str
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name),
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          // min: 0,
          // max: 4000,
          type: 'value',
          // name: `(万元)`,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        series: [
          {
            name: '总损耗成本',
            data: data.map((item) => item['总损耗成本']),
            type: 'bar',
            color: '#5183FD',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: '单位损耗成本',
            data: data.map((item) => item['单位损耗成本']),
            color: '#5FCABB',
            type: 'bar',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
      })
    }
  }, [navigateToDetail, data, onClickDataIndex, enterable, onClickTooltip])

  return (
    <div
      ref={chartRef}
      style={{ width: windowWidth - 44, height: windowWidth * 0.6 }}
    />
  )
}
