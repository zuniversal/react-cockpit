import moment from 'moment'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PaginationTable } from '../../components/table/PaginationTable'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint } from '../../utils/index'
export function DetailTable(props) {
  const { title, chooseName, chooseNameType, token } = props
  const request = useRequest<{
    total: number
    current: number
    records: {
      projectName: string
      demandDeliveryPersent: string
      factoryActualQty: number
    }[]
  }>('/customerDemandDelivery/selectCustomerDemandDeliveryForm')
  const [searchParams] = useSearchParams()
  const type = searchParams.get('applicationArea') ?? ''
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  // const [orderBy, setOrderBy] = useState('demandDeliveryPersent')
  const [orderBy, setOrderBy] = useState('demandDeliveryPersentDouble')
  const loadMore = useCallback(
    (pageNo: number) => {
      return request({
        sort,
        orderBy,
        pageNo,
        type,
        chooseName,
        chooseNameType,
      })
    },
    [request, type, sort, orderBy, chooseName, chooseNameType]
  )

  return (
    <PaginationTable
      orderBy={orderBy}
      title={title}
      key={`${chooseNameType},${chooseName}`}
      sort={sort}
      onChange={(state) => {
        if (state.orderBy === orderBy) {
          // 事件埋点
          sendBuriedPoint(
            '关注',
            'metrics/metricsofdeliveryreached/detail',
            '排序',
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            `发货量  ${
              orderBy === 'factoryActualQty' ? '发货量顺序' : '发货达成率顺序'
            } ${sort === 'desc' ? '升序' : '降序'}`
          )
        } else {
          // 事件埋点
          sendBuriedPoint(
            '关注',
            'metrics/metricsofdeliveryreached/detail',
            '排序',
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            `发货量 ${
              orderBy === 'factoryActualQty' ? '发货达成率顺序' : '发货量顺序'
            } ${sort === 'desc' ? '降序' : '升序'}`
          )
        }

        setSort(state.sort)
        setOrderBy(state.orderBy)
      }}
      columns={[
        {
          name: 'projectName',
          label: '客户项目',
        },
        {
          name: 'factoryActualQty',
          sortable: true,
          label: '发货量',
          renderColumnHeader: (column) => column.label + '(Gwh)',
        },
        {
          // name: 'demandDeliveryPersent',
          name: 'demandDeliveryPersentDouble',
          sortable: true,
          label: '发货达成率',
          renderColumnHeader: (column) => column.label + '(%)',
          render: (item) => {
            return (
              (Number(item.demandDeliveryPersentDouble) * 100 || 0).toFixed(1) +
              '%'
            )
          },
        },
      ]}
      loadMore={loadMore}
    />
  )
}
