import { Tabs, Empty } from 'antd-mobile'
import React, { useEffect, useMemo, useState } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useRequest } from '../../hooks/useRequest'
import { data, data2 } from './data'
import { sendPagePoint } from '../../utils/index'
import style from './index.module.less'

export function Power() {
  const [activeIndex, setActiveIndex] = useState(1)
  const { user, indicator } = useCurrentApp()
  const { userInfo, token } = user

  const tabItems = [
    {
      title: '经营分析',
      key: 1,
    },
    {
      title: '厦门制造',
      key: 2,
    },
  ]
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
    console.log('进入权限说明页面')
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '权限说明',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        accessDepth: 'level2',
        requestUrl: '/power',
        requestUrlReal: window.location.pathname,
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出权限说明页面')
    }
  }, [])

  return (
    <div>
      <div className={style.tabBox}>
        <Tabs
          defaultActiveKey="1"
          activeLineMode="fixed"
          style={{
            '--fixed-active-line-width': '32px',
            width: '156px',
          }}
          onChange={(key) => {
            setActiveIndex(Number(key))
          }}
        >
          {tabItems.map((item) => {
            return <Tabs.Tab title={item.title} key={item.key} />
          })}
        </Tabs>
      </div>

      {activeIndex == 1 && (
        <div className={style.contentBox}>
          <div className={style.title}>指标权限对照表</div>
          <div className={style.description}>
            <img src={require('../../assets/me/hasPower.svg')} />
            <span className={style.powerMargin}>有权限</span>
            <img src={require('../../assets/me/noPower.svg')} />
            <span>无权限</span>
          </div>
          <div className={style.content}>
            <div className={style.contentLeft}>
              <div className={style.job}>岗位</div>
              {data.content.map((item, index) => {
                return (
                  <div className={style.contentBottomBg} key={index}>
                    <div
                      className={style.contentBottomBgTitle}
                      style={{ width: 66 * data.title.length + 128 }}
                    >
                      {item.title}
                    </div>
                    {item.data.map((item1, index1) => {
                      return (
                        <div className={style.contentBottom} key={index1}>
                          <div className={style.contentBottomTitle}>
                            <span>{item1.title}</span>
                            {item1.data.map((item2, index2) => {
                              return <span key={index2}>{item2.title}</span>
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            <div className={style.contentRight}>
              <div className={style.contentTop}>
                {data.title.map((item, index) => {
                  return <div key={index}>{item}</div>
                })}
              </div>
              {data.content.map((item, index) => {
                return (
                  <div className={style.contentBottomBg} key={index}>
                    {item.data.map((item1, index1) => {
                      return (
                        <div className={style.contentBottom} key={index1}>
                          {data.title.map((item3, index3) => {
                            return (
                              <div key={index3}>
                                {item1.data.map((item4, index4) => {
                                  const name =
                                    item4[item3] === 1 ? 'hasPower' : 'noPower'
                                  return (
                                    <img
                                      src={require(`../../assets/me/${name}.svg`)}
                                      key={index4}
                                    />
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeIndex == 2 && (
        <div className={style.contentBox}>
          <div className={style.title}>指标权限对照表</div>
          <div className={style.description}>
            <img src={require('../../assets/me/hasPower.svg')} />
            <span className={style.powerMargin}>有权限</span>
            <img src={require('../../assets/me/noPower.svg')} />
            <span>无权限</span>
          </div>
          <div className={style.content}>
            <div className={style.contentLeft}>
              <div className={style.job}>岗位</div>
              {data2.content.map((item, index) => {
                return (
                  <div className={style.contentBottomBg} key={index}>
                    <div className={style.contentBottomBgTitle}>
                      {item.title}
                    </div>
                    {item.data.map((item1, index1) => {
                      return (
                        <div className={style.contentBottom} key={index1}>
                          <div className={style.contentBottomTitle}>
                            <span>{item1.title}</span>
                            {item1.data.map((item2, index2) => {
                              return <span key={index2}>{item2.title}</span>
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            <div className={style.contentRight}>
              <div className={style.contentTop}>
                {data2.title.map((item, index) => {
                  return <div key={index}>{item}</div>
                })}
              </div>
              {data2.content.map((item, index) => {
                return (
                  <div className={style.contentBottomBg} key={index}>
                    {item.data.map((item1, index1) => {
                      return (
                        <div className={style.contentBottom} key={index1}>
                          {data2.title.map((item3, index3) => {
                            return (
                              <div key={index3}>
                                {item1.data.map((item4, index4) => {
                                  if ([1, 0].includes(item4[item3])) {
                                    const name =
                                      item4[item3] === 1
                                        ? 'hasPower'
                                        : 'noPower'
                                    return (
                                      <img
                                        src={require(`../../assets/me/${name}.svg`)}
                                        key={index4}
                                      />
                                    )
                                  }
                                })}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {![1, 2].includes(activeIndex) && (
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty
            image={require('../../assets/me/version/noData.svg')}
            imageStyle={{ width: '35vw', position: 'relative', zIndex: 103 }}
            description={<div>还没有该类指标</div>}
          />
        </div>
      )}
    </div>
  )
}
