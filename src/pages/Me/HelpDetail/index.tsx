import { WaterMark } from 'antd-mobile';
import moment from 'moment';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import sadEmpty from '@/assets/helpDetail/3.svg';
import happy from '@/assets/helpDetail/4.svg';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
// import { useRequest } from '../../hooks/useRequest'
import { getUrlParams, sendBuriedPoint } from '@/utils';
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';
import styles from './index.module.less';

function HelpDetail() {
  const { problem, getProblemAsync } = useModel('me');
  useEffect(() => {
    getProblemAsync({
      id: getUrlParams('id'),
    });
  }, []);

  const [list, setList] = useState();
  // 定义按钮状态点击切换状态 false为未解决 true为已解决
  const [state, setState] = useState(false);
  const navigate = useNavigate();

  function handleClick(url) {
    navigate(url);
  }
  const url = '/commonproblem/commonProblem/queryById';
  const requestDate = useRequest(url);
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

  useEffect(() => {
    getData();
  }, []);

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
    console.log('进入常见问题页面');
    const response = requestStart({
      pageName: '常见问题',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level3',
      requestUrl: '/helpDetaile',
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
      console.log('退出常见问题页面');
    };
  }, []);

  async function getData() {
    const res = await requestDate(
      {
        id: getUrlParams('id'),
      },
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'X-Access-Token': token,
        },
      },
    );
    setList(res);
  }
  console.log(list);
  return (
    <>
      <div
        className={styles.box}
        style={{ height: document.body.clientHeight }}
      >
        {/* 问题解决展示 */}
        <div className={styles.list}>
          <h2>{problem && problem.problemName}</h2>
          <p
            className={styles.con}
            dangerouslySetInnerHTML={{ __html: problem && problem.solution }}
          />
        </div>
        {/* 底部切换按钮 */}
        <div className={styles.bottomBox}>
          {state ? (
            <div className={styles.bottomBox_btn}>
              <img src={sadEmpty} alt="" />
              <img src={happy} alt="" />
            </div>
          ) : (
            <div className={styles.bottomBox_btn}>
              <img
                src={sadEmpty}
                alt=""
                onClick={() => {
                  // 事件埋点
                  sendBuriedPoint(
                    '我的',
                    'helpDetail',
                    '问题状态',
                    moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    `未解决`,
                  );
                  handleClick('/problemFeedback');
                }}
              />
              <img
                src={happy}
                alt=""
                onClick={() => {
                  console.log(222);
                  // 事件埋点
                  sendBuriedPoint(
                    '我的',
                    'helpDetail',
                    '问题状态',
                    moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    `已解决`,
                  );
                  history.go(-1);
                }}
              />
            </div>
          )}

          {state ? (
            ''
          ) : (
            <p>
              仍然无法解决？点击
              <span onClick={() => handleClick('/problemFeedback')}>
                问题反馈
              </span>
            </p>
          )}
        </div>
      </div>
      <WaterMark {...props} />
    </>
  );
}

export default HelpDetail;
