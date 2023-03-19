import { Mix } from '@ant-design/plots';
import { useWindowWidth } from '@react-hook/window-size';
import { Button, Card, ErrorBlock, WaterMark } from 'antd-mobile';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useMatch, useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { tofixed, sendBuriedPoint, sendPagePoint } from '../../utils';
import { ManufacturingDualAxes } from './DetailDualAxes';
import { DetailTable } from './DetailTable';
import styles1 from './index.module.less';

export function DetailMode() {
  const [search] = useSearchParams();
  const entity = search.get('entity') ?? '';
  const [pageNo, setPageNo] = useState(1);
  const [factoryStage, setFactoryStage] = useState('');
  const [title, setTitle] = useState('全部');

  // 页面埋点
  const { user, indicator } = useCurrentApp();
  const { chooseDate, dateType, userInfo } = user;

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

  useEffect(() => {
    console.log('进入DetailMode页面');
    window.scrollTo(0, 0);
    let id;
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: entity ? `生产-${entity}` : '生产-实际产能',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
          entity,
        }),
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        requestUrl: '/productioninfo/selectProductionInfoClassify',
      });
      id = result;
    }
    fn();
    return () => {
      requestEnd({
        ID: id,
      });
      console.log('退出DetailMode页面');
    };
  }, []);

  const {
    data: data2,
    error: error1,
    query: query1,
  } = useQuery<{
    //分类汇总信息
    sumOuputQty: number; // 实际产能(千支)
    sumPlanQty: number; //计划产能（千支）
    sumOuputQtyWh: number; //实际产能(Gwh)
    sumPlanQtyWh: number; //计划产能（Gwh）
    sumCapacityAchievemenTrate: number; //产能达成率千支
    sumCapacityUtilization: number; //产能利用率千支
    sumCapacityAchievemenTrateWh: number; //产能达成率GWH
    sumCapacityUtilizationWh: number; // 产能利用率GWH
    sumOperationPlanQty: number; // 规划产能千支
    sumOperationPlanQtyWh: number; // 规划产能GWH
    productionInfoClassifyList: {
      entity: string; //'江苏'
      // 实际产能
      ouputQty: number; //20419.13
      // 规划产能
      planQty: number; //23268.66
      ouputQtyWh: number; //6.45
      planQtyWh: number; // 7.21
      // 达成率
      capacityAchievemenTrate: number; //88
      capacityAchievemenTrateWh: number; //88
      factoryStage: null;
      // 产能利用率（实际产能/规划产能）
      capacityUtilization: number; //0.28
      capacityUtilizationWh: number;
      // 自定义icon 私有
      titleIcon: string;
      plannedCapacity: number;

      operationPlanQty: number; //规划产能（千支）
      operationPlanQtyWh: number; // 规划产能（千支）
    }[];
  }>('/productioninfo/selectProductionInfoClassify');

  const { productionInfoClassifyList: data1 } = data2 || {};

  const [isGWH, setIsGWH] = useState(search.get('unitMode') === 'Gwh');
  const [columnData, lineData] = useMemo(() => {
    const columnData = [];
    const lineData = [];

    if (data1) {
      data1.forEach((item) => {
        if (isGWH) {
          if (entity === '') {
            columnData.push({
              company: item.entity,
              value: item.planQtyWh,
              name: '计划产能',
            });
            columnData.push({
              company: item.entity,
              value: item.ouputQtyWh,
              name: '实际产能',
            });
            lineData.push({
              company: item.entity,
              产能达成率: isNaN(
                Number(tofixed(item.capacityAchievemenTrateWh, 2)),
              )
                ? 0
                : Number(tofixed(item.capacityAchievemenTrateWh, 2)),
            });
          } else {
            columnData.push({
              company: item.factoryStage,
              value: item.planQtyWh,
              name: '计划产能',
            });
            columnData.push({
              company: item.factoryStage,
              value: item.ouputQtyWh,
              name: '实际产能',
            });
            lineData.push({
              company: item.factoryStage,
              产能达成率: isNaN(
                Number(tofixed(item.capacityAchievemenTrateWh, 2)),
              )
                ? 0
                : Number(tofixed(item.capacityAchievemenTrateWh, 2)),
            });
          }
        } else {
          if (entity === '') {
            columnData.push({
              company: item.entity,
              value: item.planQty,
              name: '计划产能',
            });
            columnData.push({
              company: item.entity,
              value: item.ouputQty,
              name: '实际产能',
            });
            lineData.push({
              company: item.entity,
              产能达成率: isNaN(
                Number(tofixed(item.capacityAchievemenTrate, 2)),
              )
                ? 0
                : Number(tofixed(item.capacityAchievemenTrate, 2)),
            });
          } else {
            columnData.push({
              company: item.factoryStage,
              value: item.planQty,
              name: '计划产能',
            });
            columnData.push({
              company: item.factoryStage,
              value: item.ouputQty,
              name: '实际产能',
            });
            lineData.push({
              company: item.factoryStage,
              产能达成率: isNaN(
                Number(tofixed(item.capacityAchievemenTrate, 2)),
              )
                ? 0
                : Number(tofixed(item.capacityAchievemenTrate, 2)),
            });
          }
        }
      });
    }

    return [columnData, lineData];
  }, [data1, entity, isGWH]);

  useEffect(() => {
    query1({
      // pageNo,
      entity,
    });
  }, [query1, entity, pageNo]);

  if (error1) {
    return <ErrorBlock description={error1.message} />;
  }

  const isGraphLoading = !data1;
  const isTableLoading = false;
  return (
    <div className={styles1.detailBox}>
      <HeadTitle>{entity ? `生产-${entity}` : '生产'}</HeadTitle>
      <div>
        <Card
          extra={
            <Button
              style={{
                '--background-color': '#F4F6F9',
                '--border-radius': '20px',
                fontSize: '11px',
                paddingTop: 4,
                paddingBottom: 4,
              }}
              onClick={() => {
                sendBuriedPoint(
                  '关注',
                  '/metrics/metricsofmanufacturing/detail',
                  '维度切换',
                  moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  `生产 ${isGWH ? '千支' : 'Gwh'}`,
                );
                setIsGWH(!isGWH);
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <img
                  style={{ width: 12, height: 12, marginRight: 4 }}
                  src={require('../../assets/icons/switch.svg')}
                />
                {isGWH ? 'Gwh' : '千支'}
              </div>
            </Button>
          }
        >
          <div className={styles1.unitFont}>
            <span>({isGWH ? 'Gwh' : '千支'})</span>
            <span style={{ float: 'right' }}>(百分比)</span>
          </div>
          <div>
            {!isGraphLoading && (
              <div
                style={{
                  height: '34.78vh',
                  width: '90vw',
                  position: 'relative',
                  zIndex: 103,
                }}
              >
                <ManufacturingDualAxes
                  columnData={columnData}
                  lineData={lineData}
                  setFactoryStage={setFactoryStage}
                  setTitle={setTitle}
                  entity={entity}
                  company={factoryStage}
                />
              </div>
            )}
            {isGraphLoading && (
              <Loading style={{ height: '34.78vh', width: '90vw' }} />
            )}
          </div>
        </Card>

        <div style={{ height: 10 }} />
        {!isTableLoading && (
          <DetailTable
            isGWH={isGWH}
            title={title}
            entity={entity}
            factoryStage={factoryStage}
          />
        )}
      </div>
      <WaterMark {...props} />
    </div>
  );
}

export default DetailMode;
