import { Tabs, List, WaterMark, InfiniteScroll } from 'antd-mobile'
import { useEffect, useState, useMemo } from 'react'
import { RightOutline } from 'antd-mobile-icons'
import styles from './index.module.less'
import { Empty } from '../empty/index'
import notifyEmptyImg from '../../assets/notify/notifyEmptyImg.svg'
import { useNavigate } from 'react-router-dom'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint, sendPagePoint } from '../../utils/index'

import moment from 'moment'
export function Feedback() {
  // 历史反馈信息数据
  const [list, setList] = useState([])
  const [listTotal, setListTotal] = useState(0)
  // 历史回复信息数据
  const [news, setNews] = useState([])
  const [newsTotal, setNewsTotal] = useState(0)
  const { user, indicator } = useCurrentApp()
  const { userInfo, token } = user
  const { realname, username, id } = userInfo.userInfo
  const navigator = useNavigate()
  function handleClick(url) {
    navigator(url)
  }
  // 反馈问题列表
  const url = '/feedback/feedbackProblem/feedbackapplist'
  const requestDate = useRequest(url)
  const [hasMore, setHasMore] = useState(true)
  const [pages, setPages] = useState(1)
  const [pageNo, setPageNo] = useState(1)
  async function loadMore() {
    const append = await mockRequest()
    setList((val) => [...val, ...append])
    setHasMore(append.length > 0)
    setPageNo(pageNo + 1)
  }

  async function mockRequest() {
    if (pages < pageNo) {
      return []
    }
    const res = await requestDate(
      {
        pageNo,
        pageSize: 10,
      },
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'X-Access-Token': token,
        },
      }
    )
    setPages(res.pages)
    setListTotal(res.total)
    return res.records
  }

  useEffect(() => {
    loadMoreDone()
  }, [])
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
    console.log('进入反馈历史页面')
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '反馈历史',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        accessDepth: 'level3',
        requestUrl: '/feedback',
        requestUrlReal: window.location.pathname,
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出反馈历史页面')
    }
  }, [])

  // 反馈问题回复列表
  const requestDate1 = useRequest(
    '/feedback/feedbackProblem/queryPageFeedBackReplyList'
  )
  const [hasMoreDone, setHasMoreDone] = useState(true)
  const [pagesDone, setPagesDone] = useState(1)
  const [pageNoDone, setPageNoDone] = useState(1)
  async function loadMoreDone() {
    const append = await mockRequestDone()
    setNews((val) => [...val, ...append])
    setHasMoreDone(append.length > 0)
    setPageNoDone(pageNoDone + 1)
  }

  async function mockRequestDone() {
    if (pagesDone < pageNoDone) {
      return []
    }
    const res = await requestDate1(
      {
        pageNo: pageNoDone,
        pageSize: 10,
        askerId: id,
      },
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'X-Access-Token': token,
        },
      }
    )
    setPagesDone(res.pages)
    setNewsTotal(res.total)
    return res.records
  }

  const textProps = {
    content: `${realname} ${username.substring(
      username.length - 4,
      username.length
    )}`,
    gapX: 100,
    gapY: 100,
    fontSize: 12,
    fontColor: 'rgba(220, 221, 225, .6)',
    rotate: 0,
  }
  const [props, setProps] = useState<{ [key: string]: any }>(textProps)

  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <>
      <Tabs
        className={styles.listCard}
        stretch={false}
        onChange={(key) => {
          // 事件埋点
          sendBuriedPoint(
            '我的',
            'feedback',
            '问题状态',
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            `反馈历史 ${key}`
          )
        }}
      >
        <Tabs.Tab title={'全部 ' + listTotal} key="全部">
          <List mode="card" className={styles.listState}>
            {list &&
              list.map((item, index) => {
                return (
                  <List.Item
                    onClick={() => handleClick(`/feedbackDetail?id=${item.id}`)}
                    description={item.createTime
                      .replace(/-/g, '.')
                      .substring(0, 10)}
                    arrow=""
                    extra={<RightOutline />}
                    key={index}
                  >
                    {item && item.problemName}
                  </List.Item>
                )
              })}
          </List>
          <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </Tabs.Tab>
        <Tabs.Tab title={'已回复 ' + newsTotal} key="已回复">
          {news ? (
            <List mode="card" className={styles.listState}>
              {news &&
                news.map((item, index) => {
                  return (
                    <List.Item
                      onClick={() =>
                        handleClick(`/feedbackDetail?id=${item.feedbackId}`)
                      }
                      description={item.createTime
                        .replace(/-/g, '.')
                        .substring(0, 10)}
                      arrow=""
                      extra={<RightOutline />}
                      key={index}
                    >
                      {item && item.problemName}
                    </List.Item>
                  )
                })}
            </List>
          ) : (
            <Empty marginTop="150" src={notifyEmptyImg}>
              空空如也
            </Empty>
          )}
          <InfiniteScroll loadMore={loadMoreDone} hasMore={hasMoreDone} />
        </Tabs.Tab>
      </Tabs>
      <WaterMark {...props} />
    </>
  )
}
