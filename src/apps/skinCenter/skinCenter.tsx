import React, { useEffect, useMemo } from 'react'
import styles from './index.module.less'
import { Radio } from 'antd-mobile/es/components/radio/radio'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import SkinCenterImg from '../../assets/skinCenter/skinCenter.svg'
import { useRequest } from '../../hooks/useRequest'
import { sendPagePoint } from '../../utils/index'
export function SkinCenter() {
  const { user, indicator } = useCurrentApp()
  const { userInfo, token, chooseDate, dateType } = user // 页面埋点
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
    console.log('进入皮肤中心')
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '皮肤中心页面',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        requestUrl: '/skinCenter',
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出皮肤中心页面')
    }
  }, [])

  return (
    <div className={styles.skinCenter}>
      <p>主题中心</p>
      <div className={styles.skinCenterStyle}>
        <img src={SkinCenterImg} alt="" />
      </div>
      <div className={styles.skinCenterStyleBottomRadio}>
        <Radio style={{ '--icon-size': '14px' }} checked>
          默认主题
        </Radio>
      </div>
    </div>
  )
}
