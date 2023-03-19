import { Card, Picker, ErrorBlock } from 'antd-mobile'
import { useEffect, useMemo, useState } from 'react'

import { HeadTitle } from '../../../components/helmet'
import { Loading } from '../../../components/loading/Loading'
import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../../hooks/useQuery'
import { GroupPage } from './GroupPage'
export function BaseDetail() {
  const { navigateToDetail, user, cache, setCache } = useCurrentApp()
  const { userInfo } = user
  const { dimensionPermissionList } = userInfo
  const originList = dimensionPermissionList.find(
    (item) => item.dimensionName === '组织维'
  ).child
  const [visible, setVisible] = useState(false)

  // const [popoverValue, setPopoverValue] = useState('')
  // const [name, setName] = useState('')

  const popoverValue = cache.popoverValue ?? ''
  const setPopoverValue = (key) => setCache({ popoverValue: key })

  const name = cache.name ?? ''
  const setName = (key) => setCache({ name: key })

  const basicColumns = useMemo(() => {
    const temp = [[]]
    originList?.map((item, index) => {
      temp[0].push({
        label: item.dimensionName,
        value: item.dimensionValue,
      })
      if (index === 0 && !popoverValue && !name) {
        setPopoverValue(item.dimensionValue)
        setName(item.dimensionName)
      }
    })
    return temp
  }, [originList])

  const {
    error: error1,
    data: allData,
    query: query1,
  } = useQuery('/lossCost/selectLossCostList')

  const {
    error: error2,
    data: allData2,
    query: query2,
  } = useQuery('/lossCost/selectTrccLastSixMonthList')

  useEffect(() => {
    if (popoverValue) {
      query1({
        type: 1,
        level1Val: popoverValue,
      })
      query2({
        type: 1,
        level1Val: popoverValue,
      })
    }
  }, [query1, query2, popoverValue])

  if (error1) {
    return <ErrorBlock description={error1.message} />
  }

  if (error2) {
    return <ErrorBlock description={error2.message} />
  }

  return (
    <>
      <HeadTitle>损耗成本-基地详情</HeadTitle>
      <Card
        headerStyle={{ borderBottom: 'none' }}
        title="基地详情"
        extra={
          <div
            style={{
              color: '#4774E7',
              display: 'flex',
              alignContent: 'center',
            }}
            onClick={() => {
              setVisible(true)
            }}
          >
            {name}
            <img
              style={{ marginLeft: '4.5px' }}
              src={require('../../../assets/icons/down-arrow-1.svg')}
            />
          </div>
        }
      >
        {allData ? (
          <GroupPage
            pageTitle="损耗成本"
            detailTitle="工厂详情"
            allData={allData}
            allData2={allData2}
            key={Date.now()}
            nextPage={() => {
              navigateToDetail({
                view: 'detail',
                base: popoverValue,
              })
            }}
          />
        ) : (
          <Loading style={{ height: '90vh', width: '90vw' }} />
        )}
      </Card>

      <Picker
        columns={basicColumns}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        value={[popoverValue]}
        onConfirm={(v) => {
          setPopoverValue(v[0])
          const val = originList.find(
            (item) => item.dimensionValue == v[0]
          ).dimensionName
          setName(val)
        }}
      />
    </>
  )
}
