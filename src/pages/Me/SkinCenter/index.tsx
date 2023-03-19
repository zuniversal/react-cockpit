import React, { useEffect, useMemo } from 'react';
import styles from './index.module.less';
import { Radio } from 'antd-mobile/es/components/radio/radio';
import SkinCenterImg from '@/assets/skinCenter/skinCenter.svg';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
// import { useRequest } from '../../hooks/useRequest'
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';

function SkinCenter() {
  const { user, indicator } = useModel('user');
  // const { user, indicator } = useCurrentApp()
  const { userInfo, token, chooseDate, dateType } = user; // 页面埋点
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
    console.log('进入皮肤中心');
    const response = requestStart({
      pageName: '皮肤中心页面',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level2',
      requestUrl: '/skinCenter',
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
      console.log('退出皮肤中心页面');
    };
  }, []);

  return (
    <div className={styles.skinCenter}>
      <p>主题中心</p>
      <div className={styles.skinCenterStyle}>
        <img src={SkinCenterImg} alt="" />
      </div>
      <div className={styles.skinCenterStyleBottomRadio}>
        <Radio style={{ '--icon-size': '14px' }} checked>
          默认主题
        </Radio>
      </div>
    </div>
  );
}

export default SkinCenter;
