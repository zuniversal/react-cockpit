import { List, WaterMark } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import version from '@/assets/me/version/version.svg';
import { useCurrentApp, useRequest } from '@/tamp';
// import { useCurrentApp } from '@/contexts/apps/CurrentAppContext';
// import { useRequest } from '@/hooks/useRequest';
import styles from './index.module.less';
import { useModel } from 'umi';

function Version() {
  const [bodyHeight, setBodyHeight] = useState(0);
  const navigate = useNavigate();
  const url = '/sys/version/getSysPortalVersion';
  // const requestDate = useRequest(url);
  // const [currentData, setCurrentData] = useState();
  // console.log(' currentData ： ', currentData); //

  const { versionInfo, getCurrentVersionAsync } = useModel('me');
  const { user, indicator } = useModel('user');
  const { userInfo, token } = user;
  console.log(' user ： ', user);

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

  const [props, setProps] = useState(textProps);

  useEffect(() => {
    setBodyHeight(document.body.clientHeight);
    // getData();
    getCurrentVersionAsync({ productType: 1 });
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
    console.log('进入版本信息页面');
    const response = requestStart({
      pageName: '版本信息页面',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level2',
      requestUrlReal: window.location.pathname,
      requestUrl: '/version',
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
      console.log('退出版本信息页面');
    };
  }, []);

  // async function getData() {
  //   const res = await requestDate(
  //     {
  //       productType: 1,
  //     },
  //     {
  //       method: 'GET',
  //       headers: {
  //         'content-type': 'application/json',
  //         'X-Access-Token': token,
  //       },
  //     },
  //   );
  //   setCurrentData(res);
  // }

  function handleClick(url) {
    navigate(`${url}?id=${versionInfo.id}`);
  }
  return (
    <div className={styles.body} style={{ height: bodyHeight + 'px' }}>
      <div className={styles.version_img}>
        <img src={version} alt="" />
        <p>
          经营驾驶舱 Version {versionInfo ? versionInfo.releaseVersion : ''} （
          {versionInfo
            ? versionInfo.publishTime.substr(5, 5).replace('-', '.')
            : ''}
          ）
        </p>
      </div>
      <List style={{ color: '#000', '--font-size': '14px' }}>
        <List.Item
          onClick={() => {
            handleClick('/introduce');
          }}
          extra={<RightOutline />}
          arrow=""
        >
          功能介绍
        </List.Item>
        <List.Item
          onClick={() => {
            handleClick('/versionList');
          }}
          extra={<RightOutline />}
          arrow=""
        >
          版本信息
        </List.Item>
      </List>
      <WaterMark {...props} />
    </div>
  );
}

export default Version;
