import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Loading } from '../../components/loading/Loading'
import { routes } from '../../router/route'
import { pushLog } from '../../utils'
import { DateType, UserContext } from './UserContext'
//路由
const apiEndpoint = process.env.API_ENDPOINT || window.location.origin + '/api'
const storeKey = 'datafrontcalb/error/wx-login-fail-times'

export function UserProvider(props) {
  const [chooseDate, setChooseDate] = useState(new Date())
  /**
   * 默认月维度
   */
  const [dateType, setDateType] = useState<DateType>('b')
  const [currentMetricGroup, setCurrentMetricGroup] = useState<string>()
  const [materialPriceEndDate, setMaterialPriceEndDate] = useState<string>()
  const [userInit, setUserInit] = useState(false)
  const [userInfo, setUserInfo] = useState<null | any>(null)

  const kLineTypes = useMemo<any[]>(() => {
    return [
      { type: 'a', title: '日' },
      { type: 'b', title: '月' },
      { type: 'c', title: '年' },
    ]
  }, [])

  // 后期会从接口获取
  const menus = useMemo(() => {
    return routes
  }, [])
  /**
   * @deprecated 已经改成从接口获取
   *
   * 关注的指标，会改成从接口获取
   *
   * 第一迭代交付指标：1交付、2生产、3销售额、4毛利额、5边际额、6库存、7原材料价格
   */
  const [following] = useState([])

  const [appList, setAppList] = useState([])

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const getUserInfo = useCallback(async () => {
    try {
      const res = await fetch(`${apiEndpoint}/sys/user/getUserInfo`, {
        headers: {
          'X-Access-Token': token,
        },
      })
      if (!res.ok) {
        if (res.status === 401) {
          setToken(null)
        }
        throw new Error(await res.text())
      }
      const json = await res.json()
      // const json = { success: false, code: 401 } as any
      if (!json.success) {
        if (json.code === 401) {
          setToken(null)
          return
        }
        throw new Error(json.message)
      }
      const userInfo = json.result

      const userId = userInfo.userInfo.id
      /*
       * 获取所有指标列表
       */
      const res1 = await fetch(
        `${apiEndpoint}/indexlibrary/indexLibrary/appList?userId=${userId}`,
        {
          headers: {
            'X-Access-Token': token,
          },
        }
      )
      if (!res1.ok) {
        if (res1.status === 401) {
          setToken(null)
        }
        throw new Error(await res1.text())
      }

      const json1 = await res1.json()
      if (!json1.success) {
        if (json1.code === 401) {
          setToken(null)
        }
        throw new Error(json1.message)
      }

      const appList = json1.result.map((item) => {
        if (!item.frontComponent) {
          return item
        }

        const {
          frontComponent,
          indicatorName: title,
          indicatorDesc: desc,
        } = item

        const metricId = frontComponent.slice('/metrics/'.length)
        let icon = require(`../../assets/metricsicons/m0001.svg`)
        try {
          icon = require(`../../apps/${metricId}/icon.svg`)
        } catch (e) {}
        return {
          ...item,
          title,
          icon,
          metricId,
          appName: metricId,
          desc,
        }
      })

      setUserInfo(userInfo)
      setAppList(appList)
      let current = appList.find((item) => item.title === '集团')
      if (!current) {
        current = appList[0]
      }
      setCurrentMetricGroup(current.id)
      setUserInit(true)
      window.localStorage.removeItem(storeKey)
    } catch (e) {
      let failTimes = Number(window.localStorage.getItem(storeKey))

      if (!failTimes) {
        window.localStorage.setItem(storeKey, '1')
      } else {
        failTimes = Number(failTimes) + 1
        window.localStorage.setItem(storeKey, '' + failTimes)
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(e)
      }
      /**
       * 服务器网络似乎有问题，偶尔会无法连接
       * 此处如果报错统一当作登录失败处理，重新走登录流程
       */
      pushLog('error', e.message)
      setToken(null)
      setUserInfo(null)
      setUserInit(true)
    }
  }, [token])

  const updateToken = useCallback((token: string | null) => {
    if (!token) {
      localStorage.removeItem('token')
      setUserInfo(null)
      setUserInit(true)
      setToken(null)
    } else {
      const storedToken = localStorage.getItem('token')
      if (token !== storedToken) {
        setToken(token)
        localStorage.setItem('token', token)
        setUserInit(false)
      }
    }
  }, [])

  const followList = useMemo(() => {
    if (!userInfo || !appList) {
      return []
    }
    return userInfo.flowIndicatorList
      .filter((item) => {
        return !!item.frontComponent
      })
      .map((item, index) => {
        // const parent = appList.find((item2) => item2.id === item.parentId)
        // const app = parent.children.find((item2) => item2.id === item.id)

        const {
          frontComponent,
          indicatorName: title,
          indicatorDesc: desc,
        } = item

        const metricId = frontComponent.slice('/metrics/'.length)
        let icon = require(`../../assets/metricsicons/m0001.svg`)
        try {
          icon = require(`../../apps/${metricId}/icon.svg`)
        } catch (e) {}
        return {
          // ...app,
          ...item,
          title,
          icon,
          metricId,
          appName: metricId,
          desc,
        }
      })
  }, [userInfo, appList])

  /**
   * 更新flowIndicatorList
   */
  const updateFollowList = useCallback((flowIndicatorList: any[]) => {
    setUserInfo((prev) => {
      if (!prev) {
        return prev
      }
      return { ...prev, flowIndicatorList }
    })
  }, [])

  const getFailTimes = useCallback(() => {
    const failTimes = Number(window.localStorage.getItem(storeKey))
    if (!failTimes) {
      return 1
    }
    return failTimes
  }, [])

  const currentOriginFollowList = useMemo(() => {
    if (currentMetricGroup === '' || !currentMetricGroup || !appList) {
      return []
    }

    const currentParent = appList.find((item) => item.id === currentMetricGroup)

    return followList.filter((item) => {
      return item.parentId === currentParent.id
    })
  }, [appList, followList, currentMetricGroup])

  const isHistoryDate = useMemo(() => {
    if (dateType === 'a') {
      return (
        moment(new Date()).format('YYYY-MM-DD') !==
        moment(chooseDate).format('YYYY-MM-DD')
      )
    }
    if (dateType === 'b' || dateType === 'c') {
      return (
        moment(new Date()).format('YYYY-MM') !==
        moment(chooseDate).format('YYYY-MM')
      )
    }
  }, [dateType, chooseDate])

  useEffect(() => {
    if (!userInit) {
      if (!token) {
        setUserInfo(null)
        setUserInit(true)
      } else {
        getUserInfo()
      }
    }
  }, [userInit, getUserInfo, token])
  return (
    <UserContext.Provider
      value={{
        apiEndpoint,
        kLineTypes,
        token,
        menus,
        following,
        chooseDate,
        isHistoryDate,
        currentOriginFollowList,
        dateType,
        userInfo,
        appList,
        followList,
        userInit,
        currentMetricGroup,
        setToken: updateToken,
        setChooseDate,
        setDateType,
        updateFollowList,
        updateUserInfo: getUserInfo,
        setCurrentMetricGroup,
        getFailTimes,
        materialPriceEndDate,
        setMaterialPriceEndDate,
      }}
    >
      {userInit ? props.children : <Loading />}
    </UserContext.Provider>
  )
}
