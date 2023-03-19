import { Line } from '@antv/g2plot';
import { useWindowWidth } from '@react-hook/window-size';
import { Button, ErrorBlock } from 'antd-mobile';
import moment from 'moment';
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

import empty from '../../assets/icons/no-data.svg';
import { Loading } from '../../components/loading/Loading';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { tofixed, sendBuriedPoint } from '../../utils';
import { Empty } from '../empty/index';
import { Item } from '../home/Sortable/Item';
import styles from './CardMode.module.less';
import { Chart1 } from './Chart1';
import { AnalysisDualAxes } from './DualAxes';
import { AnalysisGauge } from './Gauge';
import styles1 from './index.module.less';

export const CardMode = () => {
  const windowWidth = useWindowWidth();
  const height = 0.65 * windowWidth;
  // const { user, navigateToDetail, setLoading, setEndDate } = useCurrentApp()
  const { user, navigateToDetail, setLoading, setEndDate } = useModel('user');

  const { dateType } = user;
  // 切换到日
  const isDay = useMemo(() => dateType === 'a', [dateType]);
  //产能
  const {
    error,
    data: ProductionCapacityData,
    query,
  } = useQuery('/productionCapacity/selectProductionCapacityList');
  useMemo(() => {
    if (ProductionCapacityData) {
      setLoading();
    }
  }, [ProductionCapacityData]);
  const [isGWH, setIsGWH] = useState(false);
  const [activeValue, setActiveValue] = useState({});
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query({ entity: '厦门' });
  }, [query]);

  useEffect(() => {
    if (!ProductionCapacityData) return;
    setEndDate && setEndDate(ProductionCapacityData.maxTime);
  }, [ProductionCapacityData, setEndDate]);

  //柱状图数据
  const ColumnData = useMemo(() => {
    const temp = [];
    if (
      ProductionCapacityData &&
      ProductionCapacityData.productionInfoClassifyList
    ) {
      const arr = ProductionCapacityData.productionInfoClassifyList;
      try {
        if (isGWH) {
          for (let i = 0; i < arr.length - 1; i++) {
            temp.push({
              factoryStage: arr[i].factoryStage,
              value: arr[i].planQtyWh,
              type: '计划产能',
            });
            temp.push({
              factoryStage: arr[i].factoryStage,
              value: arr[i].ouputQtyWh,
              type: '实际产能',
            });
            // temp.push({
            //   factoryStage: ProductionCapacityData[i].factoryStage,
            //   value: ProductionCapacityData[i].operationPlanQtyWh,
            //   type: '规划产能',
            // })
          }
        } else {
          for (let i = 0; i < arr.length - 1; i++) {
            temp.push({
              factoryStage: arr[i].factoryStage,
              value: arr[i].planQty,
              type: '计划产能',
            });
            temp.push({
              factoryStage: arr[i].factoryStage,
              value: arr[i].ouputQty,
              type: '实际产能',
            });
            // temp.push({
            //   factoryStage: ProductionCapacityData[i].factoryStage,
            //   value: ProductionCapacityData[i].operationPlanQty,
            //   type: '规划产能',
            // })
          }
        }
      } catch (error) {
        //console.log(error)
      }
    }
    return temp;
  }, [ProductionCapacityData, isGWH]);

  //折线图数据
  const LineData = useMemo(() => {
    const temp = [];
    if (
      ProductionCapacityData &&
      ProductionCapacityData.productionInfoClassifyList
    ) {
      const arr = ProductionCapacityData.productionInfoClassifyList;
      try {
        if (isGWH) {
          for (let i = 0; i < arr.length - 1; i++) {
            // temp.push({
            //   factoryStage: ProductionCapacityData[i].factoryStage,
            //   rate: ProductionCapacityData[i].capacityUtilizationWh,
            //   name: '产能利用率',
            // })
            temp.push({
              factoryStage: arr[i].factoryStage,
              产能达成率: arr[i].capacityAchievemenTrateWh,
              // name: '产能达成率',
            });
          }
        } else {
          for (let i = 0; i < arr.length - 1; i++) {
            // temp.push({
            //   factoryStage: ProductionCapacityData[i].factoryStage,
            //   rate: ProductionCapacityData[i].capacityUtilization,
            //   name: '产能利用率',
            // })
            temp.push({
              factoryStage: arr[i].factoryStage,
              产能达成率: arr[i].capacityAchievemenTrate,
              // name: '产能达成率',
            });
          }
        }
      } catch (error) {
        //console.log(error)
      }
    }
    return temp;
  }, [ProductionCapacityData, isGWH]);

  const TotalData = useMemo(() => {
    if (
      ProductionCapacityData &&
      ProductionCapacityData.productionInfoClassifyList
    ) {
      const arr = ProductionCapacityData.productionInfoClassifyList;
      try {
        if (arr[arr.length - 1]) {
          return arr[arr.length - 1];
        }
      } catch (error) {
        //console.log(error)
      }
    }
    return [];
  }, [ProductionCapacityData]);

  let isGraphLoading1 = true;
  if (TotalData.length != 0) {
    isGraphLoading1 = false;
  }

  let isGraphLoading2 = true;
  if (ColumnData.length != 0 && LineData.length != 0) {
    isGraphLoading2 = false;
  }
  if (
    ProductionCapacityData &&
    ProductionCapacityData.productionInfoClassifyList
  ) {
    if (ProductionCapacityData.productionInfoClassifyList.length === 0) {
      return (
        <Empty src={empty} marginTop="90">
          暂无数据
        </Empty>
      );
    }
  }
  console.log(ProductionCapacityData);
  if (error) {
    return <ErrorBlock description={error.message} />;
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
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '维度切换',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `产能 ${isGWH ? '千支' : 'Gwh'}`,
            );
            setIsGWH(!isGWH);
            setActiveValue({});
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          ></div>
        </Button>
      </div>
      {!isDay && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '12px',
            alignItems: 'stretch',
            padding: 10,
            height: '14vh',
            position: 'relative',
            zIndex: 103,
          }}
          key={isGWH}
        >
          {isGraphLoading1 && (
            <Loading style={{ height: '19vh', width: '85vw' }} />
          )}
          {!isGraphLoading1 && (
            <AnalysisGauge
              contentValue={
                isGWH
                  ? TotalData.capacityUtilizationWh / 100
                  : TotalData.capacityUtilization / 100
              }
              contentText="产能利用率"
            />
          )}
          {!isGraphLoading1 && (
            <AnalysisGauge
              contentValue={
                isGWH
                  ? TotalData.capacityAchievemenTrateWh / 100
                  : TotalData.capacityAchievemenTrate / 100
              }
              contentText="产能达成率"
            />
          )}
        </div>
      )}
      <div style={{ height: 10 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          padding: 10,
          marginTop: '2vh',
          height: '5vh',
        }}
      >
        {!isGraphLoading1 && (
          <div className={styles1.flexColumn}>
            <div className={styles1.cardFont}>
              {isGWH
                ? tofixed(TotalData.ouputQtyWh, 4)
                : tofixed(TotalData.ouputQty, 4)}
            </div>
            <div className={styles1.cardFont1}>
              实际产能({isGWH ? 'Gwh' : '千支'})
            </div>
          </div>
        )}
        {!isGraphLoading1 && (
          <div className={styles1.flexColumn}>
            <div className={styles1.cardFont2}>
              {isGWH
                ? tofixed(TotalData.planQtyWh, 4)
                : tofixed(TotalData.planQty, 4)}
            </div>
            <div className={styles1.cardFont1}>
              计划产能({isGWH ? 'Gwh' : '千支'})
            </div>
          </div>
        )}
        {!isGraphLoading1 && (
          <div className={styles1.flexColumn}>
            <div className={styles1.cardFont2}>
              {isDay
                ? tofixed(
                    isGWH
                      ? TotalData.capacityAchievemenTrateWh
                      : TotalData.capacityAchievemenTrate,
                    2,
                  ) + '%'
                : isGWH
                ? tofixed(TotalData.operationPlanQtyWh, 4)
                : tofixed(TotalData.operationPlanQty, 4)}
            </div>
            <div className={styles1.cardFont1}>
              {isDay ? '产能达成率' : `规划产能(${isGWH ? 'Gwh' : '千支'})`}
            </div>
          </div>
        )}
      </div>
      <div style={{ height: 10 }} />
      {/* {!isGraphLoading2 && (
        <div className={styles1.unitFont} style={{ marginBottom: '1vh' }}>
          ({isGWH ? 'Gwh' : '千支'})
        </div>
      )} */}
      {!isGraphLoading2 && (
        <div style={{ height: '31vh', position: 'relative', zIndex: 103 }}>
          {/* <AnalysisDualAxes
            key={isGWH}
            isGWH={isGWH}
            ColumnData={ColumnData}
            LineData={LineData}
          /> */}

          <Chart1
            key={isGWH}
            isGWH={isGWH}
            height={height}
            unit={isGWH ? 'Gwh' : '千支'}
            // ColumnData={ColumnData}
            // LineData={LineData}
            valueFields={
              isGWH
                ? ['planQtyWh', 'ouputQtyWh', 'capacityAchievemenTrateWh']
                : ['planQty', 'ouputQty', 'capacityAchievemenTrate']
            }
            onClickTooltip={(series) => {
              const factoryStage = series[0].name;
              navigateToDetail({
                factoryStage,
                unitMode: isGWH ? 'Gwh' : '千支',
              });
            }}
            nameField="factoryStage"
            data={
              ProductionCapacityData &&
              ProductionCapacityData.productionInfoClassifyList &&
              ProductionCapacityData.productionInfoClassifyList.filter(
                (item) => item.factoryStage !== 'total',
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default CardMode;
