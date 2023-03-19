import { useEffect, useMemo } from 'react';
// import { useRequest } from '../../hooks/useRequest'
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';

function VersionDetail() {
  const data = JSON.parse(localStorage.getItem('versionDetail'));
  // const { user, indicator } = useCurrentApp();
  const { user, indicator } = useModel('user');
  const { userInfo, token, chooseDate, dateType } = user;
  // 页面埋点
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
    console.log('进入版本更新页面');
    const response = requestStart({
      pageName: '版本更新',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level4',
      requestUrlReal: window.location.pathname,
      requestUrl: '/versionDetail',
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
      console.log('退出版本更新页面');
    };
  }, []);
  return (
    <div
      style={{ padding: '24px 16px', color: '#999' }}
      dangerouslySetInnerHTML={{ __html: data.versionContent }}
    />
  );
}

export default VersionDetail;
