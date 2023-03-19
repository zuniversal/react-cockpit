import { Mix, Pie, G2 } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import { Button, Card, ErrorBlock } from 'antd-mobile'
import { RightOutline, ExclamationCircleOutline } from 'antd-mobile-icons'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../components/helmet'
import { Loading } from '../../components/loading/Loading'
import { SegmentedControls } from '../../components/tabs/SegmentedControls'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { useRequest } from '../../hooks/useRequest'
import style from './Detail.module.less'
import { LosscostDualAxes } from './DetailDualAxes'
import { LosscostLine } from './Line'
import styles1 from './index.module.less'

export function DetailChart(props) {
  const {
    setChooseName,
    setChooseNameType,
    setTableTitle,
    setVisibleSaleType,
    tabKey,
    setTabKey,
    chooseName,
    visibleSaleType,
    data1,
  } = props

  const [search, setSearch] = useSearchParams()
  const applicationArea = search.get('applicationArea') ?? ''
  //销售额明细柱状图
  const {
    error,
    data: SaleDetailsData,
    query,
  } = useQuery('/saleForecast/selectSaleDetails')
  const [pageNo, setPageNo] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query({ pageNo, applicationArea })
  }, [query, pageNo, applicationArea])

  /*柱状图+折线图混合图相关数据*/
  // 柱状图数据
  const columnData = useMemo(() => {
    const temp = []
    if (SaleDetailsData) {
      // 损耗金额
      if (tabKey == '1') {
        try {
          setPages(
            SaleDetailsData.customerSaleDetailPage.pageCustomerList.pages
          )
          SaleDetailsData.customerSaleDetailPage.pageCustomerList.records.map(
            (item, index) => {
              if (visibleSaleType === 'salesVolume') {
                temp.push({
                  company: item.groupCustomer,
                  value: item.salesVolume,
                  name: '销售额',
                })
              } else {
                temp.push({
                  company: item.groupCustomer,
                  value: item.salesQuantity,
                  name: '销售量',
                })
              }
            }
          )
        } catch (error) {
          // console.log(error)
        }
      }
      // 单位损耗
      else if (tabKey == '2') {
        try {
          // setPages(SaleDetailsData.entitySaleDetailPage.pageEntityList.pages)
          SaleDetailsData.entitySaleDetailPage.pageEntityList.records.map(
            (item, index) => {
              if (visibleSaleType === 'salesVolume') {
                temp.push({
                  company: item.entity,
                  value: item.salesVolume,
                  name: '销售额',
                })
              } else {
                temp.push({
                  company: item.entity,
                  value: item.salesQuantity,
                  name: '销售量',
                })
              }
            }
          )
        } catch (error) {
          // console.log(error)
        }
      }
    }
    return temp
  }, [SaleDetailsData, visibleSaleType, tabKey])
  // console.log(columnData)
  // console.log(SaleDetailsFormData)

  const [CardKey, setCardKey] = useState(0)
  const isGraphLoading = !SaleDetailsData
  if (error) {
    return <ErrorBlock status="default" description={error.message} />
  }
  return (
    <>
      <HeadTitle>
        {applicationArea === '' ? '损耗成本' : `损耗成本-${applicationArea}`}
      </HeadTitle>

      <div>
        <Card
          headerStyle={{ borderBottom: 'none' }}
          key={CardKey}
          extra={
            <div style={{}}>
              <Button
                style={{
                  '--border-radius': '20px',
                  fontSize: '11px',
                  paddingTop: 4,
                  paddingBottom: 4,
                  color: '#678EF2',
                }}
                onClick={() => {
                  setVisibleSaleType(
                    visibleSaleType === 'salesQuantity'
                      ? 'salesVolume'
                      : 'salesQuantity'
                  )
                  setCardKey(CardKey + 1)
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <img
                    style={{ width: 12, height: 12, marginRight: 4 }}
                    src={require('../../assets/icons/switch10.svg')}
                  />
                  {visibleSaleType === 'salesQuantity' ? '后10名' : '前10名'}
                </div>
              </Button>
            </div>
          }
        >
          <div style={{ marginTop: -50, marginBottom: 20 }}>
            <SegmentedControls
              className={style.detailTop}
              tabs={[
                { title: '损耗金额', key: '1' },
                { title: '单位损耗', key: '2' },
              ]}
              defaultActiveKey={tabKey}
              onChange={(key) => {
                setTabKey(key)
                setPageNo(1)
                if (key == '1') {
                  setTableTitle('全部')
                  setChooseName('')
                  setChooseNameType('')
                } else if (key == '2') {
                  setTableTitle('全部')
                  setChooseName('')
                  setChooseNameType('')
                }
              }}
            />
          </div>

          <div className={styles1.unitFont}>
            <span>{tabKey == '1' ? '(万元)' : '(元/Kwh)'}</span>
          </div>
          <div>
            {!isGraphLoading && (
              <div
                style={{
                  height: '70vw',
                  width: '90vw',
                  position: 'relative',
                  zIndex: 103,
                }}
              >
                <LosscostDualAxes
                  columnData={columnData}
                  tabKey={tabKey}
                  chooseName={chooseName}
                  setChooseName={setChooseName}
                  setChooseNameType={setChooseNameType}
                  setTableTitle={setTableTitle}
                  key={tabKey}
                  visibleSaleType={visibleSaleType}
                />
              </div>
            )}
            {isGraphLoading && (
              <Loading style={{ height: '70vw', width: '90vw' }} />
            )}
          </div>
        </Card>
        <div style={{ height: 10 }} />
        <Card title="近12月损耗分析">
          <LosscostLine />
        </Card>
      </div>
    </>
  )
}
