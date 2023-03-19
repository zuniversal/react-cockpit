import { DualAxes } from '@ant-design/plots'
import { ErrorBlock } from 'antd-mobile'
import { memo, useMemo } from 'react'

import { Loading } from '../../components/loading/Loading'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { tofixed } from '../../utils'
import style from './index.module.less'
const DualAxes2 = memo(DualAxes, () => true)
export const Detail2DualAxes = (props) => {
  const height = 0.65 * document.body.clientWidth
  const { firstPerTotal, finalPerTotal, prodLineDesc, productAnalyList } = props
  const { user } = useCurrentApp()
  const { chooseDate, dateType } = user

  const uvData = useMemo(() => {
    if (productAnalyList.length > 0) {
      return productAnalyList.map((item) => {
        return {
          operationGroup: item.operationGroup,
          报废金额: item.lossCost,
        }
      })
    }
    return []
  }, [productAnalyList, prodLineDesc, dateType])

  const transform = useMemo(() => {
    const temp = []
    if (productAnalyList.length > 0) {
      try {
        productAnalyList.map((item) => {
          temp.push({
            operationGroup: item.operationGroup,
            name: '最终合格率',
            合格率: item.finalPer,
          })
          temp.push({
            operationGroup: item.operationGroup,
            name: '一次合格率',
            合格率: item.firstPer,
          })
          temp.push({
            operationGroup: item.operationGroup,
            name: '最终合格率目标值',
            合格率: item.finalPerTarget,
          })
          temp.push({
            operationGroup: item.operationGroup,
            name: '一次合格率目标值',
            合格率: item.firstPerTarget,
          })
        })
      } catch (error) {}
    }
    return temp
  }, [productAnalyList, prodLineDesc, dateType])

  if (productAnalyList.length === 0) {
    return <Loading style={{ height: '30vh', width: '90vw' }} />
  }

  // if (error) {
  //   return <ErrorBlock description={error.message} />
  // }

  let config = {}
  try {
    if (firstPerTotal !== -1 && finalPerTotal !== -1) {
      config = {
        data: [uvData, [...transform]],
        padding: 'auto',
        appendPadding: [0, 0, 20, 0],
        autoFix: true,
        height,
        xField: 'operationGroup',
        yField: ['报废金额', '合格率'],
        xAxis: {
          label: {
            autoHide: false,
            formatter(val: string) {
              let idx = -1
              if (val.length > 5) {
                if (val.indexOf('（') !== -1) {
                  idx = val.indexOf('（')
                  return val.slice(0, idx) + '\n' + val.slice(idx)
                } else {
                  if (/^[a-zA-Z]+$/.test(val)) {
                    if (val.length > 7) {
                      idx = Math.trunc(val.length / 2)
                      return val.slice(0, idx) + '\n' + val.slice(idx)
                    } else {
                      return val
                    }
                  } else {
                    idx = Math.trunc(val.length / 2)
                    return val.slice(0, idx) + '\n' + val.slice(idx)
                  }
                }
              }
              return val
            },
          },
        },
        yAxis: {
          报废金额: {
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
          合格率: {
            nice: true,
            min: 0,
            max: 1,
            label: {
              formatter: (val) => tofixed(Number(val) * 100, 0) + '%',
            },
            tickCount: 4,
          },
        },
        legend: false,
        geometryOptions: [
          {
            geometry: 'column',
            columnWidthRatio: 0.4,
            color: '#5183FD',
            tooltip: {
              formatter: (datum) => {
                return {
                  name: '报废金额',
                  value: tofixed(datum.报废金额, 2),
                }
              },
            },
          },
          {
            geometry: 'line',
            seriesField: 'name',
            smooth: true,
            color: ['#766BF5', '#E08142'],
            lineStyle: ({ name }) => {
              if (name === '一次合格率目标值' || name === '最终合格率目标值') {
                return {
                  lineDash: [0.5, 5],
                }
              }
            },
            point: { size: 2.5 },
            tooltip: {
              formatter: (datum) => {
                return {
                  name: datum.name,
                  value: tofixed(datum.合格率 * 100, 2) + '%',
                }
              },
            },
          },
        ],
      }
    }
  } catch (error) {}
  return (
    <>
      {productAnalyList.length > 0 && (
        <div style={{ position: 'relative', zIndex: '103' }}>
          <DualAxes2
            {...config}
            key={prodLineDesc}
            className={style.dualaxes1}
          />
        </div>
      )}
    </>
  )
}
