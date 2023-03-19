import { Column } from '@ant-design/plots'
import { memo, useMemo, useState } from 'react'

import decline from '../../assets/metricsicons/decline.svg' //下降图片
import rise from '../../assets/metricsicons/rise.svg' //上升图标
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
export const DemoDualAxes = () => {
  const { navigateToDetail } = useCurrentApp()
  let state

  const data = [
    {
      name: '一线',
      sales: 150000,
      type: '当前在职人数',
      withValue: '+15%',
      ringValue: '+15%',
    },
    {
      name: '非一线',
      sales: 100000,
      type: '当前在职人数',
      withValue: '+15%',
      ringValue: '+15%',
    },
  ]

  const config = {
    data,
    xField: 'name',
    yField: 'sales',
    height: 150,
    seriesField: 'type',
    padding: 'auto',
    appendPadding: [0, 0, 10, 0],
    tooltip: {
      position: 'left',
      offsetX: -40,
      customContent: (title, items) => {
        return (
          <>
            <h5 style={{ marginTop: 16 }}>{title}</h5>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {items?.map((item, index) => {
                console.log(item)
                const { data } = item

                return (
                  <li
                    key={item.title}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        className="g2-tooltip-marker"
                        style={{
                          backgroundColor: '#5183FD',
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          marginRight: '8px',
                        }}
                      />
                      <span
                        style={{
                          display: 'inline-flex',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ marginRight: 16 }}>{data.type}</span>
                        <span className="g2-tooltip-list-item-value">
                          {data.sales}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ marginRight: 16 }}>同比</span>
                        <span
                          className="g2-tooltip-list-item-value"
                          style={{ color: '#F1965C' }}
                        >
                          {data.withValue}
                          <img src={rise} alt="" />
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ marginRight: 16 }}>环比</span>
                        <span
                          className="g2-tooltip-list-item-value"
                          style={{ color: '#F1965C' }}
                        >
                          {data.ringValue}
                          <img src={rise} alt="" />
                        </span>
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )
      },
      point: {
        size: 5,
        shape: 'diamond',
        style: {
          fill: 'white',
          stroke: '#2593fc',
          lineWidth: 2,
        },
      },
    },

    yAxis: {
      max: 200000,
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
          },
        },
      },
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      sales: {
        alias: '当前在职人数',
      },
      withValue: {
        alias: '同比',
      },
      ringValue: {
        alias: '环比',
      },
    },
    minColumnWidth: 32,
    maxColumnWidth: 32,
  }
  return (
    <Column
      {...config}
      onReady={(plot) => {
        plot.on('plot:click', (evt) => {
          const { x, y } = evt
          const tooltipData = plot.chart.getTooltipItems({ x, y })
          if (state === tooltipData[0].title) {
            navigateToDetail({ title: tooltipData[0].title })
          } else {
            state = tooltipData[0].title
          }
        })
      }}
    />
  )
}
