import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'

import { PaginationTable } from '../../components/table/PaginationTable'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint } from '../../utils/index'
export function DetailTable(props) {
  const request = useRequest<{
    total: number
    current: number
    records: {
      entity: string // '江苏'
      ouputQty: number // 68.12
      planQty: number // 21.3
      capacityAchievemenTrate: number // 320
      modelNum: number // 'L300N137B'
      capacityUtilization: string | number //  'Infinity'
    }[]
  }>('/productioninfo/selectProductionInfoDetails')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState('planQty')
  const entity = props.entity
  const title = props.title
  const isGWH = props.isGWH
  const factoryStage = props.factoryStage

  useEffect(() => {
    if (isGWH) {
      setOrderBy('planQtyWh')
    } else {
      setOrderBy('planQty')
    }
  }, [isGWH, setOrderBy])

  const loadMore = useCallback(
    (pageNo: number) => {
      return request({
        pageNo,
        entity: entity === '' ? factoryStage : entity,
        sort,
        orderBy,
        factoryStage: entity === '' ? '' : factoryStage,
      })
    },
    [request, entity, sort, orderBy, factoryStage]
  )
  const { user } = useCurrentApp()
  const { dateType } = user

  return (
    <PaginationTable
      title={title}
      orderBy={orderBy}
      sort={sort}
      onChange={(state) => {
        setSort(state.sort)
        setOrderBy(state.orderBy)
        let str
        if (state.orderBy === 'planQty') {
          str = '计划产能'
        } else if (state.orderBy === 'ouputQty') {
          str = '实际产能'
        } else if (state.orderBy === 'capacityAchievemenTrate') {
          str = '产能达成率'
        }
        if (state.orderBy === orderBy) {
          // 事件埋点
          sendBuriedPoint(
            '关注',
            'metrics/metricsofmanufacturing/detail',
            '排序',
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            `生产   ${str} ${sort === 'desc' ? '升序' : '降序'}`
          )
        } else {
          // 事件埋点
          sendBuriedPoint(
            '关注',
            'metrics/metricsofmanufacturing/detail',
            '排序',
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            `生产 ${str} ${sort === 'desc' ? '降序' : '升序'}`
          )
        }
      }}
      columns={[
        {
          name: 'modelNum',
          label: '产品型号',
        },
        {
          name: isGWH ? 'planQtyWh' : 'planQty',
          label: '计划产能',
          sortable: true,
        },
        {
          name: isGWH ? 'ouputQtyWh' : 'ouputQty',
          label: '实际产能',
          sortable: true,
        },
        {
          name: 'capacityAchievemenTrate',
          label: '产能达成率',
          sortable: true,
          render: (data) => {
            const value = isGWH
              ? data.capacityAchievemenTrateWh
              : data.capacityAchievemenTrate
            return parseFloat(value).toFixed(2) == 'Infinity'
              ? '/'
              : parseFloat(value).toFixed(2) == 'NaN'
              ? '/'
              : parseFloat(value).toFixed(2) + '%'
          },
        },
      ]}
      loadMore={loadMore}
    />
  )
}
