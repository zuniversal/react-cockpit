import { Button, Card, Divider, Popover } from 'antd-mobile'
import { DownOutline, DownFill } from 'antd-mobile-icons'
import { useCallback, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../components/helmet'
import { PaginationTable } from '../../components/table/PaginationTable'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint, sendPagePoint } from '../../utils/index'
import moment from 'moment'
export function DetailTable(props) {
  const { key1, chooseName, chooseNameType, segmentKey } = props
  const request = useRequest<{
    total: number
    current: number
    pages: number
    records: {
      batteryName: string
      deliveryType: string
      grossProfitActual: number
    }[]
  }>('/grossProfit/selectGrossProfitDetailsForm')
  const [searchParams] = useSearchParams()
  const applicationArea = searchParams.get('applicationArea') ?? ''
  const deliveryType1 = searchParams.get('deliveryType') ?? ''
  const [deliveryType, setDeliveryType] = useState(deliveryType1)
  const sortableColumns = props.sortableColumns
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const orderByData =
    segmentKey === '1' ? 'grossProfitStandard' : 'grossProfitActual'
  const [orderBy, setOrderBy] = useState(orderByData)

  // 页面埋点
  const { user, indicator } = useCurrentApp()
  const { chooseDate, dateType } = user

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
    console.log('进入详情页页面')
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: deliveryType ? deliveryType : '详情',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
          orderBy,
          sort,
          applicationArea,
          chooseNameType,
          chooseName,
          deliveryType,
        }),
        requestUrl: '/grossProfit/selectGrossProfitDetailsForm',
        accessDepth: 'level3',
        requestUrlReal: window.location.pathname,
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出详情页页面')
    }
  }, [])

  const loadMore = useCallback(
    (pageNo: number) => {
      return request({
        pageNo,
        applicationArea,
        sort,
        orderBy,
        chooseNameType,
        chooseName,
        deliveryType,
      })
    },
    [
      request,
      applicationArea,
      sort,
      orderBy,
      chooseNameType,
      chooseName,
      deliveryType,
      key1,
    ]
  )

  return (
    <>
      <HeadTitle>{deliveryType ? deliveryType : '详情'}</HeadTitle>
      <PaginationTable
        style={{ padding: 0 }}
        title={
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: '12px',
              paddingTop: '12px',
            }}
          >
            <Popover.Menu
              actions={sortableColumns.map((item) => ({
                key: item.deliveryType,
                text: item.deliveryType,
              }))}
              placement="bottom-start"
              onAction={(node) => {
                // 事件埋点
                sendBuriedPoint(
                  '关注',
                  'metrics/metricsofgrossprofitamount/detail',
                  '维度切换',
                  moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  `毛利额 ${node.text}`
                )
                const text = String(node.text)
                if (node.key !== deliveryType) {
                  setDeliveryType(text)
                }
              }}
              trigger="click"
            >
              <Button style={{ border: 0, fontSize: 14, color: '#373737' }}>
                {deliveryType}
                <DownOutline />
              </Button>
            </Popover.Menu>
          </div>
        }
        orderBy={orderBy}
        sort={sort}
        key={`${chooseNameType},${chooseName}`}
        onChange={(state) => {
          if (state.orderBy === orderBy) {
            console.log(orderBy)
            // 事件埋点
            sendBuriedPoint(
              '关注',
              'metrics/metricsofmanufacturing/detail',
              '排序',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `毛利额 ${orderBy === 'grossProfitActual' ? '默认' : '毛利额'} ${
                sort === 'desc' ? '升序' : '降序'
              }`
            )
          } else {
            console.log(111, orderBy)
            // 事件埋点
            sendBuriedPoint(
              '关注',
              'metrics/metricsofmanufacturing/detail',
              '排序',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `毛利额  毛利额${
                orderBy === 'grossProfitActual' ? '毛利额' : '默认'
              } ${sort === 'desc' ? '降序' : '升序'}`
            )
          }
          setSort(state.sort)
          setOrderBy(state.orderBy)
        }}
        columns={[
          {
            name: 'batteryName',
            label: '出货类型-电芯',
            render: (row) => {
              return row.deliveryType + ' ' + row.batteryName
            },
          },
          {
            name: key1 == '1' ? 'grossProfitStandard' : 'grossProfitActual',
            sortable: true,
            label: '毛利额',
            renderColumnHeader: (row) => {
              return row.label + '(百万元)'
            },
          },
        ]}
        loadMore={loadMore}
      />
    </>
  )
}
