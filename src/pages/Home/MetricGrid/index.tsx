import { useWindowSize } from '@react-hook/window-size'
import { Card } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { useFollow } from '../../../hooks/useFollow'
import { updateSort } from '../../../services/home'
import Grid from './Grid'
import { formatGridData, preventSelect, iosBounce } from './config'
import emptyMertic from './emptyMertic.svg'
import { sendBuriedPoint } from '../../../utils'
import styles from './index.module.less'

const noFollowConfig = {
  src: emptyMertic,
  title: '暂未关注指标',
  subTitle: '可以点击添加指标进行关注',
}

const NoFollow = (props) => {
  return (
    <div className={styles.emptyTips}>
      <img src={props.src} className={styles.emptyMertic} />
      <p className={styles.emptyTitle}>{props.title}</p>
      <p className={styles.emptySubTitle}>{props.subTitle}</p>
    </div>
  )
}

const CardExtra = (props) => (
  <div className={styles.actionBtnWrapper}>
    <div className={styles.actionBtn} onClick={props.onAddMetric}>
      添加指标
    </div>
    {props.editing ? (
      <div className={styles.actionBtn} onClick={props.onEndEdit}>
        完成
      </div>
    ) : (
      <div className={styles.actionBtn} onClick={props.onStartEdit}>
        编辑
      </div>
    )}
  </div>
)

const MetricGrid = (props) => {
  const { user } = useCurrentApp()
  console.log(' MetricGrid user ： ', user)
  const { userInfo } = user.userInfo
  const { updateFollowList, currentName } = user
  const formatRes = formatGridData(user)
  const [originList, setOriginList] = useState(formatRes)
  const [removeList, setRemoveList] = useState([])
  const [editing, setEditing] = useState(false)
  const onStartEdit = () => {
    sendBuriedPoint({
      pageName: '指标库',
      pageAddress: `/home`,
      level1: `${currentName}-关注页-指标库`,
      eventName: '编辑指标',
      interfaceParam: '编辑指标 开始',
    })
    setEditing(true)
  }

  const { unAllFollow } = useFollow()
  const navigate = useNavigate()
  const onAddMetric = () => {
    sendBuriedPoint({
      pageName: '指标库',
      pageAddress: `/home`,
      level1: `${props.currentName}-关注页-指标库`,
      eventName: '页面跳转',
      pageAfterName: `添加指标`,
      pageAfterClick: `/search`,
      eventType: 'page_jump',
      interfaceParam: '页面跳转 添加指标',
    })
    navigate('/search')
  }
  const goDetail = (item) => {
    if (!editing) {
      const url = `/?tab=following&id=${item.metricId}&type=${item.parentId}&homeShowState=0&title=${item.indicatorName}`
      sendBuriedPoint({
        pageName: '指标库',
        pageAddress: `/home`,
        level1: `${currentName}-关注页-指标库`,
        eventName: '页面跳转',
        pageAfterName: item.parentName,
        pageAfterClick: url,
        eventType: 'page_jump',
        interfaceParam: '页面跳转 ' + item.parentName,
      })
      navigate(url)
    }
  }

  const [windowWidth] = useWindowSize()
  const wrapperWidth = windowWidth - 50

  useEffect(() => {
    preventSelect()
  }, [])

  const onEndEdit = async () => {
    console.log(' onEndEdit    ： ', editing, originList)
    setEditing(false)
    const sortResList = []
    originList.forEach((v) => sortResList.push(...v.focusList))
    console.log(' sortResList ： ', sortResList, removeList)
    const params = {
      userId: userInfo.id,
      indicatorIds: removeList.map((v) => v.id).join(),
    }
    console.log('  params ：', params)
    if (removeList.length) {
      unAllFollow({ ids: removeList.map((v) => v.id).join() })
    }
    await updateSort({
      indicatorIds: sortResList.map((v) => v.id).join(),
    })
    updateFollowList(sortResList)
    setRemoveList([])
    sendBuriedPoint({
      pageName: '指标库',
      pageAddress: `/home`,
      level1: `${currentName}-关注页-指标库`,
      eventName: '编辑指标',
      interfaceParam: '编辑指标 完成',
    })
  }
  const onSortEnd = (params) => {
    console.log(' onSortEnd    ： ', params)
    const { groupIndex, sortRes } = params
    const sortListRes = originList.map((item, index) =>
      index === groupIndex ? { ...item, focusList: sortRes } : item
    )
    console.log(' sortListRes  dataList  ： ', sortListRes)
    setOriginList(sortListRes)
    iosBounce.recoverScroll()
  }
  const onRemoveItem = (params) => {
    console.log(' onRemoveItem    ： ', params)
    const { removeRes, groupIndex, removeItem } = params
    const sortListRes = originList.map((item, index) =>
      index === groupIndex ? { ...item, focusList: removeRes } : item
    )
    console.log(' sortListRes  dataList  ： ', sortListRes, removeList)
    setOriginList(sortListRes)
    setRemoveList([...removeList, removeItem])
  }
  const onSortStart = () => {
    console.log(' onSortStart ： ')
    iosBounce.disableScroll()
  }

  const extra = (
    <CardExtra
      editing={editing}
      onAddMetric={onAddMetric}
      onEndEdit={onEndEdit}
      onStartEdit={onStartEdit}
    />
  )

  const haveFollow = originList
    .map((item) => item.focusList.length > 0)
    .some((v) => v)

  const gridCom = originList.map((item, groupIndex) => (
    <div className="" key={item.id}>
      {item.focusList.length ? (
        <div className={styles.subTitle}>{item.indicatorName}</div>
      ) : null}
      <Grid
        onSortStart={onSortStart}
        onRemoveItem={onRemoveItem}
        onSortEnd={onSortEnd}
        goDetail={goDetail}
        dataSource={item.focusList}
        groupIndex={groupIndex}
        editing={editing}
        wrapperStyle={() => ({
          width: wrapperWidth / 3,
          height: wrapperWidth / 3,
        })}
      />
    </div>
  ))

  return (
    <div className={styles.metricGrid}>
      <div className={styles.headerRow}>
        <div className={styles.actionWrapper}>
          <div className={styles.title}>已关注指标</div>
          <div className={styles.btnWrapper}>{extra}</div>
        </div>
      </div>
      <Card bodyStyle={{ padding: 0 }}>
        {haveFollow ? gridCom : <NoFollow {...noFollowConfig} />}
      </Card>
    </div>
  )
}

export default MetricGrid
