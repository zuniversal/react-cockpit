import { ActionSheet, Button, InfiniteScroll, Toast } from 'antd-mobile'
import { ToastHandler } from 'antd-mobile/es/components/toast'
import { arrayMoveImmutable } from 'array-move'
import moment from 'moment'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isButtonElement } from 'react-router-dom/dist/dom'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useFollow } from '../../hooks/useFollow'
import { useRequest } from '../../hooks/useRequest'
import { debounce, sendBuriedPoint, sendPagePoint } from '../../utils'
import { Empty } from '../empty/index'
import { MetricCard } from './MetricCard'
import { formatList } from './format'
import styles from './styles.module.less'

const SortableItem = SortableElement<any>((props) => <MetricCard {...props} />)

const SortableList = SortableContainer(({ items, ...itemProps }) => {
  return (
    <div>
      {items.map((item, index) => (
        <SortableItem
          key={`item-${item.metricId}`}
          index={index}
          {...item}
          {...itemProps}
        />
      ))}
    </div>
  )
})

// 雷达跳转到首页处理  分别传入指标id、指标分类、显示隐藏导航栏、表头title

function DefaultList(props) {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { items, ...cardProps } = props
  console.log(' DefaultList ： ', props, id)

  try {
    return items.map((item) => (
      <MetricCard key={item.id} {...item} {...cardProps} />
    ))
    // // 为null则不是雷达进入
    // if (!id) {
    //   return items.map((item) => {
    //     return <MetricCard key={item.metricId} {...item} {...cardProps} />
    //   })
    // } else {
    //   return items.map((item) => {
    //     if (id === item.metricId) {
    //       return <MetricCard key={item.metricId} {...item} {...cardProps} />
    //     }
    //   })
    // }
  } catch (error) {}
}

const calcList = (user, { detailName }) => {
  const { userInfo, currentOriginFollowList } = user
  const { indicatorPermissionList } = userInfo
  const dataList = []
  indicatorPermissionList.forEach((v, i) => dataList.push(...v.child))
  const followItem = currentOriginFollowList.find(
    (v) => v.frontComponent.slice(9) === detailName
  )
  // const unFollowItem = dataList.find((v) => v.metricsoflaborcost === detailId)
  const detailItem = dataList.find(
    (v) => v.frontComponent.slice(9) === detailName
  )
  const detaiList = dataList.filter(
    (v) => v.frontComponent.slice(9) === detailName
  )
  const renderList = detailName
    ? formatList(detaiList)
    : currentOriginFollowList
  return renderList
}

