import plots from '@ant-design/plots'
import { memo, useEffect, useRef } from 'react'

import decline from '../../../assets/icons/decline.svg'
import rise from '../../../assets/icons/rise.svg'
import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { tofixed } from '../../../utils'

const DualAxes = memo(plots.DualAxes, () => {
  return true
})

export const AnalysisDualAxes2 = (props) => {
  const { shouldInactive, factoryStage, onClickElement } = props
  const height = 0.65 * document.body.clientWidth
  const { navigateToDetail } = useCurrentApp()

  const plotRef = useRef<any>()

  const data = [
    {
      name: '制卷',
      影响产量: 200,
      故障率: 90,
      t: 20,
      h: 10,
    },
    {
      name: '制芯',
      影响产量: 120,
      故障率: 70,
      t: 20,
      h: 10,
    },
    {
      name: '化成',
      影响产量: 160,
      故障率: 90,
      t: 20,
      h: 10,
    },
  ]

  const columnData = data.reduce((left, right) => {
    left.push({
      type: '影响产量',
      name: right.name,
      value: right['影响产量'],
      t: right.t,
      h: right.h,
    })
    return left
  }, [])

  const lineData = data.reduce((left, right) => {
    left.push({
      type: '故障率',
      name: right.name,
      故障率: right['故障率'],
    })
    return left
  }, [])

  useEffect(() => {
    if (shouldInactive) {
      plotRef.current.setState('inactive', shouldInactive)
    }
  }, [factoryStage, shouldInactive])

  return (
    <div>
      <div style={{ fontSize: 10, color: '#8C8C8C', marginBottom: 4 }}>
        (支)
      </div>
      <DualAxes
        onReady={(plot) => {
          plotRef.current = plot
        }}
        yAxis={{
          value: {
            nice: true,
            tickCount: 4,
            grid: {
              line: {
                style: {
                  stroke: 'rgba(217, 217, 217, 0.5)',
                  lineDash: [4, 5],
                },
              },
            },
          },
          故障率: {
            nice: true,
            label: {
              formatter: (val) => val + '%',
            },
            min: 0,
            max: 100,
            tickCount: 5,
          },
        }}
        {...{
          data: [columnData, lineData],
          padding: 'auto',
          autoFix: true,
          height,
          xField: 'name',
          yField: ['value', '故障率'],

          legend: {
            position: 'bottom',
          },
          tooltip: {
            formatter: (datum) => {
              return {
                name: datum.type || '故障率',
                value: datum.value || datum.故障率 + '%',
                display: 'block',
              }
            },
            customContent: (title, items) => {
              const [f = {}] = items
              if (!f.data) return
              const {
                data: { t = 0, h = 0 },
              } = f
              return (
                <>
                  <div className="" style={{ paddingBottom: '10px' }}>
                    <div
                      className="g2-tooltip-title"
                      style={{
                        marginBottom: '12px',
                        marginTop: '12px',
                        fontFamily: 'PingFang SC',
                        fontWeight: 400,
                        color: 'rgb(86, 85, 92)',
                      }}
                    >
                      {title}
                    </div>
                    <ul
                      className="g2-tooltip-list"
                      style={{
                        margin: '0px',
                        listStyleType: 'none',
                        padding: '0px',
                      }}
                    >
                      {items?.map((item, index) => {
                        const { name, value, color } = item
                        return (
                          <li
                            key={index}
                            className="g2-tooltip-list-item"
                            data-index={index}
                            style={{
                              listStyleType: 'none',
                              padding: '0px',
                              margin: '12px 0px',
                            }}
                          >
                            <span
                              className="g2-tooltip-marker"
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '8px',
                                backgroundColor: color,
                              }}
                            />
                            <span
                              style={{
                                fontFamily: 'PingFang SC',
                                fontWeight: 400,
                                color: 'rgb(86, 85, 92)',
                              }}
                            >
                              {name}:
                            </span>
                            <span
                              style={{
                                fontFamily: 'DIN',
                                display: 'inline-block',
                                float: 'right',
                                marginLeft: '30px',
                                fontWeight: 400,
                                color: 'rgb(86, 85, 92)',
                              }}
                            >
                              {value}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </>
              )
            },
          },
          geometryOptions: [
            {
              geometry: 'column',
              isGroup: true,
              seriesField: 'type',
              color: ['#5183FD', '#5FCABB'],
              columnStyle: ({ type }) => {
                return {
                  // 柱状图描边
                }
              },
            },
            {
              geometry: 'line',
              color: '#E08142',
              smooth: true,
              lineStyle: {
                stroke: '#E08142',
                lineWidth: 2,
              },
              point: {
                shape: '',
                size: 2.5,
              },
            },
          ],
          interactions: [
            {
              type: 'element-selected',
              cfg: {
                start: [
                  {
                    trigger: 'element:click',
                    action(evt) {},
                  },
                ],
                end: [
                  {
                    trigger: 'element:click',
                    action(evt) {
                      if (evt.event.data) {
                        if (onClickElement) {
                          onClickElement(evt.event.data)
                        }
                      }
                    },
                  },
                ],
              },
            },
          ],
        }}
      />
    </div>
  )
}
