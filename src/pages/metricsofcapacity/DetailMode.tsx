import { WaterMark } from 'antd-mobile';
import { useState } from 'react';

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import style from './Detail.module.less';
import { DetailChart } from './DetailChart';

console.log(' DetailMode xxxxxxxxxx 产能 ： ');
export function DetailMode() {
  console.log(' DetailMode ： ');
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
