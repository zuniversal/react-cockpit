import { Button, Card, ErrorBlock } from 'antd-mobile'

import moment from 'moment'
import { useState, useEffect, useMemo } from 'react'

import { useSearchParams } from 'react-router-dom'

import empty from '../../assets/icons/no-data.svg'
import { HeadTitle } from '../../components/helmet'
import { Loading } from '../../components/loading/Loading'
import { SegmentedControls } from '../../components/tabs/SegmentedControls'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint, sendPagePoint } from '../../utils/index'
import { Empty } from '../empty/index'
import style from './Detail.module.less'
import { Detail1DualAxes } from './DetailDualAxes1'
import { Detail2DualAxes } from './DetailDualAxes2'
import styles1 from './index.module.less'

export function DetailChart(props) {
  const [search] = useSearchParams()
  const type1 = search.get('type1') ?? ''
  const typeNum = search.get('typeNum') ?? ''
  const segmentKey1 = search.get('segmentKey1') ?? ''
  const deliveryType = search.get('deliveryType') ?? ''
  const [target, setTarget] = useState('')
  const [target1, setTarget1] = useState('')
  const { user, indicator } = useCurrentApp()
  const { chooseDate, dateType, token } = user
  // 顶部切换卡片内容
  const [segmentKey, setSegmentedControlsActiveKey] = useState('1')
  const [type2, setType2] = useState('a')

  const [pageNo, setPageNo] = useState(1)
  const [pages, setPages] = useState(1)
  // 页面埋点
  const applicationArea = search.get('applicationArea') ?? ''
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
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName:
          applicationArea === '' ? '产品成本' : `产品成本-${applicationArea}`,
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
          pageNo,
          applicationArea,
        }),
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        requestUrl: '/productcost/selectProductCostClassify',
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出DetailMode页面')
    }
  }, [])

  //产品成本
  const {
    error: error1,
    data,
    query: query1,
  } = useQuery('/productcost/selectProductCostClassify')

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query1({ type1, type2, typeNum, deliveryType })
  }, [query1, type2])

  const { productCostList: ProductCostData } = data || { productCostList: [] }

  useEffect(() => {
    if (ProductCostData) {
      try {
        if (ProductCostData.length > 0) {
          if (ProductCostData[0].applicationArea) {
            setTarget(ProductCostData[0].applicationArea)
            setTarget1(ProductCostData[0].applicationArea)
          } else if (ProductCostData[0].groupCustomer) {
            setTarget(ProductCostData[0].groupCustomer)
            setTarget1(ProductCostData[0].groupCustomer)
          }
        }
      } catch (error) {}
    }
  }, [ProductCostData])

  //产品成本趋势
  const {
    error: error2,
    data: ProductCostTrendData,
    query: query2,
  } = useQuery('/productcost/selectProductCostTrend')

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    if (target !== '') {
      query2({
        type1,
        productName: typeNum,
        type: type2,
        typeNum: target,
        deliveryType,
      })
    }
  }, [query2, target, type2])

  /* 产品成本 */
  // 柱状图数据
  const uvData1 = useMemo(() => {
    const temp = []
    if (ProductCostData) {
      // 应用领域
      if (segmentKey === '1') {
        // 报价成本
        if (segmentKey1 === '1') {
          try {
            ProductCostData.map((item) => {
              temp.push({
                target: item.applicationArea,
                type: '单位材料成本',
                value: item.unitMaterialCostStandard,
              })
              temp.push({
                target: item.applicationArea,
                type: '单位全成本',
                value: item.unitTotalCost,
              })
              temp.push({
                target: item.applicationArea,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostStandard,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
        // 实际成本
        else if (segmentKey1 === '2') {
          try {
            ProductCostData.map((item) => {
              temp.push({
                target: item.applicationArea,
                type: '单位材料成本',
                value: item.unitMaterialCostActual,
              })
              temp.push({
                target: item.applicationArea,
                type: '单位全成本',
                value: item.costActual,
              })
              temp.push({
                target: item.applicationArea,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostActual,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
      }
      // 客户
      else if (segmentKey == '2') {
        // 报价成本
        if (segmentKey1 === '1') {
          try {
            ProductCostData.map((item) => {
              temp.push({
                target: item.groupCustomer,
                type: '单位材料成本',
                value: item.unitMaterialCostStandard,
              })
              temp.push({
                target: item.groupCustomer,
                type: '单位全成本',
                value: item.unitTotalCost,
              })
              temp.push({
                target: item.groupCustomer,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostStandard,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
        // 实际成本
        else if (segmentKey1 === '2') {
          try {
            ProductCostData.map((item) => {
              temp.push({
                target: item.groupCustomer,
                type: '单位材料成本',
                value: item.unitMaterialCostActual,
              })
              temp.push({
                target: item.groupCustomer,
                type: '单位全成本',
                value: item.costActual,
              })
              temp.push({
                target: item.groupCustomer,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostActual,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
      }
    }
    return temp
  }, [ProductCostData, segmentKey, segmentKey1])

  // 折线图数据
  const transformData1 = useMemo(() => {
    const temp = []
    if (ProductCostData) {
      // 应用领域
      if (segmentKey === '1') {
        try {
          ProductCostData.map((item) => {
            temp.push({
              target: item.applicationArea,
              name: '市场售价',
              price: item.marketPrice,
            })
            temp.push({
              target: item.applicationArea,
              name: '公司售价',
              price: item.companySellingPrice,
            })
          })
        } catch (error) {
          //console.log(error)
        }
      }
      // 客户
      else if (segmentKey === '2') {
        try {
          ProductCostData.map((item) => {
            temp.push({
              target: item.groupCustomer,
              name: '市场售价',
              price: item.marketPrice,
            })
            temp.push({
              target: item.groupCustomer,
              name: '公司售价',
              price: item.companySellingPrice,
            })
          })
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp
  }, [ProductCostData, segmentKey])

  /* 产品成本趋势 */
  // 柱状图数据
  const uvData2 = useMemo(() => {
    const temp = []
    if (ProductCostTrendData) {
      // 应用领域
      if (segmentKey === '1') {
        // 报价成本
        if (segmentKey1 === '1') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostStandard,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.unitTotalCost,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostStandard,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
        // 实际成本
        else if (segmentKey1 === '2') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.costActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostActual,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
      }
      // 客户
      else if (segmentKey == '2') {
        // 报价成本
        if (segmentKey1 === '1') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostStandard,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.unitTotalCost,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostStandard,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
        // 实际成本
        else if (segmentKey1 === '2') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.costActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostActual,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
      }
    }
    return temp
  }, [ProductCostTrendData, segmentKey, segmentKey1])
  // 折线图数据
  const transformData2 = useMemo(() => {
    const temp = []
    if (ProductCostTrendData) {
      // 应用领域
      // if (segmentKey === '1') {
      try {
        ProductCostTrendData.map((item) => {
          temp.push({
            time: item.eachMonth,
            name: '市场售价',
            price: item.marketPrice,
          })
          temp.push({
            time: item.eachMonth,
            name: '公司售价',
            price: item.companySellingPrice,
          })
        })
      } catch (error) {
        //console.log(error)
      }
      // }
      // // 客户
      // else if (segmentKey === '2') {
      //   try {
      //     ProductCostTrendData.map((item) => {
      //       temp.push({
      //         time: item.eachMonth,
      //         name: '市场售价',
      //         price: item.marketPrice,
      //       })
      //       temp.push({
      //         time: item.eachMonth,
      //         name: '公司售价',
      //         price: item.companySellingPrice,
      //       })
      //     })
      //   } catch (error) {
      //     //console.log(error)
      //   }
      // }
    }
    return temp
  }, [ProductCostTrendData])

  return (
    <>
      <HeadTitle>
        {typeNum === '' ? '产品成本' : `产品成本-${typeNum}`}
      </HeadTitle>
      <Card>
        <SegmentedControls
          className={style.detailTop}
          activeKey={segmentKey}
          onChange={(key) => {
            // 事件埋点
            sendBuriedPoint(
              '关注',
              'metrics/metricsofproductcosts/detail',
              '维度切换',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `产品成本 ${key === '1' ? '应用领域' : '客户'}`
            )
            setSegmentedControlsActiveKey(key)
            if (key == '1') {
              setType2('a')
            } else {
              setType2('b')
            }
          }}
          tabs={[
            { key: '1', title: '应用领域' },
            { key: '2', title: '客户' },
          ]}
        />

        <div className={styles1.unitFont} style={{ marginBottom: '1vh' }}>
          (元/Kwh)
        </div>
        <div
          style={{
            height: '34.78vh',
            width: '90vw',
            position: 'relative',
            zIndex: 103,
          }}
        >
          {data === null ? (
            <Loading style={{ height: '25vh', width: '90vw' }} />
          ) : (
            <>
              {ProductCostData.length > 0 ? (
                <Detail1DualAxes
                  uvData1={uvData1}
                  transformData1={transformData1}
                  setTarget={setTarget}
                  target={target}
                  target1={target1}
                />
              ) : (
                <Empty src={empty} marginTop="70">
                  暂无数据
                </Empty>
              )}
            </>
          )}
        </div>
      </Card>
      <Card
        title={
          target === '' ? '近十二月成本分析' : `近十二月成本分析-${target}`
        }
        style={{ marginTop: '10px' }}
      >
        <div className={styles1.unitFont} style={{ marginBottom: '1vh' }}>
          (元/Kwh)
        </div>
        <div
          style={{
            height: '34.78vh',
            width: '90vw',
            position: 'relative',
            zIndex: 103,
          }}
        >
          {ProductCostTrendData === null ? (
            <Loading style={{ height: '25vh', width: '90vw' }} />
          ) : (
            <>
              {ProductCostTrendData.length > 0 ? (
                <Detail2DualAxes
                  uvData2={uvData2}
                  transformData2={transformData2}
                />
              ) : (
                ''
              )}
            </>
          )}
        </div>
      </Card>
    </>
  )
}
