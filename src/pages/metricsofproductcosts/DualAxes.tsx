import { DualAxes } from '@ant-design/plots'
import { ErrorBlock, Picker } from 'antd-mobile'
import moment from 'moment'
import { useState, useEffect, useMemo } from 'react'

import empty from '../../assets/icons/no-data.svg'
import { Loading } from '../../components/loading/Loading'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { sendBuriedPoint } from '../../utils/index'
import { Empty } from '../empty/index'
import style from './CardMode.module.less'
import { Chart1 } from './Chart1'
import { ProductCostDualAxes1 } from './DualAxes1'
import styles1 from './index.module.less'
export const ProductCostDualAxes = (props) => {
  const { type1, setType1, segmentKey, data, sort, value1, setValue1 } = props
  // 本体标识/交付类型 切换标识
  const [flag, setFlag] = useState(true)
  // 近十二月展开/折叠 标识
  const [isFold, setIsFold] = useState(true)
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState<(string | null)[]>([''])

  const [visible1, setVisible1] = useState(false)

  // const height = 0.65 * document.body.clientWidth
  const height = 245
  const { navigateToDetail } = useCurrentApp()

  //产品成本趋势
  const {
    error,
    data: ProductCostTrendData,
    query,
  } = useQuery('/productcost/selectProductCostTrend')

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    if (type1 !== '' && value[0] !== '') {
      query({ type1, productName: value, deliveryType: value1 })
    }
  }, [query, type1, value, value1])

  const { nameField, valueFields } = useMemo(() => {
    let nameField = ''
    let valueFields = []
    if (segmentKey === '1') {
      valueFields = [
        'unitMaterialCostStandard',
        'unitTotalCost',
        'unitManufacturingCostStandard',
        'marketPrice',
        'companySellingPrice',
      ]
    }
    if (segmentKey === '2') {
      valueFields = [
        'unitMaterialCostActual',
        'costActual',
        'unitManufacturingCostActual',
        'marketPrice',
        'companySellingPrice',
      ]
    }
    if (type1 === 'a') {
      nameField = 'productName'
    }
    if (type1 === 'b') {
      nameField = 'deliveryType'
    }
    return { nameField, valueFields }
  }, [segmentKey, type1])

  // 图例卡片
  const legendCard = [
    {
      name: '单位材料成本',
      color: '#5183FD',
    },
    {
      name: '单位全成本',
      color: '#5FCABB',
    },
    {
      name: '单位制造付现成本',
      color: '#A3A6FF',
    },
    {
      name: '市场售价',
      color: '#E08142',
    },
    {
      name: '公司售价',
      color: '#766BF5',
    },
    {
      name: '',
      color: '',
    },
  ]

  useEffect(() => {
    setType1('a')
  }, [])
  useEffect(() => {
    try {
      if (data?.length > 0) {
        setValue(data[0].productName)
      }
    } catch (error) {}
  }, [data])
  function typeSwitch() {
    // setFlag(!flag)
    // if (!flag) {
    //   setType1('a')
    // } else {
    //   setType1('b')
    // }
    setVisible1(true)
    // 事件埋点
    sendBuriedPoint(
      '关注',
      '/home',
      '维度切换',
      moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
      `产品成本 ${flag ? '交付类型' : '本体标识'}`
    )
  }

  const basicColumns = useMemo(() => {
    const arr = []
    if (data) {
      try {
        arr[0] = data.map((item) => {
          return {
            label: item.productName,
            value: item.productName,
          }
        })
        return arr
      } catch (error) {}
    }
    return [[]]
  }, [data])

  const basicColumns1 = useMemo(() => {
    const arr = [[]]
    if (sort) {
      try {
        sort.map((item) => {
          arr[0].push({
            label: item,
            value: item,
          })
        })
      } catch (e) {}
    }
    return arr
  }, [sort])
  return (
    <div>
      <ul className={style.legend}>
        {legendCard.map((item) => {
          return (
            <li key={item.name}>
              <div style={{ background: item.color }} />
              <span>{item.name}</span>
            </li>
          )
        })}
      </ul>
      <div className={style.card_bottom}>
        <div style={{ visibility: flag ? 'visible' : 'hidden' }}>
          <img src={require('../../assets/icons/mark.svg')} />
          <span>仅展示销售量排名前八的型号</span>
        </div>
        <div onClick={typeSwitch}>
          {/* <span>{flag ? '本体标识' : '交付类型'}</span>
          <img
            style={{ marginLeft: '5px' }}
            src={require('../../assets/icons/switch-1.svg')}
          /> */}
          <span>{value1}</span>
          <img
            style={{ marginLeft: '3px' }}
            src={require('../../assets/icons/down-arrow-1.svg')}
            alt=""
          />
        </div>
      </div>
      {/* <div className={styles1.unitFont} style={{ marginBottom: '1vh' }}>
        (元/Kwh)
      </div> */}
      {data?.length === 0 ? (
        <Empty src={empty} marginTop="45" paddingBottom="30">
          暂无数据
        </Empty>
      ) : (
        ''
      )}
      {!data && <Loading style={{ height: '25vh', width: '90vw' }} />}
      {data?.length > 0 ? (
        <Chart1
          data={data}
          onClickTooltip={(series) => {
            navigateToDetail({
              typeNum: series[0].name,
              type1,
              segmentKey1: segmentKey,
              deliveryType: value1,
            })
          }}
          height={height}
          nameField={nameField}
          valueFields={valueFields}
        />
      ) : (
        ''
      )}
      <div>
        {isFold ? (
          <div
            className={style.fold_box}
            onClick={() => {
              setIsFold(!isFold)
              // 事件埋点
              sendBuriedPoint(
                '关注',
                '/home',
                '维度切换',
                moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                `产品成本 查看近12月趋势`
              )
            }}
          >
            <span>查看近12月趋势对比</span>
            <img
              style={{
                marginLeft: '9px',
              }}
              src={require('../../assets/icons/down-arrow.svg')}
            />
          </div>
        ) : (
          <div>
            <div
              className={style.fold_box}
              onClick={() => {
                setIsFold(!isFold)
              }}
            >
              <span>收起</span>
              <img
                style={{
                  marginLeft: '9px',
                }}
                src={require('../../assets/icons/up-arrow.svg')}
              />
            </div>
            {error ? (
              <ErrorBlock status="default" description={error.message} />
            ) : (
              <div style={{ marginTop: '15px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div className={style.trend}>近12月趋势</div>
                  {data?.length > 0 && (
                    <div
                      className={style.model}
                      onClick={() => {
                        setVisible(true)
                        // 事件埋点
                        sendBuriedPoint(
                          '关注',
                          '/home',
                          '维度切换',
                          moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                          `产品成本 ${value}`
                        )
                      }}
                    >
                      <span>{value}</span>
                      <img
                        style={{ marginLeft: '3px' }}
                        src={require('../../assets/icons/down-arrow-1.svg')}
                        alt=""
                      />
                    </div>
                  )}
                </div>
                {ProductCostTrendData?.length > 0 && (
                  <div
                    className={styles1.unitFont}
                    style={{ marginBottom: '1vh' }}
                  >
                    (元/Kwh)
                  </div>
                )}
                {ProductCostTrendData?.length === 0 || data?.length === 0 ? (
                  <Empty src={empty} marginTop="45" paddingBottom="30">
                    暂无数据
                  </Empty>
                ) : (
                  ''
                )}
                {!ProductCostTrendData && (
                  <Loading style={{ height: '25vh', width: '90vw' }} />
                )}
                {ProductCostTrendData?.length > 0 && data?.length > 0 && (
                  <ProductCostDualAxes1
                    ProductCostTrendData={ProductCostTrendData}
                    type1={type1}
                    segmentKey={segmentKey}
                    value={value}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Picker
        columns={basicColumns}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        value={value}
        onConfirm={(v) => {
          setValue([v[0]])
        }}
      />

      <Picker
        columns={basicColumns1}
        visible={visible1}
        onClose={() => {
          setVisible1(false)
        }}
        value={value1}
        onConfirm={(v) => {
          setValue1([v[0]])
        }}
      />
    </div>
  )
}
