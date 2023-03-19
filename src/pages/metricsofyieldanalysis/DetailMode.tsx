import { WaterMark } from 'antd-mobile';
import React, { useState, useEffect, useMemo, useRef } from 'react';

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { DetailChart } from './DetailChart';
import style from './index.module.less';

export function DetailMode() {
  const { user } = useCurrentApp();
  const { userInfo } = user;
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
    <div className={style.detailBox}>
      <DetailChart />
      <WaterMark {...props} />
    </div>
  );
}

export default DetailMode;