export function FollowList() {
  const [unfollowVisible, setUnfollowVisible] = useState({
    visible: false,
    item: null,
  })
  const [unfollowTitle, setUnfollowTitle] = useState('')
  const { user, indicator } = useCurrentApp()
  const { currentOriginFollowList, updateFollowList, followList } = user
  const [searchParams] = useSearchParams()
  const detailName = searchParams.get('id')
  const renderList = calcList(user, {
    detailName,
  })
  const { follow, unfollow } = useFollow()
  const [cardMode, setCardMode] = useState<'default' | 'sorting'>('default')
  const List = cardMode === 'default' ? DefaultList : SortableList
  const requestSort = useRequest('/sysUserFlowIndicator/sort')
  const [hasMore, setHasMore] = useState(true)
  const [allOriginFollowListData, setAllOriginFollowListData] = useState(
    split_array(currentOriginFollowList, 1)
  )
  const [currentOriginFollowListNewData, setCurrentOriginFollowListNewData] =
    useState(allOriginFollowListData[0])
  const [pageNum, setPageNum] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const array = []
    currentOriginFollowListNewData &&
      currentOriginFollowListNewData.forEach((item) => {
        currentOriginFollowList.forEach((element) => {
          if (item.id === element.id) {
            array.push(item)
          }
        })
      })
    setCurrentOriginFollowListNewData(array)
  }, [currentOriginFollowList])

  // 页面埋点

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
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '关注页',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        requestUrl: '/Home',
        accessDepth: 'level1',
        requestUrlReal: '/Home',
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出关注页面')
    }
  }, [])

  function split_array(arr, len) {
    const a_len = arr.length
    const result = []
    for (let i = 0; i < a_len; i += len) {
      result.push(arr.slice(i, i + len))
    }
    return result
  }

  function getData() {
    setPageNum(pageNum + 1)
    return allOriginFollowListData[pageNum + 1] || []
  }

  async function loadMore() {
    const append = await getData()
    setCurrentOriginFollowListNewData((val) => {
      try {
        return [...val, ...append]
      } catch (error) {}
    })
    setHasMore(append.length > 0)
  }

  const toaster = useRef<ToastHandler>()
  useEffect(() => {
    if (cardMode === 'sorting') {
      toaster.current = Toast.show({
        content: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: '#eee' }}>
              拖动卡片进行排序
            </div>
            <div style={{ width: 20 }} />
            <Button
              onClick={() => {
                setCardMode('default')
                toaster.current?.close()
              }}
              style={{
                padding: '5px',
                height: '30px',
                fontSize: '12px',
                '--background-color': '#4c9ffe',
                '--border-color': '#4c9ffe',
                color: '#fff',
              }}
            >
              完成
            </Button>
          </div>
        ),
        position: 'bottom',
        maskClassName: styles.toaster,
        duration: 0,
      })
    }

    return () => {
      toaster.current?.close()
    }
  }, [cardMode])

  const onSortEnd = useCallback(
    async ({ oldIndex, newIndex }: any) => {
      try {
        const items: any[] = arrayMoveImmutable(
          currentOriginFollowList,
          oldIndex,
          newIndex
        )
        updateFollowList(items)

        await requestSort(
          { indicatorIds: items.map((item) => item.id).join(',') },
          { method: 'GET' }
        )
      } catch (e: any) {
        Toast.show({
          content: e.message,
          duration: 1.5,
        })
      }
    },
    [currentOriginFollowList, requestSort, updateFollowList]
  )

  return (
    <div
      style={{
        background: '#F4F4F4',
        padding: 10,
      }}
    >
      {renderList.length === 0 && (
        <div
          style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>
            <Empty
              src={require('../../assets/icons/empty1.svg')}
              marginTop="0"
            />
            <div>
              <div
                style={{
                  textAlign: 'center',
                  lineHeight: '60px',
                  fontSize: 18,
                  color: '#34343F',
                  fontWeight: 'bold',
                }}
              >
                请添加指标
              </div>
              <div style={{ textAlign: 'center', lineHeight: '22px' }}>
                <div>您还没有关注指标</div>
                <div>请前往指标库关注</div>
              </div>
              <Button
                onClick={() => {
                  navigate('/search')
                }}
                style={{
                  width: '175px',
                  height: '44px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  '--background-color': '#678EF2',
                  '--border-color': '#678EF2',
                  color: '#fff',
                  marginTop: '120px',
                }}
              >
                指标库添加
              </Button>
            </div>
          </div>
        </div>
      )}
      <List
        // items={currentOriginFollowList}
        follow={follow}
        followList={followList}
        items={renderList}
        // items={currentOriginFollowListNewData}
        setCardMode={setCardMode}
        cardMode={cardMode}
        lockAxis="y"
        onSortEnd={onSortEnd}
        setUnfollowVisible={setUnfollowVisible}
        setUnfollowTitle={setUnfollowTitle}
      />
      {/* <InfinsetUnfollowVisibleiteScroll loadMore={loadMore} hasMore={hasMore} /> */}
      <ActionSheet
        extra={unfollowTitle}
        cancelText="取消"
        visible={unfollowVisible.visible}
        actions={[
          { text: '不再关注', key: 'unfollow', danger: true },
          { text: '仍然关注', key: 'follow' },
        ]}
        onAction={(action) => {
          setUnfollowVisible({ visible: false, item: null })
          ;({ visible: false, item: null })
          if (action.key === 'unfollow') {
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '取消关注',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `${unfollowVisible.item.indicatorName}`
            )

            Toast.show('正在取消关注...')
            unfollow(unfollowVisible.item)
          } else if (action.key === 'follow') {
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '仍然关注',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `${unfollowVisible.item.indicatorName}`
            )
          }
        }}
        onClose={() => setUnfollowVisible({ visible: false, item: null })}
      />
    </div>
  )
}
