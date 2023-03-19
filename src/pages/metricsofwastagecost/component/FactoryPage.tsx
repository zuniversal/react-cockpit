import { useWindowWidth } from '@react-hook/window-size'
import { ErrorBlock } from 'antd-mobile'
import { useEffect, useMemo, useState } from 'react'

import empty from '../../../assets/icons/no.svg'
import { HeadTitle } from '../../../components/helmet'
import { Loading } from '../../../components/loading/Loading'
import { Pagination } from '../../../components/pagination'
import { SegmentedControls } from '../../../components/tabs/SegmentedControls'
import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../../hooks/useQuery'
import { Empty } from '../../empty/index'
import { DemoDualAxes } from '../DualAxesDetail'
import { DemoDualAxes1 } from '../DualAxesDetail1'
import styles from '../index.module.less'
import { DetailContent } from './DetailContent'
export function FactoryPage(props) {
  const {
    error: error1,
    data: data3,
    query: query2,
  } = useQuery('/lossCost/selectLossCostTrend')
  const { segmentKey, setSegmentKey, data2, page1, setPage1, setFlag } = props
  const [chooseName, setChooseName] = useState('')
  const [name, setName] = useState('')
  const tabData = [
    { key: '电池', title: '电池' },
    { key: '模组', title: '模组' },
    { key: '打包', title: '打包' },
    { key: 'PACK', title: 'PACK' },
  ]
  const title = [
    { title: '工厂', unit: '' },
    { title: '总损耗金额', unit: '万元' },
    { title: '单位损耗金额', unit: '元/Kwh' },
    { title: '投入产出率', unit: '%' },
  ]

  const [keys, setKeys] = useState(1)
  const windowWidth = useWindowWidth()
  const width = (windowWidth - 44) * 0.82

  const pageSize1 = 4
  const detailData = useMemo(() => {
    let columnData = []
    let lineData = []
    const sort = []
    if (data2) {
      const start = (page1 - 1) * pageSize1
      const arr = []
      const temp1 = []
      const temp2 = []
      data2?.shcbList.map((item, index) => {
        if (index == 0) {
          setChooseName(item.factoryStage + '-' + item.productNum)
        }
        if (index >= start && index < start + pageSize1) {
          arr.push(item.factoryStage)
          temp1.push(
            {
              name: item.factoryStage + '-' + item.productNum,
              type: '损耗金额(万元)',
              value: item.shje || 0,
              factoryStage: item.factoryStage,
            },
            {
              name: item.factoryStage + '-' + item.productNum,
              type: '单位损耗(元/Kwh)',
              value: item.dwshcb || 0,
              factoryStage: item.factoryStage,
            }
          )
          temp2.push({
            name: item.factoryStage + '-' + item.productNum,
            投入产出比: item.trccl || 0,
            factoryStage: item.factoryStage,
          })
        }
      })
      const factoryStage = Array.from(new Set(arr))
      const json1 = {}
      const json2 = {}
      temp1.map((item) => {
        factoryStage.map((item1) => {
          if (item.factoryStage === item1) {
            if (json1[item1]) {
              json1[item1] = [...json1[item1], ...[item]]
            } else {
              json1[item1] = [...[item]]
            }
          }
        })
      })
      temp2.map((item) => {
        factoryStage.map((item1) => {
          if (item.factoryStage === item1) {
            if (json2[item1]) {
              json2[item1] = [...json2[item1], ...[item]]
            } else {
              json2[item1] = [...[item]]
            }
          }
        })
      })
      factoryStage.map((item) => {
        columnData = [...columnData, ...json1[item]]
        lineData = [...lineData, ...json2[item]]
        sort.push({
          name: item,
          width: (width / temp2.length) * json2[item].length - 5,
        })
      })
    }
    return {
      columnData,
      lineData,
      sort,
    }
  }, [data2, pageSize1, page1, width])

  const total1 = useMemo(() => {
    if (data2 && data2.shcbList && data2.shcbList.length > 0) {
      return Math.ceil(data2.shcbList.length / pageSize1)
    }
  }, [data2, pageSize1])

  useEffect(() => {
    query2({
      workSection: segmentKey,
      productNum: chooseName.split('-')[1], // 具体型号
      werks: chooseName.split('-')[0], // 工厂
    })
  }, [query2, segmentKey, chooseName])

  const trendData = useMemo(() => {
    const columnData = []
    const lineData = []
    data3?.costLastSixMonthList?.map((item) => {
      columnData.push(
        {
          name: item.closeMonth.slice(-2),
          type: '损耗金额(万元)',
          value: item.shje || 0,
          factoryStage: item.factoryStage,
        },
        {
          name: item.closeMonth.slice(-2),
          type: '单位损耗(元/Kwh)',
          value: item.dwshcb || 0,
          factoryStage: item.factoryStage,
        }
      )
      lineData.push({
        name: item.closeMonth.slice(-2),
        投入产出比: item.trccl || 0,
        factoryStage: item.factoryStage,
      })
    })
    return {
      columnData,
      lineData,
    }
  }, [data3])

  const height = windowWidth * 0.65

  if (error1) {
    return <ErrorBlock description={error1.message} />
  }

  return (
    <>
      <div className={styles.Card}>
        <SegmentedControls
          activeKey={segmentKey}
          onChange={(key) => {
            setSegmentKey(key)
            setKeys(keys + 1)
            setPage1(1)
            setFlag && setFlag(true)
          }}
          tabs={tabData}
        />
      </div>
      {data2 ? (
        <>
          <DetailContent
            title={title}
            list={data2?.trccList || []}
            marginBottom={12}
          />
          <div className="adm-card-header-title">各型号电池段损耗情况</div>
          <div className={styles.chartLegend}>
            <div>
              <span />
              损耗金额(万元)
            </div>
            <div>
              <span style={{ background: '#5FCABB' }} />
              单位损耗(元/Kwh)
            </div>
            <div>
              <span style={{ background: '#e08142' }} />
              投入产出比
            </div>
          </div>
          <div className={styles.chartsTitle} />
          {detailData.columnData.length > 0 ||
          detailData.lineData.length > 0 ? (
            <>
              <div style={{ height }}>
                <DemoDualAxes
                  columnData={detailData.columnData}
                  lineData={detailData.lineData}
                  chooseName={chooseName}
                  setChooseName={setChooseName}
                  setName={setName}
                  keys={keys}
                  setKeys={setKeys}
                />
              </div>

              <div className={styles.chartsBottomBg}>
                {detailData.sort.map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        width: item.width,
                      }}
                      className={styles.chartsBottom}
                    >
                      {item.name}
                    </div>
                  )
                })}
              </div>
              <div style={{ position: 'relative', zIndex: 104 }}>
                <Pagination
                  current={page1}
                  onChange={setPage1}
                  total={total1}
                />
              </div>
            </>
          ) : (
            <Empty src={empty} marginTop="60">
              暂无数据
            </Empty>
          )}

          <div className="adm-card-header-title" style={{ margin: '12px 0' }}>
            近6个月损耗趋势{chooseName && '-'}
            {chooseName}
          </div>
          {data3 ? (
            <>
              {trendData.columnData.length > 0 ||
              trendData.lineData.length > 0 ? (
                <div style={{ height }}>
                  <DemoDualAxes1
                    columnData={trendData.columnData}
                    lineData={trendData.lineData}
                  />
                </div>
              ) : (
                <Empty src={empty} marginTop="60">
                  暂无数据
                </Empty>
              )}
            </>
          ) : (
            <Loading style={{ height: '25vh', width: '90vw' }} />
          )}
        </>
      ) : (
        <Loading style={{ height: '90vh', width: '90vw' }} />
      )}
    </>
  )
}
