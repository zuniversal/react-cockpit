import { Avatar, WaterMark, InfiniteScroll } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useEffect, useState, useMemo } from 'react';
import styles from './index.module.less';
import notifyImg from '@/assets/notify/notifyImg.svg';
import notifyEmptyImg from '@/assets/notify/notifyEmptyImg.svg';
import { useNavigate } from 'react-router-dom';
import { Empty } from '@/apps/empty/index';
// import { useRequest } from '../../hooks/useRequest'
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';

function Notify() {
  const [bodyHeight, setBodyHeight] = useState(0);
  // const { user, indicator } = useCurrentApp();
  // const { userInfo, token } = user;
  const { user, indicator } = useModel('user');
  const { userInfo, token } = user;
  const { notifyList, getNotifyListAsync } = useModel('me');
  useEffect(() => {
    getNotifyListAsync({
      pageNo: 1,
      pageSize: 10,
      id: userInfo.userInfo.id,
    });
  }, []);
  const [listTotal, setListTotal] = useState(0);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const url = 'feedback/feedbackProblem/getMyAnnouncementSend';
  useEffect(() => {
    setBodyHeight(document.body.clientHeight);
    getData1();
  }, []);
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
    console.log('进入消息页面');
    const response = requestStart({
      pageName: '消息通知页面',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level2',
      requestUrl: '/notify',
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
      console.log('退出消息页面');
    };
  }, []);
  const [arr, setArr] = useState([]);
  // 查询所有类型消息数据
  const requestDate = useRequest(url);
  const [hasMore, setHasMore] = useState(false);
  const [pages, setPages] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  async function loadMore() {
    const append = await mockRequest();
    console.log(append);
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
    setPages(res.pages);
    setListTotal(res.total);

    return res.records;
  }

  // 更改用户阅读状态
  async function getData1() {
    fetch('api/feedback/feedbackProblem/editMessageStatusUserId', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token,
      },
      body: JSON.stringify({}),
    }).then((data) => {
      localStorage.setItem('newsAmount', '0');
    });
  }
  function getJsx(time) {
    console.log(time);
    const item = time.sendTimeTemp;

    if (item.length > 8) {
      return (
        <div className={styles.timeBox}>
          <div className={styles.time}>
            {item.isSameMinute !== 'true' && time.isOneFirst === '1'
              ? item.substr(5, 11).replace('-', '月').replace(' ', '日 ')
              : ''}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.timeBox}>
          <div className={styles.time}>
            {item.isSameMinute !== 'true' && time.isOneFirst === '1'
              ? item.substr(0, 5)
              : ''}
          </div>
        </div>
      );
    }
  }
  function handleClick(url) {
    navigate(url);
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
  return (
    <div className={styles.body} style={{ height: bodyHeight + 'px' }}>
      <div>
        {notifyList ? (
          notifyList.map((item, index) => {
            if (item.msgCategory === '4') {
              return (
                <div key={index}>
                  {getJsx(item)}
                  <div className={styles.bottomBox}>
                    <div className={styles.leftImg}>
                      <Avatar
                        src={notifyImg}
                        style={{ '--size': '35px', '--border-radius': '5px' }}
                      ></Avatar>
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
                            `/feedbackDetail?type=notify&id=${item.feedbackId}`,
                          )
                        }
                      >
                        查看详细
                        <RightOutline />
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else if (
              item.msgCategory === '3' ||
              item.msgCategory === '2' ||
              item.msgCategory === '1'
            ) {
              return (
                <div key={index}>
                  {getJsx(item)}
                  {/* {getJsx(item.sendTimeTemp)} */}
                  <div className={styles.bottomBox}>
                    <div className={styles.leftImg}>
                      <Avatar
                        src={notifyImg}
                        style={{ '--size': '35px', '--border-radius': '5px' }}
                      ></Avatar>
                    </div>
                    <div className={styles.rightBox}>
                      <h2>{item.titile}</h2>
                      <div
                        className={styles.imgStyle}
                        dangerouslySetInnerHTML={{ __html: item.msgContent }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })
        ) : (
          <Empty src={notifyEmptyImg}>还没有消息通知</Empty>
        )}
      </div>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      <WaterMark {...props} />
    </div>
  );
}

export default Notify;
