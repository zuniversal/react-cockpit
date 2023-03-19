import { WaterMark } from 'antd-mobile';
import React, { useState, useEffect, useMemo } from 'react';
import { useMatch, useSearchParams } from 'react-router-dom';

import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import style from './Detail.module.less';
import { DetailChart } from './DetailChart';
import { DetailTable } from './DetailTable';

export function DetailMode() {
  // 柱状图，表格共用的参数
  const [tabKey, setTabKey] = useState('1');
  const [search] = useSearchParams();
  const applicationArea = search.get('applicationArea') ?? '';
  const segmentKey = search.get('segmentKey') ?? ''; // 报价成本 1       实际成本 2
  const [key1, setKey1] = useState(segmentKey); // 报价成本 1       实际成本 2
  const [chooseName, setChooseName] = useState('');
  const [chooseNameType, setChooseNameType] = useState('');
  const [title, setTableTitle] = useState('全部');

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

  const isTableLoading = false;
  const {
    error: error1,
    data: selectMarginalAmountDeliveryTypeData,
    query: query1,
  } = useQuery('/marginalAmount/selectMarginalAmountDeliveryType');

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query1({ chooseName, chooseNameType, applicationArea });
  }, [query1, chooseName, chooseNameType, applicationArea, key1]);

  const view = search.get('view') === 'table' ? 'table' : 'detail';

  const [marginalAmountActualSum, marginalAmountStandardSum, sortableColumns] =
    useMemo(() => {
      let a = 0;
      let b = 0;
      const temp = [];
      if (selectMarginalAmountDeliveryTypeData) {
        selectMarginalAmountDeliveryTypeData.map((item, index) => {
          if (item.marginalAmountActual >= 0) {
            a += item.marginalAmountActual;
          }
          if (item.marginalAmountStandard >= 0) {
            b += item.marginalAmountStandard;
          }
          temp.push({ deliveryType: item.deliveryType });
        });
      }
      return [a, b, temp];
    }, [selectMarginalAmountDeliveryTypeData]);

  const data1 = useMemo(() => {
    const temp = [];
    if (selectMarginalAmountDeliveryTypeData) {
      try {
        if (key1 == '1') {
          selectMarginalAmountDeliveryTypeData.map((item, index) => {
            temp.push({
              type: item.deliveryType,
              value: item.marginalAmountStandard,
              percent:
                marginalAmountStandardSum === 0
                  ? 0
                  : item.marginalAmountStandard < 0
                  ? '/'
                  : (item.marginalAmountStandard / marginalAmountStandardSum) *
                    100,
            });
          });
        } else {
          selectMarginalAmountDeliveryTypeData.map((item, index) => {
            temp.push({
              type: item.deliveryType,
              value: item.marginalAmountActual,
              percent:
                marginalAmountActualSum === 0
                  ? 0
                  : item.marginalAmountActual < 0
                  ? '/'
                  : (item.marginalAmountActual / marginalAmountActualSum) * 100,
            });
          });
        }
      } catch (error) {}
    }
    const temp1 = temp.sort(function (a, b) {
      return b.value - a.value; //实按降序排序
    });

    return temp1;
  }, [selectMarginalAmountDeliveryTypeData]);

  if (view === 'table') {
    if (isTableLoading) {
      return <Loading />;
    }

    return (
      <div className={style.detailBox}>
        <DetailTable
          title={title}
          chooseNameType={chooseNameType}
          chooseName={chooseName}
          sortableColumns={sortableColumns}
          key1={key1}
          segmentKey={segmentKey}
        />
        <WaterMark {...props} />
      </div>
    );
  } else {
    return (
      <div className={style.detailBox}>
        <DetailChart
          tabKey={tabKey}
          setTabKey={setTabKey}
          setChooseNameType={setChooseNameType}
          chooseName={chooseName}
          setChooseName={setChooseName}
          setTableTitle={setTableTitle}
          data1={data1}
          key1={key1}
          setKey1={setKey1}
          segmentKey={segmentKey}
        />
        <WaterMark {...props} />
      </div>
    );
  }
}

export default DetailMode;