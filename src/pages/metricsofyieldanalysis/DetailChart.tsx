import { useWindowWidth } from '@react-hook/window-size'
import { Card } from 'antd-mobile'
import { ExclamationCircleOutline } from 'antd-mobile-icons'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../components/helmet'
import { Loading } from '../../components/loading/Loading'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { useRequest } from '../../hooks/useRequest'
import { tofixed } from '../../utils'
import { Empty } from '../empty/index'
import { Detail1DualAxes } from './DetailDualAxes1'
import { Detail2DualAxes } from './DetailDualAxes2'
import styles1 from './index.module.less'

export function DetailChart(props) {
  const id = localStorage.getItem('yieldAnalysisId')
  const [search] = useSearchParams()
  const modelNum = search.get('modelNum') ?? ''
  const factoryStage = search.get('factoryStage') ?? ''
  // const prod = search.get('prodLineDesc') ?? ''
  const [prodLineDesc, setProdLineDesc] = useState('')
  const [title, setTitle] = useState('全部')
  const [count, setCount] = useState(0)
  const { user, indicator } = useCurrentApp()
  const { chooseDate, dateType } = user
  const time = localStorage.getItem('yieldAnalysisTime')

  const [pageNo, setPageNo] = useState(1)
  const [pages, setPages] = useState(1)
  // 页面埋点
  const applicationArea = search.get('applicationArea') ?? ''
  const requestStart = useRequest('/datapageaccesslog/dataPageAccessLog/addLog')
  const requestEnd = useRequest(
    '/datapageaccesslog/dataPageAccessLog/updateEndTime'
  )
  const indicatorUpdateTime = indicator?.updateTime
  const formattedChooseDate = useMemo(() => {
    let date = chooseDate
    if (indicatorUpdateTime) {
      const indicatorUpdateDate = new Date(indicatorUpdateTime)

      if (`${indicatorUpdateDate}` !== 'Invalid Date') {
        if (date.getTime() > indicatorUpdateDate.getTime()) {
          date = indicatorUpdateDate
        }
      }
    }
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    return `${y}-${m}-${d}`
  }, [chooseDate, indicatorUpdateTime])

  useEffect(() => {
    console.log('进入DetailMode页面')
    const response = requestStart({
      pageName:
        applicationArea === '' ? '良率分析' : `良率分析-${applicationArea}`,
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
        pageNo,
        applicationArea,
      }),
      accessDepth: 'level2',
      platform: 'ckpt',
      requestUrlReal: window.location.pathname,
      requestUrl: '/productanaly/selectProductAnaly',
    })
    let id
    response.then((data) => {
      id = data
    })
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出DetailMode页面')
    }
  }, [])

  const con = useMemo(() => {
    if (dateType === 'a') {
      return {
        chooseDate: time,
      }
    }
    return {}
  }, [dateType, chooseDate, time])
  const {
    error: error1,
    data: selectYieldAnalysisData1,
    query: query1,
  } = useQuery('/productanaly/selectProductAnaly')

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query1({
      modelNum,
      factoryStage,
      ...con,
    })
  }, [query1])
  const [showEmpty, setShowEmpty] = useState(false)
  useEffect(() => {
    if (selectYieldAnalysisData1) {
      try {
        if (selectYieldAnalysisData1.productAnalyList.length > 0) {
          setProdLineDesc(
            selectYieldAnalysisData1.productAnalyList[0].prodLineDesc
          )
        } else {
          setShowEmpty(true)
        }
      } catch (error) {}
    }
  }, [selectYieldAnalysisData1])

  const {
    error: error2,
    data: selectYieldAnalysisData2,
    query: query2,
  } = useQuery('/productanaly/selectProductAnaly')

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    if (prodLineDesc !== '') {
      query2({
        modelNum,
        factoryStage,
        prodLineDesc,
        ...con,
      })
    }
  }, [query2, prodLineDesc])
  // 图例卡片
  const legendCard = [
    {
      name: '报废金额',
      color: '#5183FD',
    },
    {
      name: '电极段',
      color: '#5FCABB',
    },
    {
      name: '最终合格率',
      color: '#766BF5',
    },
    {
      name: '一次合格率',
      color: '#E08142',
    },
    {
      name: '最终合格率目标值',
      color: '#766BF5',
    },
    {
      name: '一次合格率目标值',
      color: '#E08142',
    },
  ]

  const legendCard1 = [
    {
      name: '报废金额',
      color: '#5183FD',
    },
    {
      name: '最终合格率',
      color: '#766BF5',
    },
    {
      name: '一次合格率',
      color: '#E08142',
    },
    {
      name: '最终合格率目标值',
      color: '#766BF5',
    },
    {
      name: '一次合格率目标值',
      color: '#E08142',
    },
  ]

  return (
    <>
      <HeadTitle>{`良率分析-${factoryStage}-${modelNum}`}</HeadTitle>
      <div>
        <Card title="产线分析">
          {selectYieldAnalysisData1 ? (
            <>
              {selectYieldAnalysisData1 &&
              selectYieldAnalysisData1.productAnalyList.length > 0 ? (
                <>
                  <div
                    className={styles1.unitFont}
                    style={{ marginBottom: '1vh' }}
                  >
                    (百万元)
                  </div>
                  <Detail1DualAxes
                    finalPerTotal={
                      selectYieldAnalysisData1
                        ? selectYieldAnalysisData1.finalPerTotal
                        : 0
                    }
                    firstPerTotal={
                      selectYieldAnalysisData1
                        ? selectYieldAnalysisData1.firstPerTotal
                        : 0
                    }
                    setTitle={setTitle}
                    setCount={setCount}
                    prod={
                      selectYieldAnalysisData1
                        ? selectYieldAnalysisData1.productAnalyList[0] &&
                          selectYieldAnalysisData1.productAnalyList[0]
                            .prodLineDesc
                        : ''
                    }
                    prodLineDesc={prodLineDesc}
                    setProdLineDesc={setProdLineDesc}
                    productAnalyList={
                      selectYieldAnalysisData1
                        ? selectYieldAnalysisData1.productAnalyList
                        : []
                    }
                    error={error1}
                  />
                  <ul className={styles1.legend}>
                    {legendCard.map((item) => {
                      return (
                        <li key={item.name}>
                          <div style={{ background: item.color }} />
                          <span>{item.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : (
                <>
                  {showEmpty && (
                    <div
                      style={{
                        width: '100%',
                        height: '188px',
                      }}
                    >
                      <Empty src={require('../../assets/icons/no-data.svg')}>
                        当前产线未上传良率数据，暂无信息
                      </Empty>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <Loading style={{ height: '30vh', width: '90vw' }} />
          )}
        </Card>

        <div style={{ height: 10 }} />

        <Card title={`工段分析-${prodLineDesc}`}>
          {selectYieldAnalysisData2 ? (
            <>
              {selectYieldAnalysisData1 &&
              selectYieldAnalysisData1.productAnalyList.length > 0 ? (
                <>
                  <div
                    className={styles1.unitFont}
                    style={{ marginBottom: '1vh' }}
                  >
                    (百万元)
                  </div>
                  {prodLineDesc && (
                    <Detail2DualAxes
                      key={count}
                      finalPerTotal={
                        selectYieldAnalysisData2
                          ? selectYieldAnalysisData2.finalPerTotal
                          : -1
                      }
                      firstPerTotal={
                        selectYieldAnalysisData2
                          ? selectYieldAnalysisData2.firstPerTotal
                          : -1
                      }
                      prodLineDesc={prodLineDesc}
                      productAnalyList={
                        selectYieldAnalysisData2
                          ? selectYieldAnalysisData2.productAnalyList
                          : []
                      }
                    />
                  )}
                  <ul className={styles1.legend1}>
                    {legendCard1.map((item) => {
                      return (
                        <li key={item.name}>
                          <div style={{ background: item.color }} />
                          <span>{item.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : (
                <>
                  {showEmpty && (
                    <div
                      style={{
                        width: '100%',
                        height: '188px',
                      }}
                    >
                      <Empty src={require('../../assets/icons/no-data.svg')}>
                        当前工段未上传良率数据，暂无信息
                      </Empty>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <Loading style={{ height: '30vh', width: '90vw' }} />
          )}
        </Card>
      </div>
    </>
  )
}
