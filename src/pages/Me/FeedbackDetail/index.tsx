import { useState, useEffect, useMemo } from 'react';
import styles from './index.module.less';
import { Empty } from '@/apps/empty/index';
import notifyEmptyImg from '@/assets/notify/notifyEmptyImg.svg';
// import { useRequest } from '../../hooks/useRequest'
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { WaterMark, ImageViewer } from 'antd-mobile';
import { getUrlParams } from '@/utils';
import sadEmpty from '@/assets/helpDetail/3.svg';
import happy from '@/assets/helpDetail/4.svg';
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel, useNavigate } from 'umi';
import { sendBuriedPoint } from '@/utils/index';
import moment from 'moment';

function FeedbackDetail(prop) {
  console.log(prop.title);
  const { feedback, getFeedbackAsync } = useModel('me');
  useEffect(() => {
    getFeedbackAsync({
      id: getUrlParams('id'),
    });
  }, []);
  // const { user, indicator } = useCurrentApp()
  const { user, indicator } = useModel('user');
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
  const [state, setState] = useState(false);
  const [props, setProps] = useState<{ [key: string]: any }>(textProps);
  const url = '/feedback/feedbackProblem/getUserFeedBackDetail';
  const [list, setList] = useState([]);
  const requestDate1 = useRequest(url);
  async function getData() {
    const res = await requestDate1(
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
    res.imgUrl = res.imgUrl && res.imgUrl.split(',');
    setList(res);
  }

  const navigate = useNavigate();
  function handleClick(url) {
    navigate(url);
  }
  useEffect(() => {
    // getData()
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
    console.log(`进入${prop.title}页面`);
    const response = requestStart({
      pageName: prop.title,
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level3',
      requestUrl: '/feedbackDetail',
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
      console.log(`退出${prop.title}页面`);
    };
  }, []);

  function getList(news) {
    if (news.length !== 0) {
      return (
        <div className={styles.bottomBox}>
          <p className={styles.bottomBoxLeft}>回复内容：</p>
          <p className={styles.bottomBoxRight}>
            {news[0].replyContent
              .replace(/<[^>]+>/g, '')
              .replace(/&nbsp;/g, ' ')}
          </p>
        </div>
      );
    } else {
      return (
        <Empty
          marginTop="60"
          src={notifyEmptyImg}
          paddingTop="50"
          paddingBottom="50"
        >
          还没有回复
        </Empty>
      );
    }
  }
  // 设定图片初始化放大
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className={styles.topBox}>
        <p>
          <span>问题内容：</span>
          {feedback && feedback.problemContent}
        </p>
        {feedback.sceneName && (
          <p>
            <span>具体场景：</span>
            {feedback && feedback.sceneName}
          </p>
        )}
        <div className={styles.topBoxImg}>
          {feedback.imgUrl &&
            feedback.imgUrl.map((item, index) => {
              return (
                <img
                  src={item}
                  key={index}
                  alt=""
                  width={42}
                  height={42}
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              );
            })}
          <ImageViewer.Multi
            images={feedback && feedback.imgUrl}
            visible={visible}
            defaultIndex={0}
            onClose={() => {
              setVisible(false);
            }}
          />
        </div>
        <p>
          <span>提交时间：</span>
          {feedback &&
            String(feedback.createTime).replace(/-/g, '.').substring(0, 10)}
        </p>
      </div>
      {feedback.feedbackReplyList && getList(feedback.feedbackReplyList)}

      <div className={styles.bottomBox_sub}>
        {state ? (
          <div className={styles.bottomBox_sub_btn}>
            <img src={sadEmpty} alt="" />
            <img src={happy} alt="" />
          </div>
        ) : (
          <div className={styles.bottomBox_sub_btn}>
            <img
              src={sadEmpty}
              alt=""
              onClick={() => {
                // 事件埋点
                sendBuriedPoint(
                  '我的',
                  'feedbackDetail',
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
                // 事件埋点
                sendBuriedPoint(
                  '我的',
                  'feedbackDetail',
                  '问题状态',
                  moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  `已解决`,
                );
                history.go(-1);
              }}
            />
          </div>
        )}
      </div>
      <WaterMark {...props} />
    </div>
  );
}

export default FeedbackDetail;
