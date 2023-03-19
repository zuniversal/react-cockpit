import { Mix, Pie, G2 } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import { Button, Card, ErrorBlock } from 'antd-mobile'
import { RightOutline, ExclamationCircleOutline } from 'antd-mobile-icons'
import moment from 'moment'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../components/helmet'
import { Loading } from '../../components/loading/Loading'
import { Pagination } from '../../components/pagination'
import { SegmentedControls } from '../../components/tabs/SegmentedControls'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { useRequest } from '../../hooks/useRequest'
import { removeNegativeData, sendBuriedPoint, sendPagePoint } from '../../utils'

import style from './Detail.module.less'
import { SalesDualAxes } from './DetailDualAxes'
import styles1 from './index.module.less'

const pieColors = [
  '#6E94F2',
  '#5FCABB',
  '#707E9D',
  '#5D6C8F',
  '#766BF5',
  '#A098F9',
  '#E39F39',
  '#E4B36A',
  '#EEC78D',
  '#D0DCFA',
  '#FAD0EE',
  '#F9B0FF',
  '#F479FF',
  '#FF7979',
  '#6B48FF',
]
function CustomPie({
  applicationArea,
  InitData,
  chooseName,
  visibleSaleType,
}: any) {
  const { navigateToDetail } = useCurrentApp()

  // const [isOpen, setIsOpen] = useState(false)
  // let isShow //查看更多/点击收起 按钮是否展示
  // if (InitData.length < 5) {
  //   isShow = false
  // } else {
  //   isShow = true
  // }
  // const data = useMemo(() => {
  //   const temp = []
  //   if (InitData.length < 5) {
  //     // isShow = false
  //     // 原数组长度小于5，则全取出来展示
  //     InitData.slice(0, InitData.length).forEach((element) => {
  //       temp.push(element)
  //     })
  //   } else {
  //     // isShow = true
  //     if (isOpen) {
  //       InitData.slice(0, InitData.length).forEach((element) => {
  //         temp.push(element)
  //       })
  //     } else {
  //       InitData.slice(0, 4).forEach((element) => {
  //         temp.push(element)
  //       })
  //     }
  //   }
  //   return temp
  // }, [isOpen])

  const windowWidth = useWindowWidth()

  return (
    <Card
      title={chooseName === '' ? '交付类型' : `交付类型-${chooseName}`}
      extra={
        <div>
          <ExclamationCircleOutline color="#678EF2" />
          <span
            style={{
              fontFamily: 'PingFang SC',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: 11,
              textAlign: 'center',
              color: 'rgba(0, 0, 0, 0.45)',
              marginLeft: 5,
            }}
          >
            点击数据各类别可展示明细
          </span>
        </div>
      }
    >
      <div>
        <div
          style={{
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '25vw', color: '#9D9D9D' }} />
            <div
              style={{
                width: 7,
                marginRight: 10,
                height: 7,
                borderRadius: 7,
              }}
            />
            <div style={{ width: '23vw', color: '#9D9D9D' }}>类别</div>
            <div
              style={{
                fontWeight: 500,
                color: '#9D9D9D',
                width: '10vw',
              }}
            >
              占比
            </div>
          </div>

          <div
            style={{
              fontWeight: 500,
              fontSize: 13,
              textAlign: 'right',
              color: '#9D9D9D',
            }}
          >
            {visibleSaleType === 'salesQuantity'
              ? '销售量(Mwh)'
              : '销售额(百万元)'}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {(() => {
          return (
            <>
              <div
                style={{
                  width: '20vw',
                  marginRight: 20,
                  position: 'relative',
                  zIndex: 103,
                }}
              >
                <Pie
                  {...{
                    autoFit: true,
                    appendPadding: 0,
                    width: windowWidth * 0.2,
                    height: windowWidth * 0.2,
                    data: InitData,
                    angleField: 'value',
                    colorField: 'type',
                    color: pieColors,
                    padding: [0, 0, 0, 0],
                    radius: 0.9,
                    innerRadius: 0.6,
                    tooltip: false,
                    label: false,
                    statistic: false,
                    legend: false,
                  }}
                />
              </div>
              <div>
                {Array.from({ length: InitData.length }, (v, key) => {
                  const item = InitData[key]
                  const color = pieColors[key % pieColors.length]
                  let percent = item.percent
                  if (isNaN(percent)) {
                    percent = 0
                  }
                  const percentString = percent.toFixed(0)
                  return (
                    <div
                      key={key}
                      style={{
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onClick={() => {
                        // 事件埋点
                        sendBuriedPoint(
                          '关注',
                          'metrics/metricsofsales/detail',
                          '维度切换',
                          moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                          `销售额 支付类型详情`
                        )

                        navigateToDetail({
                          applicationArea,
                          view: 'table',
                          deliveryType: item.type,
                        })
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            marginRight: 10,
                            height: 7,
                            borderRadius: 7,
                            backgroundColor: color,
                          }}
                        />
                        <div style={{ width: '23vw' }}>{item.type}</div>
                        <div
                          style={{
                            width: '10vw',
                            fontWeight: 500,
                            color: '#9D9D9D',
                          }}
                        >
                          {percentString}%
                        </div>
                      </div>

                      <div
                        style={{
                          width: '25vw',
                          fontWeight: 500,
                          fontSize: 13,
                          textAlign: 'right',
                        }}
                      >
                        <span style={{ paddingRight: 5 }}>{item.value}</span>
                        <RightOutline color="#9D9D9D" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )
        })()}
      </div>
      {/* {isShow && !isOpen && (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              marginTop: '2vh',
              color: '#9D9D9D',
            }}
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <span style={{ marginRight: 5 }}> 查看更多</span>
            <DownOutline />
          </div>
        )}
        {isShow && isOpen && (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              marginTop: '2vh',
              color: '#9D9D9D',
            }}
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <span style={{ marginRight: 5 }}> 点击收起</span>
            <UpOutline />
          </div>
        )} */}
    </Card>
  )
}

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

  // 页面埋点
  const { user, indicator } = useCurrentApp()
  const { chooseDate, dateType, token } = user
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
          applicationArea === '' ? '销售额' : `销售额-${applicationArea}`,
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
          pageNo,
          applicationArea,
        }),
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        requestUrl: '/saleForecast/selectSaleDetails',
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

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query({ pageNo, applicationArea })
  }, [query, pageNo, applicationArea])
  // console.log(SaleDetailsData)

  /*柱状图+折线图混合图相关数据*/
  // 柱状图数据
  const columnData = useMemo(() => {
    const temp = []
    if (SaleDetailsData) {
      // 客户维度
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
      // 基地维度
      else if (tabKey == '2') {
        try {
          setPages(SaleDetailsData.entitySaleDetailPage.pageEntityList.pages)
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

  // 折线图数据
  const lineData = useMemo(() => {
    const temp = []
    if (SaleDetailsData) {
      if (tabKey == '1') {
        try {
          SaleDetailsData.customerSaleDetailPage.pageCustomerList.records.map(
            (item, index) => {
              temp.push({
                company: item.groupCustomer,
                销售量: item.salesQuantity,
              })
            }
          )
        } catch (error) {
          // console.log(error)
        }
      } else if (tabKey == '2') {
        try {
          SaleDetailsData.entitySaleDetailPage.pageEntityList.records.map(
            (item, index) => {
              temp.push({
                company: item.entity,
                销售量: item.salesQuantity,
              })
            }
          )
        } catch (error) {
          // console.log(error)
        }
      }
    }
    return temp
  }, [SaleDetailsData, tabKey])
  const [CardKey, setCardKey] = useState(0)
  const isGraphLoading = !SaleDetailsData
  if (error) {
    return <ErrorBlock status="default" description={error.message} />
  }
  return (
    <>
      <HeadTitle>
        {applicationArea === '' ? '销售额' : `销售额-${applicationArea}`}
      </HeadTitle>

      <div>
        <Card
          headerStyle={{ borderBottom: 'none' }}
          key={CardKey}
          extra={
            <div style={{}}>
              <Button
                style={{
                  '--background-color': '#F4F6F9',
                  '--border-radius': '20px',
                  fontSize: '11px',
                  paddingTop: 4,
                  paddingBottom: 4,
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
                    src={require('../../assets/icons/switch.svg')}
                  />
                  {visibleSaleType === 'salesQuantity' ? '销售量' : '销售额'}
                </div>
              </Button>
            </div>
          }
        >
          <div style={{ marginTop: -50, marginBottom: 20 }}>
            <SegmentedControls
              className={style.detailTop}
              tabs={[
                { title: '客户', key: '1' },
                { title: '基地', key: '2' },
              ]}
              defaultActiveKey={tabKey}
              onChange={(key) => {
                // 事件埋点
                sendBuriedPoint(
                  '关注',
                  'metrics/metricsofsales/detail',
                  '维度切换',
                  moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  `销售额 ${key === '1' ? '客户' : '基地'}`
                )

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

          <div
            className={styles1.unitFont}
            style={{ justifyContent: 'space-between' }}
          >
            <span>
              {visibleSaleType === 'salesQuantity' ? '(Mwh)' : '(百万元)'}
            </span>
            <span>(Mwh)</span>
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
                <SalesDualAxes
                  columnData={columnData}
                  lineData={lineData}
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

          <Pagination total={pages} current={pageNo} onChange={setPageNo} />
        </Card>
        <div style={{ height: 10 }} />
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!data1 ? (
              <Loading style={{ height: '40vw' }} />
            ) : (
              <CustomPie
                applicationArea={applicationArea}
                chooseName={chooseName}
                visibleSaleType={visibleSaleType}
                InitData={removeNegativeData({
                  data: data1,
                  angleField: 'value',
                  colorField: 'type',
                })}
              />
            )}
          </div>
        </Card>
      </div>
    </>
  )
}
