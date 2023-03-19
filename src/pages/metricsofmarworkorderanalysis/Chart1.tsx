import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useCallback, useEffect, useRef } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { createTooltipFormater, toFixedNumber } from '../../utils'
import styles from '../../utils/styles.module.less'

export function Chart1(props) {
  const { navigateToDetail } = useCurrentApp()
  const chartRef = useRef()
  const { currentUnit = '个', data = [], onClickItem, onClickTooltip } = props
  const windowWidth = useWindowWidth()

  const enterable = !!onClickTooltip

  const valueFormatter = useCallback((series) => {
    if (series.seriesName === '工单逾期率') {
      return `${series.value}%`
    }
    return series.value
  }, [])

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.setOption({
        grid: { x: 40, y: 40, x2: 40, y2: 50 },
        legend: {
          bottom: 0,
          data: ['工单总数', '工单逾期数', '工单逾期率'],
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { fontSize: 10 },
        },
        tooltip: {
          enterable,
          confine: true,
          hideDelay: 200,
          trigger: 'axis',
          renderMode: 'html',
          className: styles.tooltip,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: createTooltipFormater({
            onClickTooltip,
            valueFormatter,
            extra: (item) => {
              const series1 = item[0]
              const dataItem = data[series1.dataIndex]
              let yoyType = 'same'
              let qoqType = 'same'
              if (dataItem.同比 > 0) {
                yoyType = 'up'
              } else if (dataItem.同比 < 0) {
                yoyType = 'down'
              }
              if (dataItem.环比 > 0) {
                qoqType = 'up'
              } else if (dataItem.环比 < 0) {
                qoqType = 'down'
              }
              let yoyValue = `${dataItem.同比}%`
              let yoyIcon = styles.trend_icon
              let qoqValue = `${dataItem.环比}%`
              let qoqIcon = styles.trend_icon
              if (dataItem.同比 === Infinity) {
                yoyValue = '/'
                yoyIcon = ''
              }
              if (dataItem.环比 === Infinity) {
                qoqValue = '/'
                qoqIcon = ''
              }
              return `<div>
                <div class="${styles.extra_row}">
                  <div class="${styles.extra_label}">同比</div>
                  <div class="${styles.trend_percent} ${styles[yoyType]}">
                    <div class="${styles.trend_label}">
                    ${yoyValue}
                    </div>
                    <div class="${yoyIcon}" ></div>
                  </div>
                </div>
                <div class="${styles.extra_row}">
                  <div class="${styles.extra_label}">环比</div>
                  <div class="${styles.trend_percent} ${styles[qoqType]}">
                    <div class="${styles.trend_label}">
                    ${qoqValue}
                    </div>
                    <div class="${qoqIcon}" ></div>
                  </div>
                </div>
              </div>`
            },
          }),
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: { interval: 0, fontSize: 10 },
        },
        yAxis: [
          {
            min: 0,
            type: 'value',
            splitNumber: 3,
            name: `(${currentUnit})　　　`,
            axisLine: {
              lineStyle: {
                type: 'dashed',
                dashOffset: 2,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          {
            alignTicks: true,
            min: 0,
            max: 100,
            splitNumber: 3,
            type: 'value',
            axisLabel: {
              formatter: (val) => `${toFixedNumber(val, 0)}%`,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
              },
            },
          },
        ],
        series: [
          {
            name: '工单总数',
            data: data.map((item) => item['工单总数']),
            type: 'bar',
            color: '#5183FD',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: '工单逾期数',
            data: data.map((item) => item['工单逾期数']),
            color: '#5FCABB',
            type: 'bar',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: '工单逾期率',
            yAxisIndex: 1,
            data: data.map((item) => item['工单逾期率']),
            color: '#E08142',
            type: 'line',
            smooth: true,
          },
        ],
      })

      chart.getZr().off('click')
      chart.getZr().on('click', (event) => {
        if (chart.containPixel('grid', [event.offsetX, event.offsetY])) {
          const dataIndex = chart.convertFromPixel({ seriesIndex: 0 }, [
            event.offsetX,
            event.offsetY,
          ])[0]
          console.log('dataIndex', dataIndex, event)
          const item = data[dataIndex]
          onClickItem && onClickItem(item)
        }
      })
    }
  }, [
    onClickItem,
    navigateToDetail,
    data,
    enterable,
    valueFormatter,
    onClickTooltip,
    currentUnit,
  ])

  return (
    <div
      ref={chartRef}
      style={{ width: windowWidth - 44, height: windowWidth * 0.6 }}
    />
  )
}
