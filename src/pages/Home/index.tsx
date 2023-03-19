import { SearchBar, Tabs, PullToRefresh, WaterMark } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import moment from 'moment';
// import { PubSub } from 'pubsub-js'
import { useCallback, useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
// import { useRequest } from '../../hooks/useRequest'
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';
import { sendBuriedPoint } from '../../utils/index';
// import { AppList } from './AppList'
import { FollowList } from './FollowList';
import { Guide } from './Guide';
import { HeaderPicker } from './HeaderPicker';
import { VersionUpdate } from './VersionUpdate';
import MetricGrid from './MetricGrid';
import styles from './styles.module.less';

console.log(' useCurrentApp ： ', useCurrentApp()); //

const tabbarHeight = 42;

export default function Home() {
  const [count, setCount] = useState(1);
  // const { user } = useCurrentApp()
  const { user } = useModel('user');
  const { currentOriginFollowList, userInfo, token } = user;
  console.log(' useruseruser ： ', user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'metrics' ? 'metrics' : 'following',
  );
  const url = '/sys/sysAnnouncementSend/getMyAnnouncementSend';
  const onSearchbarFocus = useCallback(() => {
    navigate('/search');
  }, [navigate]);

  const onTagChange = useCallback(
    (key: 'metrics' | 'following') => {
      setActiveTab(key);
      navigate(`/?tab=${key}`, { replace: true });

      // 事件埋点
      sendBuriedPoint(
        '关注',
        '/home',
        '维度切换',
        moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        `${key}` !== 'metrics' ? '关注' : '指标库',
      );
    },
    [navigate],
  );

  const { realname, username, id } = userInfo.userInfo;
  const textProps = {
    content: `${realname} ${username.substring(
      username.length - 4,
      username.length,
    )}`,
    gapX: 100,
    gapY: 100,
    fontSize: 12,
    fontColor: 'rgba(220, 221, 225, .6)',
    rotate: 0,
  };

  const [props, setProps] = useState<{ [key: string]: any }>(textProps);

  const [isGuide, setIsGuide] = useState(false);
  const [isVersionUpdate, setVersionUpdate] = useState(false);
  const [versionData, setVersionData] = useState();

  // useEffect(() => {
  //   //订阅 'message' 发布的发布的消息
  //   const messageSocket = PubSub.subscribe(
  //     'message',
  //     function (topic, message) {
  //       //message 为接收到的消息  这里进行业务处理
  //       setVersionUpdate(true)
  //       setVersionData(message)
  //     }
  //   )
  //   //卸载组件 取消订阅
  //   return () => {
  //     PubSub.unsubscribe(messageSocket)
  //   }

  //   //在组件卸载的时候，关闭连接
  //   // return () => {
  //   //   closeWebSocket()
  //   // }
  // }, [])

  useEffect(() => {
    if (localStorage.getItem('firstLogin') === 'true') {
      setIsGuide(true);
      document.getElementsByTagName('body')[0].className =
        'adm-overflow-hidden';
    }
  }, []);

  function onHandleCallBack(value) {
    setIsGuide(value);
  }

  function onHandleExperience(value) {
    setVersionUpdate(value);
  }

  const [environment, setEnvironment] = useState('');

  useEffect(() => {
    const url = location.href;
    if (url.indexOf('8091') !== -1) {
      setEnvironment('(开发版)');
    }
    if (url.indexOf('8092') !== -1) {
      setEnvironment('(测试版)');
    }
  }, []);
  const requestDate1 = useRequest(url);
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
      },
    );
    let num = 0;
    if (res.records !== undefined) {
      res.records.map((item) => {
        if (item.readFlag === '0') {
          num++;
        }
      });
    }
    localStorage.setItem('newsAmount', JSON.stringify(num));
  }
  getData1();

  return (
    <div className={styles.body}>
      <HeadTitle>{`经营驾驶舱${environment}`}</HeadTitle>
      {/* <HeadTitle>{activeTab === 'following' ? '关注' : '指标库'}</HeadTitle> */}
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
            height: tabbarHeight + (activeTab === 'following' ? 42 : 52),
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
        >
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
            <Tabs
              onChange={onTagChange}
              activeKey={activeTab}
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
            await sleep(1000);
            setCount(count + 1);
          }}
        >
          <FollowList />
        </PullToRefresh>
      ) : (
        <MetricGrid />
      )}
    </div>
  );
}
