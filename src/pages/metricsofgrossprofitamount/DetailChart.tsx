import { Mix, Pie } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import { Card, ErrorBlock } from 'antd-mobile'
import {
  RightOutline,
  ExclamationCircleOutline,
  DownOutline,
  UpOutline,
} from 'antd-mobile-icons'
import React, { useState, useEffect, useMemo } from 'react'
import { useMatch, useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../components/helmet'
import { Loading } from '../../components/loading/Loading'
import { Pagination } from '../../components/pagination'
import { Table } from '../../components/table'
import { SegmentedControls } from '../../components/tabs/SegmentedControls'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { useRequest } from '../../hooks/useRequest'
import { removeNegativeData, sendPagePoint } from '../../utils'
import style from './Detail.module.less'
import { GrossprofitColumn } from './DetailColumn'
import { DetailTable } from './DetailTable'
import styles1 from './index.module.less'
import { sendBuriedPoint } from '../../utils/index'
import moment from 'moment'
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
  Data,
  InitData,
  chooseName,
  applicationArea,
  segmentKey,
}: any) {
  // const [isOpen, setIsOpen] = useState(false)
  // let isShow //查看更多/点击收起 按钮是否展示
  // if (Data.length < 5) {
  //   isShow = false
  // } else {
  //   isShow = true
  // }
  // const data = useMemo(() => {
  //   const temp = []
  //   if (Data.length < 5) {
  //     isShow = false
  //     // 原数组长度小于5，则全取出来展示
  //     Data.slice(0, Data.length).forEach((element) => {
  //       temp.push(element)
  //     })
  //   } else {
  //     isShow = true
  //     if (isOpen) {
  //       Data.slice(0, Data.length).forEach((element) => {
  //         temp.push(element)
  //       })
  //     } else {
  //       Data.slice(0, 4).forEach((element) => {
  //         temp.push(element)
  //       })
  //     }
  //   }
  //   return temp
  // }, [isOpen])
  const windowWidth = useWindowWidth()
  const { navigateToDetail } = useCurrentApp()
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
            毛利额(百万元)
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
                    data: Data,
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
                    if (percent != '/') {
                      percent = 0
                    }
                  }
                  const percentString =
                    percent == '/' ? '/' : percent.toFixed(0)
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
                          'metrics/metricsofgrossprofitamount/detail',
                          '维度切换',
                          moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                          `毛利额 支付类型详情`
                        )

                        navigateToDetail({
                          applicationArea,
                          view: 'table',
                          deliveryType: item.type,
                          segmentKey,
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
                          {percentString == '/' ? '/' : percentString + '%'}
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
    tabKey,
    setTabKey,
    key1,
    setKey1,
    chooseName,
    data1,
    segmentKey,
  } = props

  const [search] = useSearchParams()
  const applicationArea = search.get('applicationArea') ?? ''
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
          applicationArea === '' ? '毛利额-总额' : `毛利额-${applicationArea}`,
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
          pageNo,
          applicationArea,
        }),
        requestUrl: '/grossProfit/selectGrossProfitDetails',
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
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
  //毛利额明细柱状图
  const {
    error,
    data: selectGrossProfitDetailsData,
    query,
  } = useQuery('/grossProfit/selectGrossProfitDetails')
  const [pageNo, setPageNo] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    const orderBy = key1 == '1' ? 'grossProfitStandard' : 'grossProfitActual'
    query({ pageNo, applicationArea, orderBy })
  }, [query, pageNo, applicationArea, key1])
  // console.log(selectGrossProfitDetailsData)

  // 柱状图数据
  const columnData = useMemo(() => {
    const temp = []
    if (selectGrossProfitDetailsData) {
      // 客户维度
      if (tabKey == '1') {
        try {
          setPages(
            selectGrossProfitDetailsData.customerGrossProfitDetailPage
              .pageCustomerList.pages
          )
          if (key1 == '1') {
            selectGrossProfitDetailsData.customerGrossProfitDetailPage.pageCustomerList.records.map(
              (item, index) => {
                temp.push({
                  company: item.groupCustomer,
                  value: item.grossProfitStandard,
                })
              }
            )
          } else {
            selectGrossProfitDetailsData.customerGrossProfitDetailPage.pageCustomerList.records.map(
              (item, index) => {
                temp.push({
                  company: item.groupCustomer,
                  value: item.grossProfitActual,
                })
              }
            )
          }
        } catch (error) {
          //console.log(error)
        }
      }
      // 基地维度
      else if (tabKey == '2') {
        try {
          setPages(
            selectGrossProfitDetailsData.entityGrossProfitDetailPage
              .pageEntityList.pages
          )
          if (key1 == '1') {
            selectGrossProfitDetailsData.entityGrossProfitDetailPage.pageEntityList.records.map(
              (item, index) => {
                temp.push({
                  company: item.entity,
                  value: item.grossProfitStandard,
                })
              }
            )
          } else {
            selectGrossProfitDetailsData.entityGrossProfitDetailPage.pageEntityList.records.map(
              (item, index) => {
                temp.push({
                  company: item.entity,
                  value: item.grossProfitActual,
                })
              }
            )
          }
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp
  }, [selectGrossProfitDetailsData, key1, tabKey])

  const isGraphLoading = !selectGrossProfitDetailsData
  const isTableLoading = false

  if (error) {
    return <ErrorBlock status="default" description={error.message} />
  }

  return (
    <>
      <HeadTitle>
        {applicationArea ? `毛利额-${applicationArea}` : '毛利额'}
      </HeadTitle>

      <div>
        <Card>
          <SegmentedControls
            className={style.detailTop}
            tabs={[
              { title: '客户', key: '1' },
              { title: '基地', key: '2' },
            ]}
            defaultActiveKey={tabKey}
            onChange={(key) => {
              setTabKey(key)
              setPageNo(1)

              // 事件埋点
              sendBuriedPoint(
                '关注',
                'metrics/metricsofgrossprofitamount/detail',
                '维度切换',
                moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                `毛利额 ${key === '1' ? '客户' : '基地'}`
              )
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
          <div className={styles1.unitFont}>
            <span>(百万元)</span>
          </div>
          <div>
            {!isGraphLoading && (
              <div
                style={{
                  height: '34.78vh',
                  width: '90vw',
                  position: 'relative',
                  zIndex: 103,
                }}
              >
                <GrossprofitColumn
                  chooseName={chooseName}
                  columnData={columnData}
                  tabKey={tabKey}
                  setChooseName={setChooseName}
                  setChooseNameType={setChooseNameType}
                  setTableTitle={setTableTitle}
                  key={tabKey}
                />
              </div>
            )}

            {isGraphLoading && (
              <Loading style={{ height: '34.78vh', width: '90vw' }} />
            )}
          </div>

          <Pagination total={pages} current={pageNo} onChange={setPageNo} />
        </Card>
        <div style={{ marginTop: 10 }} />
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
                InitData={data1}
                Data={removeNegativeData({
                  data: data1,
                  angleField: 'value',
                  colorField: 'type',
                })}
                segmentKey={segmentKey}
              />
            )}
          </div>
        </Card>
        {/* {!isTableLoading && (
          <DetailTable
            title={title}
            chooseNameType={chooseNameType}
            chooseName={chooseName}
          />
        )} */}
      </div>
    </>
  )
}
