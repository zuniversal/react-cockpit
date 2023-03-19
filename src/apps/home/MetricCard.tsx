import { Button } from 'antd-mobile'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Loading } from '../../components/loading/Loading'
import { AppLoader } from '../../contexts/apps/AppLoader'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useLongPress } from '../../hooks/useLongPress'

import { sendBuriedPoint } from '../../utils/index'
import { Empty } from '../empty/index'
import styles from './MetricCard.module.less'
import { MetricCardTitle } from './MetricCardTitle'
function LongPressLayer({ cardMode, setCardMode }: any) {
  const methods = useLongPress(
    () => {},
    () => {
      if (cardMode === 'default') {
        setCardMode('sorting')
      }
    },
    400,
    3
  )

  return (
    <div
      {...methods}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    />
  )
}

export function MetricCard(item: any) {
  const { user, apps } = useCurrentApp()
  const { dateType, kLineTypes, token } = user

  const { cardMode, setCardMode, id, followList } = item
  /**
   * 用来标记是否是【示例数据】
   */
  const [dataMode, setDataMode] = useState<'default' | 'mock'>('default')

  const navigate = useNavigate()
  const metricId = item.metricId
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    setEndDate('')
  }, [dateType])

  const navigateToDetail = useMemo(
    () =>
      (params = {}, options = {}) => {
        const url = new URL(location.origin)
        url.pathname = `/metrics/${metricId}/detail`
        for (const key in params) {
          url.searchParams.set(key, params[key])
        }
        navigate(url.toString().slice(location.origin.length), {
          preventScrollReset: false,
          ...options,
        })
      },
    [navigate, metricId]
  )

  const [show, setShow] = useState('none')
  console.log(show, 123123)
  const [hidden, setHidden] = useState('block')
  const setLoad = useMemo(
    () => () => {
      setHidden('none')
      setShow('block')
    },
    []
  )

  console.log('itemitemitem', item, item.indicatorName, item.indicatorCode)
  const isFocus = !!followList.find((followItem) => followItem.id === item.id)
  const onUnFoucs = () => {
    item.setUnfollowVisible({ visible: true, item })
    item.setUnfollowTitle(`您是否不再关注${item.title}`)
  }
  const onFoucs = () => {
    item.follow({ parentId: item.parentId, id: item.id })
  }
  const foucsHandle = isFocus ? onUnFoucs : onFoucs

  let extra = (
    <Button
      onClick={foucsHandle}
      className={isFocus ? styles.focusBtn : styles.unFocusBtn}
    >
      {/* <ChatCheckOutline color="rgba(147, 150, 169, 1)" /> */}
      {isFocus ? (
        <img
          src={require('../../assets/icons/check.svg')}
          alt="follow/unfollow"
        />
      ) : (
        <span className={styles.icon}>+</span>
      )}
      <span>{isFocus ? '已关注' : '关注'}</span>
    </Button>
  )

  if (cardMode === 'sorting') {
    extra = null
  }

  const heightJSON = {
    A0103: 435.45, // 发货量
    A0104: 456.04, // 生产
    FI_YS0001: 725.41, // 毛利额
    FI_JC0003: 529.52, // 材料价格趋势
    FI_JC0001: 799.53, // 销售额
    FI_YS0002: 758.41, // 边际额
    A0102: 445, // 产品成本
    B0101: 450.95, // 良率分析
    B0103: 536.99, // 产能
    A0108: 497.79, // 市占与渗透
    B0104: 363, // 工单
    A0113: 364, // 人效
    A0114: 370.33, // 工单分析
    A0111: 778, // 损耗成本
    A0112: 377.33, // 人员结构
    A0116: 295.33, // 人工成本
    A0115: 392.67, // 能耗成本
    B0107: 422.67, // 人效分析-厦门
    B0105: 334, // 产能负荷度
    B0106: 413.33, // 设备故障分析
    A0110: 310, // 库存分析
  }
  return (
    <>
      {/* {cardMode === 'sorting' ? (
        ''
      ) : (
        <div
          style={{
            marginBottom: 12,
            borderRadius: 8,
            position: 'relative',
            backgroundColor: '#fff',
            display: `${hidden}`,
          }}
        >
          <div
            style={{
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <Loading params="1" setLoading={setLoad} />
          </div>
        </div>
      )} */}
      {/* 指标展示 */}
      <div
        style={{
          marginBottom: 12,
          borderRadius: 8,
          position: 'relative',
          backgroundColor: '#fff',
          // display: `${cardMode === 'sorting' ? 'show' : show}`,
        }}
      >
        <div
          style={{
            userSelect: 'none',
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 20,
            paddingBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <LongPressLayer {...{ cardMode, setCardMode }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <MetricCardTitle
              item={item}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            {dataMode === 'mock' && (
              <div style={{ height: 46, paddingLeft: 16 }}>
                <div
                  style={{
                    width: 66,
                    height: 24,
                    lineHeight: '24px',
                    textAlign: 'center',
                    borderRadius: 4,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    color: '#678EF2',
                    fontWeight: 400,
                    fontSize: 12,
                    borderColor: '#678EF2',
                    fontFamily: 'PingFang SC',
                  }}
                >
                  示例数据
                </div>
              </div>
            )}
          </div>
          {extra}
        </div>
        {cardMode === 'sorting' ? null : (
          <div
            style={{
              padding: 12,
              zIndex: 1,
              paddingTop: 0,
              minHeight: heightJSON[item.indicatorCode],
            }}
          >
            {(() => {
              let supportDateType = true
              const timeDimension = item.dimensions.find(
                (item) => item.dimensionName === '时间维'
              )
              let supportDateTypeNames: string[] = []

              const dateTypeName = kLineTypes.find(
                (item) => item.type === dateType
              ).title

              if (timeDimension) {
                supportDateTypeNames = timeDimension.child.map(
                  (item) => item.dimensionName
                )
              }
              supportDateType = supportDateTypeNames.includes(dateTypeName)
              if (!supportDateType && item.child.length <= 0) {
                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      margin: 'auto',
                      width: '100%',
                      height: '138px',
                    }}
                  >
                    <Empty
                      src={require('../../assets/icons/no.svg')}
                      marginTop="0"
                    >
                      {supportDateTypeNames.length === 0
                        ? `该指标没有${dateTypeName}维度`
                        : `该指标没有${dateTypeName}维度，请切换到${supportDateTypeNames.join(
                            '或'
                          )}维度`}
                    </Empty>
                  </div>
                )
              }
              return (
                <AppLoader
                  appName={item.appName}
                  mode="card"
                  setLoading={setLoad}
                  user={user}
                  apps={apps}
                  child={item.child}
                  indicator={item}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  dataMode={dataMode}
                  setDataMode={setDataMode}
                  navigateToDetail={navigateToDetail}
                />
              )
            })()}
          </div>
        )}
      </div>
    </>
  )
}
