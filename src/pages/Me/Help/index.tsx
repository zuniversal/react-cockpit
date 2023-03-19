import { Button, List, WaterMark, InfiniteScroll } from 'antd-mobile';
import styles from './index.module.less';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RightOutline } from 'antd-mobile-icons';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
// import { useRequest } from '../../hooks/useRequest'
import style from './index.module.less';
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';

function Help() {
  const { problemList, getProblemListAsync } = useModel('me');
  useEffect(() => {
    getProblemListAsync({
      pageNo: 1,
      pageSize: 10,
    });
  }, []);

  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [listTotal, setListTotal] = useState(0);
  const { user, indicator } = useCurrentApp();
  const { userInfo, token } = user;
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
  function handleClick(url) {
    navigate(url);
  }
  const url = '/commonproblem/commonProblem/appList';
  const requestDate = useRequest(url);

  // 页面埋点
  const { chooseDate, dateType } = user;
  const requestStart = useRequest(
    '/datapageaccesslog/dataPageAccessLog/addLog',
  );
  const requestEnd = useRequest(
    '/datapageaccesslog/dataPageAccessLog/updateEndTime',
  );
  const indicatorUpdateTime = indicator?.updateTime;
  const formattedChooseDate = useMemo(() => {
    let date = chooseDate;
    if (indicatorUpdateTime) {
      const indicatorUpdateDate = new Date(indicatorUpdateTime);

      if (`${indicatorUpdateDate}` !== 'Invalid Date') {
        if (date.getTime() > indicatorUpdateDate.getTime()) {
          date = indicatorUpdateDate;
        }
      }
    }
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${m}-${d}`;
  }, [chooseDate, indicatorUpdateTime]);
  useEffect(() => {
    console.log('进入问题帮助页面');
    const response = requestStart({
      pageName: '问题帮助',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level2',
      requestUrl: '/help',
      requestUrlReal: window.location.pathname,
      platform: 'ckpt',
    });
    let id;
    response.then((data) => {
      id = data;
    });
    return () => {
      requestEnd({
        ID: id,
      });
      console.log('退出问题帮助');
    };
  }, []);

  const [hasMore, setHasMore] = useState(true);
  const [pages, setPages] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  async function loadMore() {
    const append = await mockRequest();
    setList((val) => [...val, ...append]);
    setHasMore(append.length > 0);
    setPageNo(pageNo + 1);
  }
  async function mockRequest() {
    if (pages < pageNo) {
      return [];
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
      },
    );
    setPages(res.pages);
    setListTotal(res.total);
    return res.records;
  }
  return (
    <>
      {/* 遍历问题字段列表 */}
      <List mode="card" className={styles.list} header="常见问题">
        {problemList &&
          problemList.map((item, index) => {
            return (
              <List.Item
                onClick={() => {
                  handleClick(`/helpDetail?id=${item.id}`);
                }}
                clickable
                arrow=""
                key={index}
                extra={<RightOutline />}
              >
                {item.problemName}
              </List.Item>
            );
          })}
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      <div style={{ height: '71px' }} />
      {/* 底部按钮 */}
      <div className={styles.btn}>
        <Button
          color="default"
          className={styles.btnStyle}
          onClick={() => handleClick('/feedback')}
        >
          反馈历史
        </Button>
        <i />
        <Button
          color="primary"
          style={{ '--background-color': '#fff', color: '#325AE7' }}
          className={styles.btnStyle}
          onClick={() => handleClick('/problemFeedback')}
        >
          问题反馈
        </Button>
      </div>
      <WaterMark {...props} />
    </>
  );
}

export default Help;
