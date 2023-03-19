import { SearchBar, Tabs, PullToRefresh, WaterMark } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import moment from 'moment'
import { PubSub } from 'pubsub-js'
import { useCallback, useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../components/helmet'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint } from '../../utils/index'
import { AppList } from './AppList'
import { FollowList } from './FollowList'
import { Guide } from './Guide'
import { HeaderPicker } from './HeaderPicker'
import MetricGrid from './MetricGrid'
import { VersionUpdate } from './VersionUpdate'
import styles from './styles.module.less'

const tabbarHeight = 42
export function Home() {
  const [count, setCount] = useState(1)
  const { user } = useCurrentApp()
  const { currentOriginFollowList, userInfo, token } = user
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  console.log(' searchParams.get ： ', searchParams.get('tab'))
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'metrics' ? 'metrics' : 'following'
  )
  const url = '/sys/sysAnnouncementSend/getMyAnnouncementSend'
  const onSearchbarFocus = useCallback(() => {
    navigate('/search')
  }, [navigate])
  const metricDetail = searchParams.get('id')
  const tabParams = searchParams.get('tab')
  useEffect(() => {
    console.log(' 路由改变了 ： ', count, tabParams)
    if (tabParams) {
      setActiveTab(tabParams)
    }
    setCount(count + 1)
  }, [searchParams])

  const onTagChange = useCallback(
    (key: 'metrics' | 'following') => {
      setActiveTab(key)
      navigate(`/?tab=${key}`, { replace: true })

      // 事件埋点
      sendBuriedPoint(
        '关注',
        '/home',
        '维度切换',
        moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        `${key}` !== 'metrics' ? '关注' : '指标库'
      )
    },
    [navigate]
  )

  const { realname, username, id } = userInfo.userInfo
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

  const [isGuide, setIsGuide] = useState(false)
  const [isVersionUpdate, setVersionUpdate] = useState(false)
  const [versionData, setVersionData] = useState()

  useEffect(() => {
    //订阅 'message' 发布的发布的消息
    const messageSocket = PubSub.subscribe(
      'message',
      function (topic, message) {
        //message 为接收到的消息  这里进行业务处理
        setVersionUpdate(true)
        setVersionData(message)
      }
    )
    // window.history.pushState(null, '', '/')// 注意 不能直接跳转 会导致其它页面跳转详情页后要返回2次才行
    //卸载组件 取消订阅
    return () => {
      PubSub.unsubscribe(messageSocket)
    }

    //在组件卸载的时候，关闭连接
    // return () => {
    //   closeWebSocket()
    // }
  }, [navigate])

  useEffect(() => {
    if (localStorage.getItem('firstLogin') === 'true') {
      setIsGuide(true)
      document.getElementsByTagName('body')[0].className = 'adm-overflow-hidden'
    }
  }, [])

  function onHandleCallBack(value) {
    setIsGuide(value)
  }

  function onHandleExperience(value) {
    setVersionUpdate(value)
  }

  const [environment, setEnvironment] = useState('')

  useEffect(() => {
    const url = location.href
    if (url.indexOf('8091') !== -1) {
      setEnvironment('(开发版)')
    }
    if (url.indexOf('8092') !== -1) {
      setEnvironment('(测试版)')
    }
  }, [])
  const requestDate1 = useRequest(url)
  async function getData1() {
    const res = await requestDate1(
      {
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
    let num = 0
    if (res.records !== undefined) {
      res.records.map((item) => {
        if (item.readFlag === '0') {
          num++
        }
      })
    }
    localStorage.setItem('newsAmount', JSON.stringify(num))
  }
  getData1()

  // 雷达跳转到首页处理  分别传入指标id、指标分类、显示隐藏导航栏、表头title
  const [metricId, setMetricId] = useState(searchParams.get('id'))
  let type, state, title
  if (searchParams.get('id')) {
    type = searchParams.get('type')
    state = searchParams.get('homeShowState')
    title = searchParams.get('title')
  }

  const titleText = activeTab === 'following' ? '关注' : '指标库' //
  return (
    <div className={styles.body}>
      {/* 根据雷达详情 切换不同的 标题 */}
      {state === '0' ? (
        <HeadTitle>{title}</HeadTitle>
      ) : (
        <HeadTitle>{titleText}</HeadTitle>
      )}
      {isGuide && <Guide callback={onHandleCallBack} />}
      {isVersionUpdate && (
        <VersionUpdate
          versionData={versionData}
          experience={onHandleExperience}
        />
      )}
      <div style={{ width: '100vw' }}>
        <div
          style={{
            // 雷达页面显示高度
            height:
              state === '0'
                ? 48
                : tabbarHeight + (activeTab === 'following' ? 42 : 52),
          }}
        />
        <div
          style={{
            position: 'fixed',
            zIndex: 999,
            backgroundColor: '#fff',
            top: 0,
            left: 0,
            right: 0,
          }}
          key={count}
        >
          {/* 根据状态参数判定是否隐藏关注tab */}
          {state !== '0' ? (
            <div
              className={styles.HeaderTabs}
              style={{
                height: tabbarHeight,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
            {activeTab && (
              <Tabs
                onChange={onTagChange}
                defaultActiveKey={activeTab}
                style={{
                  height: `${42}px`,
                  '--title-font-size': '15px',
                  borderBottom: 0,
                }}
              >
                <Tabs.Tab
                  title={`关注(${currentOriginFollowList.length})`}
                  key="following"
                />
                <Tabs.Tab title="指标库" key="metrics" />
              </Tabs>
            </div>
          ) : (
            ''
          )}
          <div style={{ height: 40 }}>
            {activeTab === 'following' ? (
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                }}
              >
                <HeaderPicker />
              </div>
            ) : (
              <div style={{ background: '#fff', padding: 10 }}>
                <SearchBar
                  style={{ '--border-radius': '20px' }}
                  placeholder="搜索"
                  onFocus={onSearchbarFocus}
                  value=""
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {activeTab === 'following' ? (
        <PullToRefresh
          onRefresh={async () => {
            await sleep(1000)
            setCount(count + 1)
          }}
        >
          <div key={count}>
            {/* {activeTab === 'following' ? <FollowList key={count} /> : <AppList />} */}
            <FollowList key={count} />
          </div>
        </PullToRefresh>
      ) : (
        <MetricGrid onTagChange={onTagChange} />
      )}
      <WaterMark {...props} />
    </div>
  )
}
