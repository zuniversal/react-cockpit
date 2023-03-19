import { Card } from 'antd-mobile'
import { ForbidFill } from 'antd-mobile-icons'
import { arrayMoveImmutable } from 'array-move'
import cls from 'classnames'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import { useFollow } from '../../../hooks/useFollow'
import { removeMertic, updateSort } from '../../../services/home'

import { formatData, formatGridData, preventSelect } from './config'
import styles from './index.module.less'
import useModel from './metric'

const SortableItem = SortableElement((props) => {
  const { item, itemIndex, extraClass, editing } = props
  const [active, setActive] = useState(false)
  const navigate = useNavigate()
  const onClick = (e) => {
    console.log(' onClick ： ', e, item)
    if (!editing) {
      // const url = `/?id=${item.metricId}&type=${item.parentId}&homeShowState=0&title=${item.indicatorName}`
      const url = `/?tab=following&id=${item.metricId}&type=${item.parentId}&homeShowState=0&title=${item.indicatorName}`
      navigate(url)
      // window.location.reload()
    }
  }
  // const onTouchStart = (e) => {
  //   console.log(' onTouchStart ： ', e)
  //   e.preventDefault()
  //   if (editing) {
  //     setActive(true)
  //   }
  // }
  // const onTouchEnd = (e) => {
  //   console.log(' onTouchEnd ： ', e)
  //   // e.preventDefault()
  //   // if (editing) {
  //   setActive(false)
  //   // }
  // }
  // useEffect(() => {
  //   setActive(false)
  // }, [editing])

  const remove = (e) => {
    console.log('    remove ： ', e)
  }
  const onTouchStart = (e) => {
    console.log('    onTouchStart ： ', e)
    e.preventDefault()
    e.stopPropagation()
    props.onRemove(item, itemIndex)
  }

  return (
    <div
      className={cls([
        styles.sortableItemWrapper,
        extraClass,
        // { [styles.dragActiveItem]: active },
      ])}
      onClick={onClick}
      // onTouchStart={onTouchStart}
      // onTouchEnd={onTouchEnd}
    >
      {/* <button className={styles.close}>x</button> */}
      {editing && (
        <ForbidFill
          className={styles.removeIcon}
          onClick={remove}
          onTouchStart={onTouchStart}
        />
      )}
      <div className={styles.sortableBoxWrapper}>
        {/* {editing && <div className={styles.sortableBox} />} */}
        <div className={styles.sortableIconWrapper}>
          <img src={item.icon} className={styles.sortableIcon} alt="" />
        </div>
        <div className={styles.sortableItem}>{item.indicatorName}</div>
      </div>
    </div>
  )
})

const SortableList = SortableContainer((props) => {
  console.log(' SortableList    ： ', props) //
  const { dataList, ...rest } = props
  return (
    <div className={styles.sortableWrapper}>
      {dataList.map((item, index) => (
        <SortableItem
          key={item.id}
          index={index}
          itemIndex={index}
          item={item}
          disabled={!rest.editing}
          // disabled
          {...rest}
        />
      ))}
    </div>
  )
})

