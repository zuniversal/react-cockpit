import { useEffect } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useFollow } from '../../hooks/useFollow'

// 检测用户是否未关注任何一个指标，自动关注
const useAutoFollow = () => {
  const { user } = useCurrentApp()
  const { currentOriginFollowList, userInfo } = user
  const { indicatorPermissionList } = userInfo
  const { follow } = useFollow()
  // useEffect(() => {
  //   console.log(' 是否为空 ： ', user)
  //   if (!currentOriginFollowList.length) {
  //     console.log(' 是否为空 自动关注 ： ', user, indicatorPermissionList)
  //     const permissionList = []
  //     indicatorPermissionList.forEach((v) => permissionList.push(...v.child))
  //     console.log(' 是否为空 permissionList ：', permissionList)
  //     permissionList.forEach((v) => {
  //       follow({ parentId: v.parentId, id: v.id })
  //     })
  //     // const permissionIds = permissionList.map((v) => v.id)
  //     // console.log(' 是否为空 permissionIds ： ', permissionIds)
  //     // follow({parentId, indicatorId})
  //   }
  // }, [])
}

export default useAutoFollow
