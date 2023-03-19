import { DualAxes as DualAxes1 } from '@ant-design/plots'
import { memo } from 'react'

import decline from '../../../assets/icons/decline.svg'
import rise from '../../../assets/icons/rise.svg'
import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { tofixed } from '../../../utils'

const DualAxes = memo(DualAxes1, () => {
  return true
})

export const AnalysisDualAxes2 = (props) => {
  // const { ColumnData, LineData, isGWH } = props
  const height = 0.65 * document.body.clientWidth
  const { navigateToDetail } = useCurrentApp()
  const data = [
    {
      name: '型号1',
      产能: 1300,
      客户需求: 1900,
      产线负荷率: 80,
      t: 20,
      h: 10,
    },
    {
      name: '型号2',
      产能: 1500,
      客户需求: 2000,
      产线负荷率: 60,
      t: 20,
      h: 10,
    },
    {
      name: '型号3',
      产能: 3800,
      客户需求: 3900,
      产线负荷率: 80,
      t: 20,
      h: 10,
    },
    {
      name: '型号4',
      产能: 2800,
      客户需求: 2400,
      产线负荷率: 60,
      t: 20,
      h: 10,
    },
    {
      name: '型号5',
      产能: 2800,
      客户需求: 2500,
      产线负荷率: 80,
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

  return (
    <DualAxes
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
        appendPadding: [0, 0, 10, 0],
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
            },
          },
        ],
      }}
    />
  )
}
