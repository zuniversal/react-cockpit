import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Pagination } from '../../components/pagination'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { createTooltipFormater, toFixedNumber } from '../../utils'
import styles from '../../utils/styles.module.less'

/**
 * 库存效率 - 通用柱线图图表
 */
export function Chart1(props) {
  const { navigateToDetail } = useCurrentApp()
  const chartRef = useRef()
  const {
    currentUnit = '天',
    data = [],
    nameField = 'name',
    valueFields = ['inventoryGoalDay', 'inventoryDay', 'inventoryDeviationDay'],
    onClickItem,
    onClickTooltip,
    pageSize = 8,
    // x轴坐标每行显示的字数
    xAxisLabelProviderNumber = 2,
  } = props
  const windowWidth = useWindowWidth()

  const [page, setPage] = useState(1)

  const total = useMemo(() => {
    if (pageSize > 0) {
      return Math.ceil(data.length / pageSize)
    }
    return 0
  }, [pageSize, data])

  const enterable = !!onClickTooltip

  const valueFormatter = useCallback((series) => {
    return toFixedNumber(series.value, 2)
  }, [])

  const pageData = useMemo(() => {
    if (pageSize > 0) {
      const start = (page - 1) * pageSize
      return data.slice(start, start + pageSize)
    }
    return data
  }, [data, pageSize, page])

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      chart.setOption({
        grid: { x: 30, y: 40, x2: props.gridX2 || 30, y2: 50 },
        legend: {
          bottom: 0,
          data: ['目标', '现状', '偏差(天数)'],
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
            type: 'shadow',
          },
          formatter: createTooltipFormater({
            onClickTooltip,
            valueFormatter,
          }),
        },
        xAxis: {
          type: 'category',
          data: pageData.map((item) => item[nameField]),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            fontSize: 10,
            formatter: (params) => {
              if (pageData.length < 5) {
                return params
              }
              let newParamsName = '' // 拼接后的新字符串
              const paramsNameNumber = params.length // 实际标签数
              const provideNumber = xAxisLabelProviderNumber // 每行显示的字数
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 如需换回，算出要显示的行数

              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */

                for (let i = 0; i < rowNumber; i++) {
                  let tempStr = '' // 每次截取的字符串
                  const start = i * provideNumber // 截取位置开始
                  const end = start + provideNumber // 截取位置结束

                  // 最后一行的需要单独处理

                  if (i === rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }

              return newParamsName
            },
          },
        },
        yAxis: [
          {
            // min: 0,
            type: 'value',
            // splitNumber: 3,
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
            // min: 0,
            // max: 100,
            // splitNumber: 3,
            type: 'value',
            axisLabel: {
              // formatter: (val) => `${toFixedNumber(val, 0)}%`,
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
            name: '目标',
            data: pageData.map((item) => item[valueFields[0]]),
            type: 'bar',
            color: '#5183FD',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: '现状',
            data: pageData.map((item) => item[valueFields[1]]),
            color: '#5FCABB',
            type: 'bar',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: '偏差(天数)',
            yAxisIndex: 1,
            data: pageData.map((item) => item[valueFields[2]]),
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
          const item = pageData[dataIndex]
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
    nameField,
    currentUnit,
    valueFields,
    xAxisLabelProviderNumber,
    pageData,
    pageSize,
  ])

  return (
    <div>
      <div ref={chartRef} style={{ width: windowWidth - 44, height: 210 }} />
      {pageSize > 0 && data.length > pageSize && (
        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Pagination current={page} onChange={setPage} total={total} />
        </div>
      )}
    </div>
  )
}
