import { WaterMark, Card, ErrorBlock } from 'antd-mobile';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import empty from '../../assets/icons/no-data.svg';
import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { Empty } from '../empty/index';
import { DemoDualAxes } from './DualAxesDetail';
import { sendPagePoint } from '../../utils/index';

export function DetailMode() {
  const [search] = useSearchParams();
  const applicationArea = search.get('applicationArea') ?? '';
  const type = search.get('type') ?? '';
  const segmentKey = search.get('segmentKey') ?? '';
  const { user, indicator } = useCurrentApp();
  const { userInfo } = user;
  const [isShow, setIsShow] = useState(false);
  const { error, data, query } = useQuery(
    '/marketanalysis/selectMarketAnalysisTrend',
  );
  useEffect(() => {
    if (type === '1') {
      query({ groupCustomer: applicationArea, applicationArea: segmentKey });
    } else {
      query({ vehicleModel: applicationArea, applicationArea: segmentKey });
    }
    setTimeout(() => {
      setIsShow(true);
    }, 500);
  }, [applicationArea, query, type, segmentKey]);

  // 页面埋点
  const { chooseDate, dateType } = user;
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
    let id;
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '市占与渗透',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        requestUrl: '/marketanalysis/selectMarketAnalysisTrend',
      });
      id = result;
    }
    fn();
    return () => {
      requestEnd({
        ID: id,
      });
      console.log('退出详情页页面');
    };
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

  const [props, setProps] = useState<{ [key: string]: any }>(textProps);

  const columnData = useMemo(() => {
    const temp = [];
    if (data && data.length > 0) {
      data.map((item) => {
        temp.push({
          name: item.eachMonth,
          type: '装机量',
          value: item.installedClientQty,
        });
      });
    }
    return temp;
  }, [data]);

  const lineData = useMemo(() => {
    const temp = [];
    if (data && data.length > 0) {
      data.map((item) => {
        temp.push({
          name: item.eachMonth,
          CALB渗透率: item.permeability,
        });
      });
    }
    return temp;
  }, [data]);

  if (!data) {
    return <Loading style={{ height: '30vh', width: '90vw' }} />;
  }

  if (data.length <= 0 && isShow) {
    return (
      <Empty src={empty} marginTop="34">
        暂无数据
      </Empty>
    );
  }

  if (error) {
    return <ErrorBlock description={error.message} />;
  }

  return (
    <>
      <HeadTitle>{`市场分析-${applicationArea}`}</HeadTitle>

      <Card headerStyle={{ borderBottom: 'none' }} title="近十二个月趋势">
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (Mwh)
        </div>
        <div style={{ position: 'relative', zIndex: 103 }}>
          <DemoDualAxes columnData={columnData} lineData={lineData} />
        </div>
      </Card>

      <WaterMark {...props} />
    </>
  );
}

export default DetailMode;
