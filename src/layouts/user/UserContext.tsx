import { createContext, useContext } from 'react'

type MenuItem = {
  id: string
  name: string
  path?: string
  children?: MenuItem[]
  params?: object
}

type FollowedMetricItem = {
  metricId: string
  appName: string
  title: string
  icon: any
}

export type FollowItem = {
  id: string
  parentId: string
  frontComponent: string
  metricId?: string
  calFormula?: null
  createBy?: string
  createTime?: string
  icon?: null
  indicatorName?: string
  indicatorType?: number
  indicatorDesc?: string
  leaf?: true
  ruleFlag?: null
  sort?: 0
  unit?: null
  updateBy?: string
  updateTime?: string
}

/**
 * a 日
 * b 月
 * c 年
 */
export type DateType = 'a' | 'b' | 'c'

export type UserState = {
  /**
   * 接口地址
   */
  apiEndpoint: string
  // 菜单
  menus: MenuItem[]
  /**
   * @deprecated
   */
  following: FollowedMetricItem[]
  // YYYY-MM-DD
  chooseDate: Date
  // 年月日
  dateType: DateType
  // 是否是历史数据
  isHistoryDate: boolean

  setDateType: (type: DateType) => void
  setChooseDate: (date: Date) => void
  /**
   * 用户登录传string
   * 用户退出登录传null
   */
  setToken: (token: string | null) => void
  userInit: boolean
  /**
   * 当前域
   */
  currentMetricGroup: string
  /**
   * 切换域
   */
  setCurrentMetricGroup: (group: string) => void

  /**
   * 当前市场材料更新时间
   */
  materialPriceEndDate: string
  /**
   * 设置市场材料更新时间
   */
  setMaterialPriceEndDate: (date: string) => void

  /**
   * 关注列表（带有用户自定义的一些信息）
   */
  followList: FollowItem[]

  /**
   * 更新关注列表
   */
  updateFollowList: (followList: any[]) => void

  /**
   * 重新获取用户信息
   */
  updateUserInfo: () => Promise<void>

  /**
   * 普通的指标列表（不带有用户信息）
   */
  appList: any[]

  /**
   * 把followList里面在当前域下面的筛选出来
   */
  currentOriginFollowList: any

  kLineTypes: { type: 'a' | 'b' | 'c'; title: string }[]

  getFailTimes: () => number
} & (
  | {
      /**
       * 未登录
       */
      token: null
      userInfo: null
    }
  | {
      /**
       * 已登录
       */
      token: string
      userInfo: Record<string, any>
    }
)

export const UserContext = createContext({} as UserState)

export const useUser = () => useContext(UserContext)
