import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PaginationTable } from '../../components/table/PaginationTable'
import { useRequest } from '../../hooks/useRequest'

export function DetailTable({
  tab,
  title,
  chooseName,
}: {
  chooseName: string
  title?: string
  tab: 'Gwh' | '万支'
}) {
  const request = useRequest<{
    total: number
    current: number
    records: {
      batteryName: string
      deliveryType: string
      grossProfitActual: number
    }[]
  }>('/storageAge/selectStorageAgeDetailsForm')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState('quantityGwh')
  const [searchParams] = useSearchParams()
  const classification = searchParams.get('classification') ?? ''

  const loadMore = useCallback(
    (pageNo: number) => {
      return request({
        pageNo,
        chooseName,
        classification,
        sort,
        orderBy,
      })
    },
    [request, classification, chooseName, sort, orderBy]
  )

  return (
    <PaginationTable
      title={title || '库存总计'}
      orderBy={orderBy}
      sort={sort}
      onChange={(state) => {
        setSort(state.sort)
        setOrderBy(state.orderBy)
      }}
      columns={[
        {
          name: 'productName',
          label: '产品型号',
        },
        {
          name: tab === 'Gwh' ? 'quantityGwh' : 'quantity',
          label: '库存量',
          sortable: true,
          renderColumnHeader: (row) => {
            return row.label + (tab === 'Gwh' ? '(Gwh)' : '(万支)')
          },
        },
        {
          name: 'amountActual',
          label: '库存金额',
          sortable: true,
          renderColumnHeader: (row) => {
            return row.label + '(百万元)'
          },
        },
      ]}
      loadMore={loadMore}
    />
  )
}
