/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-02-09 08:45:42
 * @LastEditors: Teemor
 * @LastEditTime: 2023-02-16 11:02:58
 */
import { useEffect, useMemo } from 'react'
import { useRequest } from '../../hooks/useRequest'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { sendPagePoint } from '../../utils/index'
export function VersionDetail() {
  const data = JSON.parse(localStorage.getItem('versionDetail'))
  const { user, indicator } = useCurrentApp()
  const { userInfo, token, chooseDate, dateType } = user
  // 页面埋点
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
    console.log('进入版本更新页面')
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '版本更新',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        accessDepth: 'level4',
        requestUrlReal: window.location.pathname,
        requestUrl: '/versionDetail',
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出版本更新页面')
    }
  }, [])
  return (
    <div
      style={{ padding: '24px 16px', color: '#999' }}
      dangerouslySetInnerHTML={{ __html: data.versionContent }}
    />
  )
}
