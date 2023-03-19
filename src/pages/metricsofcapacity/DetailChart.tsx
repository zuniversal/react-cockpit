import { Button, Card, ErrorBlock } from 'antd-mobile';

import moment from 'moment';
import { useState, useEffect, useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import empty from '../../assets/icons/no-data.svg';
import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { SegmentedControls } from '../../components/tabs/SegmentedControls';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { sendBuriedPoint, sendPagePoint } from '../../utils/index';
import { Empty } from '../empty/index';
import style from './Detail.module.less';
import { Analysis1DualAxes } from './DetailDualAxes1';
import styles1 from './index.module.less';
export function DetailChart(props) {
  const { user, indicator } = useCurrentApp();
  const { chooseDate, dateType } = user;
  const [search] = useSearchParams();
  const factoryStage = search.get('factoryStage') ?? '';
  const [isGWH, setIsGWH] = useState(search.get('unitMode') === 'Gwh');
  console.log(isGWH);

  // 顶部切换卡片内容
  const [segmentKey, setSegmentedControlsActiveKey] = useState('1');
  const [type, setType] = useState('产线');

  const [pageNo, setPageNo] = useState(1);
  const [pages, setPages] = useState(1);
  // 页面埋点
  const applicationArea = search.get('applicationArea') ?? '';

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
        pageName: applicationArea === '' ? '产能' : `产能-${applicationArea}`,
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
          pageNo,
          applicationArea,
        }),
        requestUrl: '/productionCapacity/selectProductionCapacityList',
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        level1: '厦门制造-关注页-产能',
        level2: `厦门制造-关注页-产能-${
          isGWH ? '千支' : 'Gwh'
        } ${factoryStage}`,
      });
      id = result;
    }
    fn();
    return () => {
      id &&
        requestEnd({
          ID: id,
        });
    };
  }, []);

  //产能
  const { error, data, query } = useQuery(
    '/productionCapacity/selectProductionCapacityList',
  );

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query({ entity: '厦门', factoryStage, type });
  }, [factoryStage, query, type]);

  const { productionInfoClassifyList: ProductionCapacityData } = data || {
    productionInfoClassifyList: [],
  };

  //柱状图数据
  const ColumnData = useMemo(() => {
    const temp = [];
    if (ProductionCapacityData) {
      // 产线
      if (segmentKey == '1') {
        try {
          if (isGWH) {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].prodLineCode,
              //   value: ProductionCapacityData[i].operationPlanQtyWh,
              //   type: '规划产能',
              // })
              temp.push({
                factoryStage: ProductionCapacityData[i].prodLineCode,
                value: ProductionCapacityData[i].ouputQtyWh,
                type: '实际产能',
              });
              temp.push({
                factoryStage: ProductionCapacityData[i].prodLineCode,
                value: ProductionCapacityData[i].planQtyWh,
                type: '计划产能',
              });
            }
          } else {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].prodLineCode,
              //   value: ProductionCapacityData[i].operationPlanQty,
              //   type: '规划产能',
              // })
              temp.push({
                factoryStage: ProductionCapacityData[i].prodLineCode,
                value: ProductionCapacityData[i].ouputQty,
                type: '实际产能',
              });
              temp.push({
                factoryStage: ProductionCapacityData[i].prodLineCode,
                value: ProductionCapacityData[i].planQty,
                type: '计划产能',
              });
            }
          }
        } catch (error) {
          //console.log(error)
        }
      } else {
        try {
          if (isGWH) {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].modelNum,
              //   value: ProductionCapacityData[i].operationPlanQtyWh,
              //   type: '规划产能',
              // })
              temp.push({
                factoryStage: ProductionCapacityData[i].modelNum,
                value: ProductionCapacityData[i].ouputQtyWh,
                type: '实际产能',
              });
              temp.push({
                factoryStage: ProductionCapacityData[i].modelNum,
                value: ProductionCapacityData[i].planQtyWh,
                type: '计划产能',
              });
            }
          } else {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].modelNum,
              //   value: ProductionCapacityData[i].operationPlanQty,
              //   type: '规划产能',
              // })
              temp.push({
                factoryStage: ProductionCapacityData[i].modelNum,
                value: ProductionCapacityData[i].ouputQty,
                type: '实际产能',
              });
              temp.push({
                factoryStage: ProductionCapacityData[i].modelNum,
                value: ProductionCapacityData[i].planQty,
                type: '计划产能',
              });
            }
          }
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp.reverse();
  }, [ProductionCapacityData, isGWH]);

  //折线图数据
  const LineData = useMemo(() => {
    const temp = [];
    if (ProductionCapacityData) {
      if (segmentKey == '1') {
        try {
          if (isGWH) {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              temp.push({
                factoryStage: ProductionCapacityData[i].prodLineCode,
                产能达成率: ProductionCapacityData[i].capacityAchievemenTrateWh,
                // name: '产能达成率',
              });
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].prodLineCode,
              //   rate: ProductionCapacityData[i].capacityUtilizationWh,
              //   name: '产能利用率',
              // })
            }
          } else {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              temp.push({
                factoryStage: ProductionCapacityData[i].prodLineCode,
                产能达成率: ProductionCapacityData[i].capacityAchievemenTrate,
                // name: '产能达成率',
              });
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].prodLineCode,
              //   rate: ProductionCapacityData[i].capacityUtilization,
              //   name: '产能利用率',
              // })
            }
          }
        } catch (error) {
          //console.log(error)
        }
      } else {
        try {
          if (isGWH) {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              temp.push({
                factoryStage: ProductionCapacityData[i].modelNum,
                产能达成率: ProductionCapacityData[i].capacityAchievemenTrateWh,
                // name: '产能达成率',
              });
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].modelNum,
              //   rate: ProductionCapacityData[i].capacityUtilizationWh,
              //   name: '产能利用率',
              // })
            }
          } else {
            for (let i = 0; i < ProductionCapacityData.length; i++) {
              temp.push({
                factoryStage: ProductionCapacityData[i].modelNum,
                产能达成率: ProductionCapacityData[i].capacityAchievemenTrate,
                // name: '产能达成率',
              });
              // temp.push({
              //   factoryStage: ProductionCapacityData[i].modelNum,
              //   rate: ProductionCapacityData[i].capacityUtilization,
              //   name: '产能利用率',
              // })
            }
          }
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp.reverse();
  }, [ProductionCapacityData, isGWH]);

  if (error) {
    return <ErrorBlock description={error.message} />;
  }

  return (
    <>
      <HeadTitle>
        {factoryStage === '' ? '产能' : `产能-${factoryStage}`}
      </HeadTitle>
      <Card>
        <SegmentedControls
          className={style.detailTop}
          activeKey={segmentKey}
          onChange={(key) => {
            // 事件埋点
            sendBuriedPoint({
              pageName: '产能',
              pageAddress: '/metrics/metricsofcapacity/detail',
              eventName: '维度切换',
              interfaceParam: `产能 ${key === '1' ? '产线' : '型号'}`,
              level1: '厦门制造-关注页-产能',
              level2: `厦门制造-关注页-产能-${
                isGWH ? '千支' : 'Gwh'
              } ${factoryStage}`,
            });
            setSegmentedControlsActiveKey(key);
            if (key == '1') {
              setType('产线');
            } else {
              setType('型号');
            }
          }}
          tabs={[
            { key: '1', title: '产线' },
            { key: '2', title: '型号' },
          ]}
        />
        <div className={styles1.unitFont1}>
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
              sendBuriedPoint({
                pageName: '产能',
                pageAddress: '/metrics/metricsofcapacity/detail',
                eventName: '维度切换',
                interfaceParam: `产能 ${isGWH ? 'Gwh' : '千支'}`,
                level1: '厦门制造-关注页-产能',
                level2: `厦门制造-关注页-产能-${
                  isGWH ? '千支' : 'Gwh'
                } ${factoryStage}`,
              });
              setIsGWH(!isGWH);
              // setActiveValue({})
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
        <div className={styles1.unitFont} style={{ marginBottom: '1vh' }}>
          ({isGWH ? 'Gwh' : '千支'})
        </div>
        {data ? (
          <>
            {ProductionCapacityData.length > 0 ? (
              <div
                style={{
                  height: '34.78vh',
                  width: '90vw',
                  position: 'relative',
                  zIndex: 103,
                }}
              >
                <Analysis1DualAxes
                  key={isGWH}
                  ColumnData={ColumnData}
                  LineData={LineData}
                />
              </div>
            ) : (
              <Empty src={empty} marginTop="70">
                暂无数据
              </Empty>
            )}
          </>
        ) : (
          <Loading style={{ height: '34.78vh', width: '90vw' }} />
        )}
      </Card>
    </>
  );
}
