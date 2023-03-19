import { DualAxes } from '@ant-design/plots'
import { ErrorBlock } from 'antd-mobile'
import { memo, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Loading } from '../../components/loading/Loading'
import { tofixed } from '../../utils'
import style from './index.module.less'
const DualAxes1 = memo(DualAxes, () => true)
export const Detail1DualAxes = (props) => {
  const {
    error,
    productAnalyList,
    prodLineDesc,
    setProdLineDesc,
    firstPerTotal,
    finalPerTotal,
    setCount,
    prod,
  } = props

  const plotRef = useRef<any>()
  const setTitle = props.setTitle
  const height = 0.65 * document.body.clientWidth
  const prodLineDesc1 = prodLineDesc ? prodLineDesc : ''
  const uvData = useMemo(() => {
    const temp = []
    if (productAnalyList.length > 0) {
      try {
        productAnalyList.map((item) => {
          temp.push({
            prodLineDesc: item.prodLineDesc,
            name: '报废金额',
            报废金额: item.lossCost1,
          })
          temp.push({
            prodLineDesc: item.prodLineDesc,
            name: '电极段',
            报废金额: item.lossCost2,
          })
        })
      } catch (error) {}
    }
    return temp
  }, [productAnalyList])

  const transform = useMemo(() => {
    const temp = []
    if (productAnalyList.length > 0) {
      try {
        productAnalyList.map((item) => {
          temp.push({
            prodLineDesc: item.prodLineDesc,
            name: '最终合格率',
            合格率: item.finalPer,
          })
          temp.push({
            prodLineDesc: item.prodLineDesc,
            name: '一次合格率',
            合格率: item.firstPer,
          })
          temp.push({
            prodLineDesc: item.prodLineDesc,
            name: '最终合格率目标值',
            合格率: item.finalPerTarget,
          })
          temp.push({
            prodLineDesc: item.prodLineDesc,
            name: '一次合格率目标值',
            合格率: item.firstPerTarget,
          })
        })
      } catch (error) {}
    }
    return temp
  }, [productAnalyList])

  // if (!productAnalyList) {
  //   return <Loading style={{ height: '30vh', width: '90vw' }} />
  // }

  // if (error) {
  //   return <ErrorBlock description={error.message} />
  // }
  const onReadyColumn = (plot: any) => {
    plotRef.current = plot
    plot.on('element:click', (args: any) => {
      try {
        console.log(args)
        setCount(new Date().getTime())
        if (!args.data.data) {
          return
        }
        const nextProdLineDesc = args.data.data.prodLineDesc
        // if (productAnalyList === '') {
        //   if (prodLineDesc1 === nextProdLineDesc) {
        //     setTitle('全部')
        //     setProdLineDesc(prod)
        //   } else {
        //     setTitle(nextProdLineDesc)
        //     setProdLineDesc(nextProdLineDesc)
        //   }
        // } else {
        // if (prodLineDesc1 === nextProdLineDesc) {
        //   setTitle('全部')
        //   setProdLineDesc(prod)
        // } else {
        setTitle(nextProdLineDesc)
        setProdLineDesc(nextProdLineDesc)
        // }
        // }
      } catch (error) {}
    })
  }

  const config = {
    data: [uvData, [...transform]],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'prodLineDesc',
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
        isStack: true,
        seriesField: 'name',
        color: ['#5183FD', '#5FCABB'],
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

  useEffect(() => {
    try {
      plotRef.current.setState('inactive', (item) => {
        if (prodLineDesc1 === '') {
          return false
        }
        return item.prodLineDesc !== prodLineDesc1
      })
    } catch (error) {}
  }, [prodLineDesc1])

  return (
    <>
      {productAnalyList.length > 0 && (
        <div style={{ position: 'relative', zIndex: '103' }}>
          <DualAxes1
            onReady={onReadyColumn}
            {...config}
            key={prodLineDesc1}
            className={style.dualaxes}
          />
        </div>
      )}
    </>
  )
}
