import { DualAxes } from '@ant-design/plots'
import { Card, ErrorBlock } from 'antd-mobile'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom'

import { Loading } from '../../components/loading/Loading'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { tofixed } from '../../utils'
import { Chart1 } from './Chart1'
export const AnalysisDualAxes = (props) => {
  const { con } = props
  const height = 0.65 * document.body.clientWidth
  const plotRef = useRef<any>()
  const { navigateToDetail } = useCurrentApp()
  const {
    error,
    data: selectYieldAnalysisData,
    query,
  } = useQuery('/productanaly/selectProductAnaly')
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query()
  }, [query, con])

  const uvData = useMemo(() => {
    const temp = []
    if (selectYieldAnalysisData) {
      try {
        selectYieldAnalysisData.productAnalyList.map((item) => {
          temp.push({
            factoryStageModelNum: item.factoryStageModelNum,
            报废金额: item.lossCost,
          })
        })
      } catch (error) {}
    }
    return temp
  }, [selectYieldAnalysisData])

  const transform = useMemo(() => {
    const temp = []
    if (selectYieldAnalysisData) {
      try {
        selectYieldAnalysisData.productAnalyList.map((item) => {
          temp.push({
            factoryStageModelNum: item.factoryStageModelNum,
            name: '最终合格率',
            合格率: item.finalPer,
          })
          temp.push({
            factoryStageModelNum: item.factoryStageModelNum,
            name: '一次合格率',
            合格率: item.firstPer,
          })
        })
      } catch (error) {}
    }
    return temp
  }, [selectYieldAnalysisData])

  if (!selectYieldAnalysisData) {
    return <Loading style={{ height: '30vh', width: '90vw' }} />
  }

  if (error) {
    return <ErrorBlock description={error.message} />
  }

  const onReadyColumn = (plot: any) => {
    let pre = ''
    plotRef.current = plot
    plot.on('tooltip:show', (args) => {
      // let arr =
      //   args.view.ele.children[0].children[1].children[0].innerHTML.split(
      //     '<br>'
      //   )
      const str = args.data.title
      if (pre === str) {
        pre = ''
        navigateToDetail({
          modelNum: str.split('\n')[1],
          factoryStage: str.split('\n')[0],
        })
      }
      pre = str
    })
  }

  let config = {}
  if (selectYieldAnalysisData) {
    try {
      config = {
        data: [uvData, [...transform]],
        padding: 'auto',
        autoFix: true,
        height,
        xField: 'factoryStageModelNum',
        yField: ['报废金额', '合格率'],
        xAxis: {
          top: true,
          label: {
            autoHide: false,
            style: () => {
              if (selectYieldAnalysisData.productAnalyList.length > 4) {
                return {
                  fontSize: 9,
                }
              }
              return {
                // fontSize: 10,
              }
            },
            formatter(val: string) {
              if (selectYieldAnalysisData.productAnalyList.length <= 4) {
                return val
              } else {
                const arr = val.split('\n')
                const idx = Math.trunc(arr[1].length / 2)
                return (
                  arr[0] +
                  '\n' +
                  arr[1].slice(0, idx) +
                  '\n' +
                  arr[1].slice(idx)
                )
              }
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
        legend: {
          position: 'bottom',
          marker: (name) => {
            if (name == '报废金额') {
              return {
                symbol: 'square',
              }
            } else {
              return {
                symbol: 'hyphen',
              }
            }
          },
        },
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
            color: ['#5FCABB', '#E08142'],
            lineStyle: {
              lineWidth: 2,
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
        // interactions: [
        //   {
        //     type: 'element-selected',
        //     cfg: {
        //       start: [
        //         {
        //           trigger: 'element:click',
        //           action(evt) {
        //             const { factoryStageModelNum } = evt.event.data.data
        //             navigateToDetail({
        //               modelNum: factoryStageModelNum.split('\n')[1],
        //               factoryStage: factoryStageModelNum.split('\n')[0],
        //             })
        //           },
        //         },
        //       ],
        //     },
        //   },
        // ],
      }
    } catch (error) {}
  }

  // return <DualAxes {...config} onReady={onReadyColumn} />

  return (
    <Chart1
      height={height}
      data={selectYieldAnalysisData?.productAnalyList ?? []}
      nameField="factoryStageModelNum"
      valueFields={['lossCost', 'finalPer', 'firstPer']}
      onClickTooltip={(series) => {
        const str = series[0].name
        navigateToDetail({
          modelNum: str.split('\n')[1],
          factoryStage: str.split('\n')[0],
        })
      }}
      axisFormatter={(val: string) => {
        if (selectYieldAnalysisData.productAnalyList.length <= 4) {
          return val
        } else {
          const arr = val.split('\n')
          const idx = Math.trunc(arr[1].length / 2)
          return arr[0] + '\n' + arr[1].slice(0, idx) + '\n' + arr[1].slice(idx)
        }
      }}
    />
  )
}
