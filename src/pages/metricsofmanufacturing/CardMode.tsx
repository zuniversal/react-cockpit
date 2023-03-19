import { Button, ErrorBlock } from 'antd-mobile';
import moment from 'moment';
import { useEffect, useState, useMemo } from 'react';

import empty from '../../assets/icons/no-data.svg';
import { LabelCard } from '../../components/card/LabelCard';
import { Loading } from '../../components/loading/Loading';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { tofixed, sendBuriedPoint } from '../../utils';
import { Empty } from '../empty/index';
import styles from './CardMode.module.less';
import { CardPie } from './CardPie';
import styles1 from './index.module.less';

export function CardMode() {
  // const { navigateToDetail, user, setLoading, setEndDate } = useCurrentApp()
  const { navigateToDetail, user, setLoading, setEndDate } = useModel('user');
  const { dateType, token } = user;
  const {
    query,
    data: data1,
    error,
  } = useQuery<{
    //分类汇总信息
    maxTime: string; // 截止时间
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
      capacityAchievemenTrate: number; //产能达成率千支
      capacityAchievemenTrateWh: number; //产能达成率GWH

      operationPlanQty: number; //规划产能（千支）
      operationPlanQtyWh: number; //规划产能（GWH）

      factoryStage: null;
      // 产能利用率（实际产能/规划产能）
      capacityUtilization: number; //0.28
      // 自定义icon 私有
      titleIcon: string;
      plannedCapacity: number;
    }[];
  }>('/productioninfo/selectProductionInfoClassify');
  useMemo(() => {
    if (data1) {
      setLoading();
    }
  }, [data1]);
  const [isGWH, setIsGWH] = useState(false);
  const [activeValue, setActiveValue] = useState({});
  useEffect(() => {
    query();
  }, [query]);

  useEffect(() => {
    if (!data1) return;
    setEndDate && setEndDate(data1.maxTime);
  }, [data1, setEndDate]);

  if (error) {
    return <ErrorBlock description={error.message} />;
  }

  if (!data1) {
    return <Loading style={{ height: '30vh', width: '90vw' }} />;
  }

  // 点击环形图右边图例和小卡片的联动
  function onCallBack(visible, value) {
    setActiveValue({
      ...activeValue,
      [value]: visible,
    });
  }
  if (data1.productionInfoClassifyList.length === 0) {
    return (
      <Empty src={empty} marginTop="90">
        暂无数据
      </Empty>
    );
  }
  return (
    <div className={styles.Card}>
      <div className={styles1.unitFont}>
        <Button
          style={{
            '--background-color': '#F4F6F9',
            '--border-radius': '20px',
            fontSize: '11px',
            paddingTop: 4,
            paddingBottom: 4,
          }}
          onClick={() => {
            setIsGWH(!isGWH);
            setActiveValue({});
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '维度切换',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `生产 ${isGWH ? '千支' : 'Gwh'}`,
            );
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
      </div>
      <div>
        <CardPie
          key={isGWH}
          isGWH={isGWH}
          onCallBack={onCallBack}
          {...{
            data1: data1.productionInfoClassifyList,
            customHtmlData1: {
              title: {
                type: '实际产能',
                value: (isGWH
                  ? data1.sumOuputQtyWh
                  : data1.sumOuputQty
                ).toFixed(2),
              },
              content: [
                {
                  type: '计划产能',
                  value: (isGWH
                    ? data1.sumPlanQtyWh
                    : data1.sumPlanQty
                  ).toFixed(2),
                },
                {
                  type: '产能达成率',
                  value:
                    (isGWH
                      ? data1.sumCapacityAchievemenTrateWh
                      : data1.sumCapacityAchievemenTrate) + '%',
                },
                {
                  type: '产能利用率',
                  value:
                    (isGWH
                      ? data1.sumCapacityUtilizationWh
                      : data1.sumCapacityUtilization) + '%',
                },
              ],
            },
          }}
        />
      </div>

      {/* 分类关联的卡片 */}
      <div
        className={styles.cards}
        style={
          data1.productionInfoClassifyList &&
          data1.productionInfoClassifyList.length > 2
            ? { '--columns': 2 }
            : { '--columns': 1 }
        }
      >
        {data1.productionInfoClassifyList.map((item) => {
          return (
            <LabelCard
              onClick={() => {
                navigateToDetail({
                  entity: item.entity,
                  unitMode: isGWH ? 'Gwh' : '千支',
                });
              }}
              titleIcon={require('../../assets/icons/position.svg')}
              key={item.entity}
              title={item.entity}
              bodyStyle={activeValue[item.entity]}
              rows={
                isGWH
                  ? [
                      {
                        value: '实际产能',
                        label: item.ouputQtyWh,
                        labelColor: '#09101D',
                        valueColor: 'rgba(9, 17, 26, 0.6)',
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          lineHeight: '18px',
                        },
                      },
                      {
                        label: item.planQtyWh, // label为value，value为label，样式需要。
                        value: '计划产能',
                        labelColor: '#09101D',
                        valueColor: 'rgba(9, 17, 26, 0.6)',
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          lineHeight: '18px',
                        },
                      },
                      {
                        value: '产能达成率',
                        labelColor: '#587AE3',
                        valueColor: 'rgba(9, 17, 26, 0.6)',
                        label: `${tofixed(item.capacityAchievemenTrateWh, 2)}%`,
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          lineHeight: '18px',
                        },
                      },
                    ]
                  : [
                      {
                        value: '实际产能',
                        labelColor: '#09101D',
                        valueColor: 'rgba(9, 17, 26, 0.6)',
                        label: item.ouputQty,
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          lineHeight: '18px',
                        },
                      },
                      {
                        value: '计划产能',
                        label: item.planQty,
                        labelColor: '#09101D',
                        valueColor: 'rgba(9, 17, 26, 0.6)',
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          lineHeight: '18px',
                        },
                      },
                      {
                        value: '产能达成率',
                        label: `${tofixed(item.capacityAchievemenTrate, 2)}%`,
                        labelColor: '#587AE3',
                        valueColor: 'rgba(9, 17, 26, 0.6)',
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          lineHeight: '18px',
                        },
                      },
                    ]
              }
            />
          );
        })}
        <div />
      </div>
    </div>
  );
}

export default CardMode;
