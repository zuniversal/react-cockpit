import { useWindowWidth } from '@react-hook/window-size'
import * as echarts from 'echarts'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Pagination } from '../../components/pagination'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { createTooltipFormater, toFixedNumber } from '../../utils'
import styles from '../../utils/styles.module.less'

/**
 * 产能
 */
export function Chart1(props) {
  const { navigateToDetail } = useCurrentApp()
  const chartRef = useRef()
  const {
    currentUnit = '千支',
    data = [],
    nameField = 'productModel',
    legends = ['计划产能', '实际产能', '产能达成率'],
    valueFields = [
      'unitMaterialCostStandard',
      'unitTotalCost',
      'unitManufacturingCostStandard',
    ],
    onClickItem,
    onClickTooltip,
    height = 245,
    pageSize = 8,
    axisFormatter = (params) => {
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
    // x轴坐标每行显示的字数
    xAxisLabelProviderNumber = 4,
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
    if (typeof series.value === 'undefined' || series.value === null) {
      return '/'
    }
    if (series.seriesIndex === 0 || series.seriesIndex === 1) {
      return series.value
    }
    return `${toFixedNumber(series.value, 2)}%`
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
        grid: { x: 50, y: 40, x2: 40, y2: 40 },
        legend: {
          bottom: 0,
          data: legends,
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
            formatter: axisFormatter,
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
            min: 0,
            // max: 100,
            // splitNumber: 3,
            type: 'value',
            axisLabel: {
              formatter: (val) => `${toFixedNumber(val * 1, 0)}%`,
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
            name: legends[0],
            data: pageData.map((item) => item[valueFields[0]]),
            yAxisIndex: 0,
            type: 'bar',
            color: '#5183FD',
            smooth: true,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: legends[1],
            yAxisIndex: 0,
            data: pageData.map((item) => item[valueFields[1]]),
            color: '#5FCABB',
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
            type: 'bar',
            smooth: true,
          },
          {
            name: legends[2],
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
    axisFormatter,
    valueFields,
    xAxisLabelProviderNumber,
    pageData,
    pageSize,
    legends,
  ])

  return (
    <div>
      <div ref={chartRef} style={{ width: windowWidth - 44, height }} />
      {pageSize > 0 && data.length > pageSize && (
        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Pagination current={page} onChange={setPage} total={total} />
        </div>
      )}
    </div>
  )
}
