import { Tabs } from 'antd-mobile';

import React, { useState } from 'react';

import { HeadTitle } from '../../components/helmet';
import { getUrlParams } from '../../utils';
import { DemoDualAxes } from './Pie2';
import { TabPie1 } from './TabPie1';
import { TabPie2 } from './TabPie2';
import { TabPie3 } from './TabPie3';
import { TabPie4 } from './TabPie4';
import { TabPie5 } from './TabPie5';
import { TabPie6 } from './TabPie6';
import { TabPie7 } from './TabPie7';

import style1 from './detailMode.module.less';
export function DetailMode(props) {
  const [title, setTitle] = useState<string>('');

  const getChildTitle = (val: string) => {
    setTitle(val);
  };
  const switchTitle = getUrlParams('title');
  return (
    <>
      <HeadTitle>{`人员结构-${switchTitle}`}</HeadTitle>
      <div className={style1.box}>
        <div className={style1.topBox}>
          <div className={style1.topBox_list}>
            <DemoDualAxes getChildTitle={getChildTitle} />
          </div>

          <div />
        </div>
        <div className={style1.bottomBox}>
          <h2>人员分布-{title ? title : '全部'}</h2>
          <Tabs>
            <Tabs.Tab title="公司" key="0">
              <TabPie1 title={title} />
            </Tabs.Tab>
            <Tabs.Tab title="学历" key="1">
              <TabPie2 title={title} />
            </Tabs.Tab>
            <Tabs.Tab title="司龄" key="2">
              <TabPie3 title={title} />
            </Tabs.Tab>
            <Tabs.Tab title="年龄性别" key="3">
              <TabPie4 title={title} />
            </Tabs.Tab>
            <Tabs.Tab title="员工类别" key="4">
              <TabPie5 title={title} />
            </Tabs.Tab>
            <Tabs.Tab title="通道" key="5">
              <TabPie6 title={title} />
            </Tabs.Tab>
            <Tabs.Tab title="职级" key="6">
              <TabPie7 title={title} />
            </Tabs.Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default DetailMode;
