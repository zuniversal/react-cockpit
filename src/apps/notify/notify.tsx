import { Avatar, WaterMark, PullToRefresh } from 'antd-mobile'

import { useRequest } from '../../hooks/useRequest'
import notifyImg from '../../assets/notify/notifyImg.svg'
import { useNavigate } from 'react-router-dom'
import { Empty } from '../empty/index'
import notifyEmptyImg from '../../assets/notify/notifyEmptyImg.svg'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { RightOutline } from 'antd-mobile-icons'
import { sleep } from 'antd-mobile/es/utils/sleep'
import { useEffect, useState, useMemo, useRef } from 'react'
import { sendPagePoint } from '../../utils/index'
import styles from './index.module.less'
export function Notify() {
  const [bodyHeight, setBodyHeight] = useState(0)
  const { user, indicator } = useCurrentApp()
  const { userInfo, token } = user
  const [listTotal, setListTotal] = useState(0)
  const [list, setList] = useState([])
  const navigate = useNavigate()
  const url = 'feedback/feedbackProblem/getMyAnnouncementSend'
  useEffect(() => {
    setBodyHeight(document.body.clientHeight)
    getData1()
    loadMore()
  }, [])
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
    console.log('进入消息页面')
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '消息通知页面',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        requestUrl: '/notify',
      })
      id = result
      console.log(id, 123)
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出消息页面')
    }
  }, [])
  // 查询所有类型消息数据
  const requestDate = useRequest(url)
  const [hasMore, setHasMore] = useState(true)
  const [pages, setPages] = useState(1)
  const [pageNo, setPageNo] = useState(1)
  async function loadMore() {
    const append = await mockRequest()
    setList((val) => [...append.reverse(), ...val])
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
        id: userInfo.userInfo.id,
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

  // 更改用户阅读状态
  async function getData1() {
    fetch('api/feedback/feedbackProblem/editMessageStatusUserId', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token,
        platform: 'ckpt',
      },
      body: JSON.stringify({}),
    }).then((data) => {
      localStorage.setItem('newsAmount', '0')
    })
  }
  function getJsx(time) {
    const item = time.sendTimeTemp

    if (item.length > 8) {
      return (
        <div className={styles.timeBox}>
          <div className={styles.time}>
            {item.isSameMinute !== 'true' && time.isOneFirst === '1'
              ? item.substr(5, 11).replace('-', '月').replace(' ', '日 ')
              : ''}
          </div>
        </div>
      )
    } else {
      return (
        <div className={styles.timeBox}>
          <div className={styles.time}>
            {item.isSameMinute !== 'true' && time.isOneFirst === '1'
              ? item.substr(0, 5)
              : ''}
          </div>
        </div>
      )
    }
  }
  function handleClick(url) {
    navigate(url)
  }
  const { realname, username } = userInfo.userInfo
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
  const box = document.querySelector('#boxHeight')
  const ref = useRef()
  const height = (ref.current && ref.current.scrollHeight - 100) || 0
  return (
    <div
      id="boxHeight"
      className={styles.body}
      style={{ height: bodyHeight + 'px' }}
      onLoad={() => {
        box.scrollTop =
          ref.current.scrollHeight - box.getBoundingClientRect().height - height
      }}
    >
      <PullToRefresh
        onRefresh={async () => {
          await sleep(0)
          loadMore()
        }}
      >
        <div ref={ref} style={{ paddingBottom: '20px' }}>
          {list ? (
            list.map((item) => {
              if (item.msgCategory === '4') {
                return (
                  <div key={item.id}>
                    {getJsx(item)}
                    <div className={styles.bottomBox}>
                      <div className={styles.leftImg}>
                        <Avatar
                          src={notifyImg}
                          style={{
                            '--size': '35px',
                            '--border-radius': '5px',
                          }}
                        />
                      </div>
                      <div className={styles.rightBox}>
                        <h2>问题反馈通知</h2>
                        <div className={styles.rightBox_center}>
                          {item.titile}
                          <p>{item.isReply === '1' ? '已有回复' : ''}</p>
                        </div>
                        <p
                          className={styles.rightBox_linkOut}
                          onClick={() =>
                            handleClick(
                              `/feedbackDetail?type=notify&id=${item.feedbackId}`
                            )
                          }
                        >
                          查看详细
                          <RightOutline />
                        </p>
                      </div>
                    </div>
                  </div>
                )
              } else if (
                item.msgCategory === '3' ||
                item.msgCategory === '2' ||
                item.msgCategory === '1'
              ) {
                return (
                  <div key={item.id}>
                    {getJsx(item)}
                    <div className={styles.bottomBox}>
                      <div className={styles.leftImg}>
                        <Avatar
                          src={notifyImg}
                          style={{
                            '--size': '35px',
                            '--border-radius': '5px',
                          }}
                        />
                      </div>
                      <div className={styles.rightBox}>
                        <h2>{item.titile}</h2>
                        <div
                          className={styles.imgStyle}
                          dangerouslySetInnerHTML={{
                            __html: item.msgContent,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              }

              return null
            })
          ) : (
            <Empty src={notifyEmptyImg}>还没有消息通知</Empty>
          )}
        </div>
        <WaterMark {...props} />
      </PullToRefresh>
    </div>
  )
}
