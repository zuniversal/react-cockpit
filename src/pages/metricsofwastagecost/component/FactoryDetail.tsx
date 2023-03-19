import { Card, ErrorBlock } from 'antd-mobile'
import { useEffect, useState } from 'react'

import { useMatch, useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../../components/helmet'
import { Loading } from '../../../components/loading/Loading'

import { useQuery } from '../../../hooks/useQuery'
import { FactoryPage } from './FactoryPage'
export function FactoryDetail(props) {
  const [search, setSearch] = useSearchParams()
  const base = search.get('base') ?? ''
  const [segmentKey, setSegmentKey] = useState('电池')
  const [page1, setPage1] = useState(1)

  const {
    error: error1,
    data: data2,
    query: query1,
  } = useQuery('/lossCost/selectLossCostSecondDetailList')

  useEffect(() => {
    query1({
      level1Val: base,
      level2Val: segmentKey,
    })
  }, [base, query1, segmentKey])

  if (error1) {
    return <ErrorBlock description={error1.message} />
  }

  return (
    <>
      <HeadTitle>损耗成本-工厂详情</HeadTitle>
      <Card headerStyle={{ borderBottom: 'none' }} title="工厂概况">
        <FactoryPage
          key={Date.now()}
          segmentKey={segmentKey}
          setSegmentKey={setSegmentKey}
          data2={data2}
          page1={page1}
          setPage1={setPage1}
        />
      </Card>
    </>
  )
}