const MetricDraggable = (props) => {
  const { editing, groupIndex } = props
  // const [dataList, setDataList] = useState(props.dataSource)
  const onRemove = (removeItem) => {
    console.log(' onRemove    ： ', removeItem) //
    const filterData = props.dataSource.filter((v) => v.id !== removeItem.id)
    console.log(' filterData  filterData.filter v ： ', filterData)
    props.onRemove({
      removeItem,
      filterData,
      groupIndex,
    })
  }
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const sortRes = arrayMoveImmutable(props.dataSource, oldIndex, newIndex)
    // setDataList(sortRes)
    props.onSortEnd({
      sortRes,
      groupIndex,
    })
  }
  const onSortStart = (params) => {
    params.helper.className =
      params.helper.className + ' ' + styles.dragActiveItem
  }

  return (
    <div className="">
      {props.dataSource.length ? (
        <div className={styles.subTitle}>{props.subTitle}</div>
      ) : null}
      <SortableList
        // dataList={dataList}
        dataList={props.dataSource}
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
        axis="xy"
        transitionDuration={500}
        // distance={100}
        // pressDelay={200} // 注意 不能加上该延迟 会导致 元素块不消失！！
        disableAutoscrollcr
        onRemove={onRemove}
        editing={editing}
      />
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
  const { unfollow, unAllFollow } = useFollow()
  const { user } = useCurrentApp()
  const { userInfo } = user.userInfo
  const { updateFollowList } = user

  console.log(
    ' MetricGrid    ： ',
    user,
    formatGridData(user),
    formatData(user.appList)
  )
  useEffect(() => {
    preventSelect()
  }, [])

  // const [originList, setOriginList] = useState(formatData(user.appList))

  const formatRes = formatGridData(user)
  const [originList, setOriginList] = useState(formatRes)
  const [removeList, setRemoveList] = useState([])
  const onRemove = (params) => {
    console.log(' onRemove    ： ', params) //
    const { removeItem, filterData, groupIndex } = params

    const sortListRes = originList.map((item, index) =>
      index === groupIndex ? { ...item, focusList: filterData } : item
    )
    console.log(' sortListRes  dataList  ： ', sortListRes) //
    setOriginList(sortListRes)
    setRemoveList([...removeList, removeItem])
  }
  console.log(' originList, originData  ： ', originList, removeList)

  const navigate = useNavigate()
  const onAddMetric = () => {
    console.log(' onAddMetric    ： ')
    navigate('/search')
  }

  const [editing, setEditing] = useState(false)
  // const [editing, setEditing] = useState(true)
  const onStartEdit = () => {
    console.log(' onStartEdit    ： ', editing)
    setEditing(true)
  }
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
      // const removeRes = await removeMertic(params)
      // removeList.forEach(unfollow)
      unAllFollow({ ids: removeList.map((v) => v.id).join() })
    }
    const updateRes = await updateSort({
      indicatorIds: sortResList.map((v) => v.id).join(),
    })
    updateFollowList(sortResList)
    // console.log('  res await 结果  ：', removeRes, updateRes)
    setRemoveList([])
  }
  const onSortEnd = (params) => {
    console.log(' onSortEnd    ： ', params)
    const { groupIndex, sortRes } = params
    const sortListRes = originList.map((item, index) =>
      // index === groupIndex ? { ...item, child: sortRes } : item
      index === groupIndex ? { ...item, focusList: sortRes } : item
    )
    console.log(' sortListRes  dataList  ： ', sortListRes) //
    setOriginList(sortListRes)
  }

  const extra = (
    <CardExtra
      editing={editing}
      onAddMetric={onAddMetric}
      onEndEdit={onEndEdit}
      onStartEdit={onStartEdit}
    />
  )

  return (
    <div className={styles.metricGrid}>
      <div className={styles.headerRow}>
        <div className={styles.actionWrapper}>
          <div className={styles.title}>已关注指标</div>
          <div className={styles.btnWrapper}>{extra}</div>
        </div>
      </div>
      {/* <div className="draggableWrapper">
        {originList.map((item, groupIndex) => (
          <MetricDraggable
            key={item.id}
            dataSource={item.focusList}
            groupIndex={groupIndex}
            subTitle={item.indicatorName}
            editing={editing}
            onSortEnd={onSortEnd}
            onRemove={onRemove}
          />
        ))}
      </div> */}
      <Card
        // title="已关注指标"
        // style={{ margin: '0 10px' }}
        bodyStyle={{ padding: 0 }}
        // extra={extra}
      >
        {originList.map((item, groupIndex) => (
          <MetricDraggable
            key={item.id}
            dataSource={item.focusList}
            groupIndex={groupIndex}
            subTitle={item.indicatorName}
            editing={editing}
            onSortEnd={onSortEnd}
            onRemove={onRemove}
          />
        ))}
      </Card>
    </div>
  )
}

export default MetricGrid
