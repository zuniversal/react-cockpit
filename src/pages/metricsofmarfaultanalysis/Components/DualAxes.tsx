import plots from '@ant-design/plots'
import { memo, useEffect, useMemo, useRef } from 'react'

import decline from '../../../assets/icons/decline.svg'
import rise from '../../../assets/icons/rise.svg'
import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { tofixed, toFixedNumber } from '../../../utils'

const DualAxes = memo(plots.DualAxes, () => {
  return true
})

// const data = [
//   {
//     name: '01',
//     故障时间: 200,
//     故障率: 90,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '02',
//     故障时间: 120,
//     故障率: 70,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '03',
//     故障时间: 160,
//     故障率: 90,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '04',
//     故障时间: 70,
//     故障率: 70,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '05',
//     故障时间: 130,
//     故障率: 90,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '06',
//     故障时间: 140,
//     故障率: 70,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '07',
//     故障时间: 120,
//     故障率: 90,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '08',
//     故障时间: 12,
//     故障率: 70,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '09',
//     故障时间: 160,
//     故障率: 90,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '10',
//     故障时间: 70,
//     故障率: 70,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '11',
//     故障时间: 120,
//     故障率: 90,
//     t: 20,
//     h: 10,
//   },
//   {
//     name: '12',
//     故障时间: 120,
//     故障率: 70,
//     t: 20,
//     h: 10,
//   },
// ]

export const AnalysisDualAxes = (props) => {
  const { shouldInactive, factoryStage, height, data } = props

  const plotRef = useRef<any>()
  const [columnData, lineData] = useMemo(() => {
    const columnData = data.reduce(
      (left, right) => {
        left.push({
          type: '故障时间',
          name: right.eachMonth,
          value: right.ptdEquipFailTime,
          t: right.t,
          h: right.h,
        })
        return left
      },
      [data]
    )

    const lineData = data.reduce(
      (left, right) => {
        left.push({
          type: '故障率',
          name: right.eachMonth,
          故障率: toFixedNumber(right.failureRate * 100, 2),
        })
        return left
      },
      [data]
    )

    return [columnData, lineData]
  }, [data])
  useEffect(() => {
    plotRef.current.setState('inactive', shouldInactive)
  }, [factoryStage, shouldInactive])

  return (
    <div>
      <div style={{ fontSize: 10, color: '#8C8C8C', marginBottom: 4 }}>
        (min)
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

                    {/* <div style={{ padding: '5px 0' }}>
                    同比
                    <span
                      style={{
                        float: 'right',
                        color: '#5FCABB',
                        fontSize: '14px',
                      }}
                    >
                      -{t}
                      <img style={{ width: '12px' }} src={decline} />
                    </span>
                  </div>
                  <div style={{ padding: '5px 0' }}>
                    环比
                    <span
                      style={{
                        float: 'right',
                        color: '#F1965C',
                        fontSize: '14px',
                      }}
                    >
                      +{h}
                      <img
                        style={{ width: '12px' }}
                        src={h > 0 ? rise : decline}
                      />
                    </span>
                  </div> */}
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
                      if (!evt.event.data) {
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
