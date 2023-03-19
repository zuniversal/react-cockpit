import { List, Empty, WaterMark } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
// import { useRequest } from '../../hooks/useRequest'
import { useCurrentApp, useRequest } from '@/tamp';
import styles from './index.module.less';
import noDataIcon from '@/assets/me/version/noData.svg';
import { useModel } from 'umi';

function VersionList() {
  const url = '/sys/version/getSysPortalOldVersion';
  const requestDate = useRequest(url);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // const { user, indicator } = useCurrentApp();
  const { user, indicator } = useModel('user');
  const { userInfo, token } = user;
  const { versionList, getVersionListAsync } = useModel('me');
  useEffect(() => {
    getVersionListAsync({ productType: 1 });
  }, []);

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

  // useEffect(() => {
  //   getData();
  // }, []);
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
      accessDepth: 'level3',
      requestUrlReal: window.location.pathname,
      requestUrl: '/versionList',
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

  async function getData() {
    const res = await requestDate(
      {
        // id: getUrlParams('id'),
        productType: 1,
      },
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'X-Access-Token': token,
        },
      },
    );
    setData(res);
  }

  function handleClick(item) {
    navigate(`/versionDetail`);
    localStorage.setItem('versionDetail', JSON.stringify(item));
  }
  return (
    <>
      <List
        className={styles.versionList}
        style={{ color: '#000', '--font-size': '14px' }}
      >
        {versionList &&
          versionList.map((item, index) => {
            return (
              <List.Item
                onClick={() => handleClick(item)}
                description={item.publishTime}
                clickable
                arrow=""
                extra={<RightOutline />}
                key={index}
              >
                {item.releaseVersion}版本更新
              </List.Item>
            );
          })}
      </List>
      {versionList.length <= 0 && (
        <div
          style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty
            image={noDataIcon}
            imageStyle={{ width: '35vw', position: 'relative', zIndex: 103 }}
            description={<div>还没有版本信息</div>}
          />
        </div>
      )}
      <WaterMark {...props} />
    </>
  );
}

export default VersionList;
