import plots from '@ant-design/plots'
import { memo, useEffect, useRef } from 'react'

import decline from '../../../assets/icons/decline.svg'
import rise from '../../../assets/icons/rise.svg'
import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { tofixed } from '../../../utils'

const DualAxes = memo(plots.DualAxes, () => {
  return true
})

export const AnalysisDualAxes = (props) => {
  const { factoryName, factoryStage, setFactoryState } = props
  const height = 0.65 * document.body.clientWidth
  const { navigateToDetail } = useCurrentApp()

  const plotRef = useRef<any>()

  const data = [
    {
      name: '01',
      产能: 16,
      客户需求: 20,
      产线负荷率: 90,
      t: 20,
      h: 10,
    },
    {
      name: '02',
      产能: 11,
      客户需求: 12,
      产线负荷率: 70,
      t: 20,
      h: 10,
    },
    {
      name: '03',
      产能: 13,
      客户需求: 16,
      产线负荷率: 90,
      t: 20,
      h: 10,
    },
    {
      name: '04',
      产能: 9,
      客户需求: 7,
      产线负荷率: 70,
      t: 20,
      h: 10,
    },
    {
      name: '05',
      产能: 6,
      客户需求: 13,
      产线负荷率: 90,
      t: 20,
      h: 10,
    },
    {
      name: '06',
      产能: 12,
      客户需求: 14,
      产线负荷率: 70,
      t: 20,
      h: 10,
    },
    {
      name: '07',
      产能: 13,
      客户需求: 12,
      产线负荷率: 90,
      t: 20,
      h: 10,
    },
    {
      name: '08',
      产能: 11,
      客户需求: 12,
      产线负荷率: 70,
      t: 20,
      h: 10,
    },
    {
      name: '09',
      产能: 13,
      客户需求: 16,
      产线负荷率: 90,
      t: 20,
      h: 10,
    },
    {
      name: '10',
      产能: 9,
      客户需求: 7,
      产线负荷率: 70,
      t: 20,
      h: 10,
    },
    {
      name: '11',
      产能: 6,
      客户需求: 12,
      产线负荷率: 90,
      t: 20,
      h: 10,
    },
    {
      name: '12',
      产能: 9,
      客户需求: 12,
      产线负荷率: 70,
      t: 20,
      h: 10,
    },
  ]

  const columnData = data.reduce((left, right) => {
    left.push({
      type: '产能',
      name: right.name,
      value: right['产能'],
      t: right.t,
      h: right.h,
    })
    left.push({
      type: '客户需求',
      name: right.name,
      value: right['客户需求'],
      t: right.t,
      h: right.h,
    })
    return left
  }, [])

  const lineData = data.reduce((left, right) => {
    left.push({
      type: '产线负荷率',
      name: right.name,
      产线负荷率: right['产线负荷率'],
    })
    return left
  }, [])

  useEffect(() => {
    plotRef.current.setState('inactive', (item) => {
      if (factoryStage === '' || factoryStage === 'undefined') {
        return false
      }
      return item.name !== factoryStage
    })
  }, [factoryStage])

  return (
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
        产线负荷率: {
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
        yField: ['value', '产线负荷率'],

        legend: false,
        tooltip: {
          formatter: (datum) => {
            return {
              name: datum.type || '产线负荷率',
              value: datum.value || datum.产线负荷率 + '%',
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
                      return
                    }
                    const nextFactoryStage = evt.event.data.data.name
                    if (factoryStage === nextFactoryStage) {
                      // navigateToDetail({
                      //   factoryName: props.factoryName,
                      //   factoryStage: '',
                      // })
                    } else {
                      // navigateToDetail({
                      //   factoryName: props.factoryName,
                      //   factoryStage: evt.event.data.data.name,
                      // })
                      setFactoryState(evt.event.data.data.name)
                    }
                  },
                },
              ],
            },
          },
        ],
      }}
    />
  )
}
