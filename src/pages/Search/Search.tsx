import { useWindowSize } from '@react-hook/window-size';
import {
  Button,
  Card,
  Empty,
  ErrorBlock,
  SearchBar,
  WaterMark,
  Tabs,
} from 'antd-mobile';
import cls from 'classnames';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useFollow } from '../../hooks/useFollow';
import { useQuery } from '../../hooks/useQuery';
import { sendBuriedPoint, debounce } from '../../utils/index';
import styles from './Search.module.less';
import { formatData, searchFilter } from './format';

export default function Search() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState('');
  const [activeTab, setActiveTab] = useState(null);

  const [windowWidth, windowHeight] = useWindowSize();
  const searchbar = useRef<any>();
  const { user } = useCurrentApp();
  const { currentName } = user;
  const [searchResult, setSearchResultFn] = useState({
    groups: [],
    apps: [],
    indicatorList: [],
  });
  const setSearchResult = (data) => {
    console.log(' setSearchResult ： ', data);
    setSearchResultFn(formatData(data));
  };
  const { appList, followList, userInfo, token } = user;
  console.log(' followList ： ', followList, searchResult, userInfo); //
  // const [tabActive, setTabActive] = useState(null)
  const SEARCH_TAB_KEY = userInfo?.userInfo?.id + '-searchTab';
  const [tabActive, setTabActive] = useState(
    localStorage.getItem(SEARCH_TAB_KEY),
  );
  console.log(' tabActive ： ', tabActive, userInfo?.userInfo?.id);
  const goPage = (item) => {
    console.log(' item ： ', item);
    localStorage.setItem(SEARCH_TAB_KEY, item.parentId);
    // navigate(`/search#${item.parentId}`)
    const url = `/?tab=following&id=${item.metricId}&type=${item.parentId}&homeShowState=0&title=${item.indicatorName}`;
    sendBuriedPoint({
      pageName: '搜索',
      pageAddress: `/search`,
      level1: `${currentName}-指标库-搜索`,
      eventName: '页面跳转',
      pageAfterName: item.parentName,
      pageAfterClick: url,
      eventType: 'page_jump',
      interfaceParam: '页面跳转 ' + item.parentName,
    });
    navigate(url);
  };

  const onTabChange = (key) => {
    console.log(' key ： ', key);
    localStorage.setItem(SEARCH_TAB_KEY, key);
    setTabActive(key);
    window.scrollTo({
      top: 0,
    });
    // navigate(`/search`)
    // navigate(`/search#${key}`)
  };

  // const { data, error, query } = useQuery('/indexlibrary/indexLibrary/appList')
  const { data, error, query } = useQuery('/sys/user/getUserInfo');
  const { follow, unfollow } = useFollow();
  const location = useLocation();
  const defaultActiveKey = location.hash.split('#')[1];

  const appsList = useMemo(() => {
    if (!appList) {
      return [];
    }

    const result = [];
    appList.forEach((item) => {
      if (item.children) {
        item.children.forEach((item2) => {
          result.push(item2.id);
        });
      }
    });
    return result;
  }, [appList]);

  useEffect(() => {
    query({}, { method: 'GET', body: null });
  }, [query]);

  const result = useMemo(() => {
    const result1 = { groups: [], apps: [] };
    if (data) {
      for (const group of data.indicatorPermissionList) {
        result1.groups.push({
          groupName: group.id,
          title: group.indicatorName,
        });
        if (group.child) {
          for (const item of group.child) {
            const metricId = item.frontComponent.slice('/metrics/'.length);
            let icon = require('../../assets/metricsicons/m0001.svg');
            try {
              icon = require(`../${metricId}/icon.svg`);
            } catch (e) {}
            result1.apps.push({
              ...item,
              parentId: group.id,
              groupName: group.id,
              metricId,
              followed: appsList.includes(item.id),
              icon,
            });
          }
        }
      }
    }
    setSearchResult(searchFilter(result1, keywords));
    return result1;
  }, [data, appsList]);

  const clickFollowButton = useCallback(
    (item: any, followd: boolean) => {
      if (followd) {
        unfollow(item);
      } else {
        follow(item);
      }
    },
    [follow, unfollow],
  );

  useEffect(() => {
    // 关注后会更新全局状态里的关注列表，改成loading状态，会导致组件销毁，
    // 这里一时没什么好的处理办法，先取消自动foucs
    // searchbar.current?.focus()
    window.scrollTo({
      top: 100,
    });
    setTimeout(() => {
      console.log(' xxxxxxxxx ： ');
      window.scrollTo({
        top: 0,
      });
    }, 100);
  }, [location.pathname]);

  function search(value) {
    // const res = { groups: [], apps: [] }
    // if (result.apps.length > 0 && result.groups.length > 0) {
    //   // res.apps = result.apps.filter((item) => item.indicatorName.match(value))
    //   res.apps = result.apps.filter((item) => item.indicatorName.includes(value))
    //   res.groups = result.groups.filter((item) =>
    //     res.apps.map((item1) => item1.parentId).includes(item.groupName)
    //   )
    // }
    window.scrollTo({
      top: 0,
    });
    const res = searchFilter(result, value);
    setKeywords(value);
    setSearchResult(res);
    if (value === '' || value === ' ') {
      setSearchResult(result);
    }
    debounce(() => {
      sendBuriedPoint({
        pageName: '搜索',
        pageAddress: `/search`,
        level1: `${currentName}-指标库-搜索`,
        eventName: '搜索',
        eventType: 'search',
        interfaceParam: value,
      });
    }, 2000);
  }

  const { realname, username } = userInfo.userInfo;
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

  if (error) {
    return <ErrorBlock description={error.message} />;
  }

  const heightStyle = {
    minHeight: windowHeight,
  };
  const MetricContent = !data ? (
    <Loading />
  ) : (
    <div className={styles.searchWrapper} style={heightStyle}>
      <div className={styles.searchTabbarWrapper}>
        {searchResult.indicatorList.map((group, i) => {
          const listComp = group.tagList.map((tagItem, index) => {
            return (
              <div className={styles.merticItem} key={tagItem.tagCode}>
                <div className={styles.subTitle}>{tagItem.tagName}</div>
                {tagItem.metricList.map((item) => {
                  const followed = followList.some((v) => v.id === item.id);
                  const onFocus = () => {
                    clickFollowButton(item, followed);
                    // 事件埋点
                    sendBuriedPoint({
                      pageName: '搜索',
                      pageAddress: `/search`,
                      level1: `${currentName}-指标库-搜索`,
                      eventName: followed ? '取消关注' : '关注',
                      interfaceParam: `${item.indicatorName} ${
                        followed ? '取消关注' : '关注'
                      }`,
                    });
                  };
                  const btnStyle = {
                    '--background-color': '#F3F3F3',
                    '--text-color': followed
                      ? `rgba(240, 74, 74, 0.8)`
                      : 'rgba(62, 120, 217, 1)',
                  };
                  return (
                    <div className={styles.merticRow} key={item.id}>
                      <div className={styles.icon}>
                        <img src={item.icon} alt="" />
                      </div>
                      <div
                        className={cls([
                          styles.merticRight,
                          {
                            [styles.lastMerticRight]: index === item.length - 1,
                          },
                        ])}
                      >
                        <span
                          className={styles.title}
                          onClick={() => goPage(item)}
                        >
                          {item.indicatorName}
                        </span>
                        <Button onClick={onFocus} size="small" style={btnStyle}>
                          {followed ? '取消关注' : '关注'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          });
          return (
            <div key={group.title}>
              <div
                onClick={() => onTabChange(group.groupName)}
                className={cls([
                  styles.tabs,
                  {
                    [styles.activeTab]: tabActive === group.groupName,
                  },
                ])}
              >
                {group.title}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.listCompWrapper}>
        {searchResult.indicatorList.map((group, i) => {
          const listComp = group.tagList.map((tagItem, index) => {
            return (
              <div className={styles.merticItem} key={tagItem.tagCode}>
                <div className={styles.subTitle}>{tagItem.tagName}</div>
                {tagItem.metricList.map((item) => {
                  const followed = followList.some((v) => v.id === item.id);
                  const onFocus = () => {
                    clickFollowButton(item, followed);
                    // 事件埋点
                    sendBuriedPoint({
                      pageName: '搜索',
                      pageAddress: `/search`,
                      level1: `${currentName}-指标库-搜索`,
                      eventName: followed ? '取消关注' : '关注',
                      interfaceParam: `${item.indicatorName} ${
                        followed ? '取消关注' : '关注'
                      }`,
                    });
                  };
                  const btnStyle = {
                    '--background-color': '#F3F3F3',
                    '--text-color': followed
                      ? `rgba(240, 74, 74, 0.8)`
                      : 'rgba(62, 120, 217, 1)',
                  };
                  return (
                    <div className={styles.merticRow} key={item.id}>
                      <div className={styles.icon}>
                        <img src={item.icon} alt="" />
                      </div>
                      <div
                        className={cls([
                          styles.merticRight,
                          {
                            [styles.lastMerticRight]: index === item.length - 1,
                          },
                        ])}
                      >
                        <span
                          className={styles.title}
                          onClick={() => goPage(item)}
                        >
                          {item.indicatorName}
                        </span>
                        <Button onClick={onFocus} size="small" style={btnStyle}>
                          {followed ? '取消关注' : '关注'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          });
          return tabActive === group.groupName ? listComp : null;
        })}
      </div>
      {/* <Tabs
        onChange={(key) => {
          onTabChange(key)
          const title = searchResult.indicatorList.find(
            (item) => item.groupName === key
          )?.title
          sendBuriedPoint({
            pageName: '搜索',
            pageAddress: `/search`,
            level1: `${currentName}-指标库-搜索`,
            eventName: '维度切换',
            interfaceParam: `维度切换 ${title}`,
          })
        }}
        // activeKey={activeTab}
        defaultActiveKey={tabActive}
        className={styles.searchTabbar}
      >
        {searchResult.indicatorList.map((group, i) => {
          // const dataList = group.tagList.filter(
          //   (item) => item.groupName === group.groupName
          // )
          const listComp = group.tagList.map((tagItem, index) => {
            return (
              <div className={styles.merticItem} key={tagItem.tagCode}>
                <div className={styles.subTitle}>{tagItem.tagName}</div>
                {tagItem.metricList.map((item) => {
                  const followed = followList.some((v) => v.id === item.id)
                  const onFocus = () => {
                    clickFollowButton(item, followed)
                    // 事件埋点
                    sendBuriedPoint({
                      pageName: '搜索',
                      pageAddress: `/search`,
                      level1: `${currentName}-指标库-搜索`,
                      eventName: followed ? '取消关注' : '关注',
                      interfaceParam: `${item.indicatorName} ${
                        followed ? '取消关注' : '关注'
                      }`,
                    })
                  }
                  const btnStyle = {
                    '--background-color': '#F3F3F3',
                    '--text-color': followed
                      ? `rgba(240, 74, 74, 0.8)`
                      : 'rgba(62, 120, 217, 1)',
                  }
                  return (
                    <div className={styles.merticRow} key={item.id}>
                      <div className={styles.icon}>
                        <img src={item.icon} alt="" />
                      </div>
                      <div
                        className={cls([
                          styles.merticRight,
                          {
                            [styles.lastMerticRight]: index === item.length - 1,
                          },
                        ])}
                      >
                        <span
                          className={styles.title}
                          onClick={() => goPage(item)}
                        >
                          {item.indicatorName}
                        </span>
                        <Button onClick={onFocus} size="small" style={btnStyle}>
                          {followed ? '取消关注' : '关注'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })
          const title = group.title
          return (
            <Tabs.Tab title={title} key={group.groupName}>
              {listComp}
            </Tabs.Tab>
          )
        })}
      </Tabs> */}
    </div>
  );

  return (
    <div className={styles.searchBox}>
      <HeadTitle>添加指标</HeadTitle>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchBarPh} />
        <div className={styles.searchBarPh2} />
        <SearchBar
          onChange={search}
          ref={searchbar}
          placeholder="搜索"
          style={{ '--border-radius': '20px' }}
        />
      </div>
      {MetricContent}
      <WaterMark {...props} />
    </div>
  );
}
