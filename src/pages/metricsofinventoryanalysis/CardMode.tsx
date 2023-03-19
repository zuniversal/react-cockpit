import { ErrorBlock, Button, Card } from 'antd-mobile';
import moment from 'moment';
import React, { useState, useEffect, useMemo } from 'react';

import beforeIcon from '../../assets/icons/beforeIcon.svg';
import empty from '../../assets/icons/no-data.svg';
import empty1 from '../../assets/icons/no.svg';
import { Loading } from '../../components/loading/Loading';
import { SegmentedControls } from '../../components/tabs/SegmentedControls';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { Empty } from '../empty/index';
import { rawData3 } from '../metricsofmarefficiencyanalysisxm/Components/data';
import { Chart1 } from './Chart1';
import { Cost } from './Cost';
import { DemoDualAxes } from './DualAxes';
import { KeyRawMeterial } from './KeyRawMeterial';
import { GrossProfitAmountPie } from './Pie';
import styles from './styles.module.less';
import switchIcon from '@/assets/icons/switch.svg';

function Segment1(props) {
  // const { user, navigateToDetail, cache, setCache } = useCurrentApp()
  const { user, navigateToDetail, cache, setCache } = useModel('user');

  const { segmentKey } = props;

  /**
   * 库存效率：成品（false）/原材料（true）
   */
  // const [isGWH1, setIsGWH1] = useState(false)

  // const isGWH1 = cache.isGWH1 ?? false
  // const setIsGWH1 = (key) => setCache({ isGWH1: key })
  const isChange = cache.isChange ?? false;
  const { isHistoryDate, dateType } = user;

  /**
   * 库存分析-库存效率-原材料
   */
  const {
    error: error3,
    data: inventoryanalysisData3,
    query: query3,
  } = useQuery('/storageAnalysis/selectStorageMatList');

  const {
    error: error2,
    data: inventoryanalysisData2,
    query: query2,
  } = useQuery('/storageAnalysis/selectStorageProList');

  useEffect(() => {
    // if (dateType !== 'a') {
    if (isChange) {
      query3({ storageType: segmentKey });
    } else {
      query2({ storageType: segmentKey });
    }
    // }
  }, [segmentKey, isChange, dateType, query3, query2]);

  return (
    <div style={{ position: 'relative' }}>
      {(() => {
        return (
          <>
            <div style={{ position: 'relative', zIndex: 103 }}>
              {isHistoryDate ? (
                <Empty src={empty} marginTop="70">
                  历史情况暂未上线，敬请期待
                </Empty>
              ) : (
                <>
                  <div
                    style={{
                      height: 28,
                      paddingLeft: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img src={beforeIcon} alt="" />
                    <span
                      style={{
                        color: '#00000073',
                        fontFamily: 'PingFang SC',
                        fontSize: 11,
                      }}
                    >
                      该指标展示选定日期下的库存情况
                    </span>
                  </div>
                  {isChange ? (
                    <Chart1
                      xAxisLabelProviderNumber={3}
                      key="原材料"
                      data={inventoryanalysisData3?.storeList ?? []}
                      nameField="category"
                      pageSize={0}
                      onClickTooltip={(series) => {
                        navigateToDetail({
                          applicationArea: series[0].name,
                          segmentKey,
                          isGWH: '原材料',
                        });
                      }}
                    />
                  ) : (
                    <Chart1
                      key="成品"
                      xAxisLabelProviderNumber={3}
                      data={inventoryanalysisData2?.storeList ?? []}
                      pageSize={0}
                      nameField="inventoryCategory"
                      onClickTooltip={(series) => {
                        navigateToDetail({
                          applicationArea: series[0].name,
                          segmentKey,
                          isGWH: '成品',
                        });
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </>
        );
      })()}
    </div>
  );
}

export function CardMode() {
  // const { setEndDate, user, navigateToDetail, cache, setCache, child } =
  //   useCurrentApp()
  const { setEndDate, user, navigateToDetail, cache, setCache, child } =
    useModel('user');

  // 顶部切换卡片内容
  // const [segmentKey, setSegmentKey] = useState('0')
  const segmentKey = cache.segmentKey ?? '0';
  const setSegmentKey = (key) => setCache({ segmentKey: key });

  // const [isGWH, setIsGWH] = useState(false)
  const isGWH = cache.isGWH ?? false;
  const setIsGWH = (key) => setCache({ isGWH: key });

  const isChange = cache.isChange ?? false;
  const setIsChange = (key) => setCache({ isChange: key });

  /**
   * 库存效率：成品（false）/原材料（true）
   */
  // const [isGWH1, setIsGWH1] = useState(false)

  const isGWH1 = cache.isGWH1 ?? false;
  const setIsGWH1 = (key) => setCache({ setIsGWH1: key });

  const { chooseDate, dateType, isHistoryDate, kLineTypes } = user;
  const [isKeyRawMeterialExpanded, setKeyRawMeterialExpanded] = useState(false);

  const {
    error: error1,
    data: inventoryanalysisData1,
    query: query1,
  } = useQuery('/storageAnalysis/selectStorageProList');

  /**
   * 库存分析-库存效率-原材料
   */
  const {
    error: error3,
    data: inventoryanalysisData3,
    query: query3,
  } = useQuery('/storageAnalysis/selectStorageMatList');

  /**
   * 库存分析-库存结构-原材料
   */
  const {
    error: error4,
    data: inventoryanalysisData4,
    query: query4,
  } = useQuery('/storageAnalysis/selectStorageStructMatList');

  useEffect(() => {
    setKeyRawMeterialExpanded(false);
  }, [dateType]);

  useEffect(() => {
    if (segmentKey === '0' && isGWH) {
      setKeyRawMeterialExpanded(true);
    } else {
      setKeyRawMeterialExpanded(false);
    }
  }, [isGWH, segmentKey]);

  const {
    error: error2,
    data: inventoryanalysisData2,
    query: query2,
  } = useQuery('/storageAnalysis/selectStorageProList');

  useEffect(() => {
    if (dateType !== 'a') {
      if (segmentKey === '0') {
        if (isGWH) {
          query4({ storageType: segmentKey });
        } else {
          query1({ storageType: segmentKey });
        }
      } else if (segmentKey === '1') {
        if (isChange) {
          query3({ storageType: segmentKey });
        } else {
          query2({ storageType: segmentKey });
        }
      }
    }
  }, [segmentKey, isGWH, query4, isChange, dateType, query3, query2, query1]);

  const segmentVisible = useMemo(() => {
    return 'all';
  }, []);

  const isLoading1 = useMemo(() => {
    if (isGWH) {
      if (inventoryanalysisData4 && inventoryanalysisData4.storeList) {
        if (inventoryanalysisData4.storeList.length > 0) {
          return 'show';
        } else {
          return 'empty';
        }
      } else {
        if (!error4) {
          return 'loading';
        }
      }
    } else {
      if (inventoryanalysisData1 && inventoryanalysisData1.storeList) {
        if (inventoryanalysisData1.storeList.length > 0) {
          return 'show';
        } else {
          return 'empty';
        }
      } else {
        if (!error1) {
          return 'loading';
        }
      }
    }
    return '';
  }, [inventoryanalysisData1, error1, error4, inventoryanalysisData4, isGWH]);

  const data = useMemo(() => {
    if (
      inventoryanalysisData1 &&
      inventoryanalysisData1.storeList &&
      inventoryanalysisData1.storeList.length > 0
    ) {
      const data = inventoryanalysisData1.storeList;
      return data.filter((item) => {
        return item.inventoryCategory !== 'total';
      });
    }
  }, [inventoryanalysisData1]);

  const customHtmlData = useMemo(() => {
    if (
      inventoryanalysisData1 &&
      inventoryanalysisData1.storeList &&
      inventoryanalysisData1.storeList.length > 0
    ) {
      const data = inventoryanalysisData1.storeList;
      return data
        .filter((item) => {
          return item.inventoryCategory === 'total';
        })
        .map((item) => {
          return {
            title: {
              type: '集团成品总量',
              value: item.inventoryGwhQty,
            },
          };
        });
    }
  }, [inventoryanalysisData1]);

  const data1 = useMemo(() => {
    const temp = [];
    if (inventoryanalysisData4?.storeList?.length > 0) {
      let total = 0;
      inventoryanalysisData4.storeList.map((item) => {
        total += Number(item.labst);
      });
      inventoryanalysisData4.storeList.map((item) => {
        temp.push({
          percent: `${((item.labst / total) * 100).toFixed(2)}%`,
          inventoryCategory: item.category,
          inventoryGwhQty: Number(item.labst),
        });
      });
    }
    return temp;
  }, [inventoryanalysisData4]);

  const customHtmlData1 = useMemo(() => {
    let temp = {};
    let total = 0;
    if (inventoryanalysisData4?.storeList?.length > 0) {
      inventoryanalysisData4.storeList.map((item) => {
        total += Number(item.labst);
      });
    }
    temp = {
      title: {
        type: '集团原材料总量',
        value: total.toFixed(2),
      },
    };
    return temp;
  }, [inventoryanalysisData4]);

  /**
   * 库存结构：
库存效率：
默认进去：
切换到日，显示“该指标没有日维度，请切换到月或年维度”
切换到月，显示“2022.04”（每月更新，取业务最新时间）
切换到年，显示“截至2022.04”（取业务最新时间）
历史：
选择历史月，显示”2022.03“（有数据就显示，没数据就是显示没数据的UI图）
选择历史年，显示“截至2022.04”（取那年业务最新时间）
切换到日、月、年，之间都是独立的，互相不影响，比如，选择历史日，切换到月，会重新刷新，按照最新时间来
   */
  useEffect(() => {
    // 预处理
    if (!setEndDate) {
      return;
    }

    // 开始处理
    if (segmentKey === '0') {
      if (
        dateType === 'a' ||
        dateType === 'c' ||
        (isHistoryDate && isGWH && dateType === 'b')
      ) {
        setEndDate('');
      } else {
        if (isGWH) {
          if (inventoryanalysisData4 && inventoryanalysisData4.maxTime) {
            setEndDate(inventoryanalysisData4.maxTime);
          }
        } else {
          if (inventoryanalysisData1 && inventoryanalysisData1.maxTime) {
            setEndDate(inventoryanalysisData1.maxTime);
          }
        }
      }
    } else if (segmentKey === '1') {
      /**
       * 库存效率
       */
      if (dateType === 'a' || dateType === 'c' || isHistoryDate) {
        setEndDate('');
      } else {
        if (isChange) {
          if (inventoryanalysisData3 && inventoryanalysisData3.maxTime) {
            setEndDate(inventoryanalysisData3.maxTime);
          }
        } else {
          if (inventoryanalysisData2 && inventoryanalysisData2.maxTime) {
            setEndDate(inventoryanalysisData2.maxTime);
          }
        }
      }
    } else {
      /**
       * 库存金额：
切换到日，显示“该指标没有日维度，请切换到月或年维度”
切换到月，显示“2022.12”
切换到年，显示“截至2022.12”
       */
      setTimeout(() => {
        if (dateType === 'b') {
          setEndDate('2022.12');
        } else if (dateType === 'c') {
          setEndDate('截至2022.12');
        }
      }, 0);
    }
  }, [
    dateType,
    setEndDate,
    segmentKey,
    chooseDate,
    inventoryanalysisData4,
    isGWH,
    isChange,
    inventoryanalysisData1,
    inventoryanalysisData2,
    inventoryanalysisData3,
    isHistoryDate,
  ]);

  const tabData = [
    { key: '0', title: '库存结构' },
    { key: '1', title: '库存效率' },
    { key: '2', title: '库存金额' },
  ];

  const showEmpty = useMemo(() => {
    let flag = false;
    let supportDateTypeNames = [];
    const dateTypeName = kLineTypes.find(
      (item) => item.type === dateType,
    ).title;
    const title = tabData.find((item) => item.key === segmentKey).title;
    if (child?.length > 0) {
      const dimensions = child.find(
        (item) => item.indicatorName === title,
      ).dimensions;
      supportDateTypeNames = dimensions.map((item) => item.dimensionName);
      flag = supportDateTypeNames.includes(dateTypeName);
    }
    return { flag, supportDateTypeNames, dateTypeName, title };
  }, [kLineTypes, tabData, child, dateType, segmentKey]);

  return (
    <div
      className={styles.Card}
      // 当segment是库存结构并且是关键原材料时，高度改高，方便graph展示
      // style={{ height: isKeyRawMeterialExpanded ? '578px' : '298px' }}
    >
      {segmentVisible && (
        <>
          <SegmentedControls
            activeKey={segmentKey}
            onChange={(key) => {
              setSegmentKey(key);
            }}
            tabs={tabData}
          />
          {segmentKey === '0' && (
            <Button
              style={{
                '--background-color': '#F4F6F9',
                '--border-radius': '20px',
                fontSize: '11px',
                paddingTop: 4,
                paddingBottom: 4,
                float: 'right',
                marginTop: '20px',
              }}
              onClick={() => {
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
                  src={switchIcon}
                />
                {isGWH ? '关键原材料' : '成品'}
              </div>
            </Button>
          )}
          {segmentKey === '1' && (
            <Button
              style={{
                '--background-color': '#F4F6F9',
                '--border-radius': '20px',
                fontSize: '11px',
                paddingTop: 4,
                paddingBottom: 4,
                float: 'right',
                marginTop: 20,
                position: 'relative',
                zIndex: 104,
              }}
              onClick={() => {
                setIsChange(!isChange);
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
                  src={switchIcon}
                />
                {isChange ? '原材料' : '成品'}
              </div>
            </Button>
          )}
        </>
      )}

      {!showEmpty.flag ? (
        <>
          {showEmpty.supportDateTypeNames.length > 0 ? (
            <>
              <Empty src={empty1} marginTop="95" width="64">
                该指标没有{`${showEmpty.dateTypeName}`}维度，请切换到
                {`${showEmpty.supportDateTypeNames.join('或')}`}维度
              </Empty>
            </>
          ) : (
            <ErrorBlock
              description={`${showEmpty.title}无维度权限，请联系管理员维护权限！`}
            />
          )}
        </>
      ) : (
        <>
          {segmentKey === '0' && dateType !== 'a' && (
            <>
              {isLoading1 === 'loading' ? (
                <Loading style={{ height: '30vh', width: '90vw' }} />
              ) : (
                ''
              )}

              {error1 ? <ErrorBlock description={error1.message} /> : ''}

              {['show'].includes(isLoading1) &&
                ((isGWH && !isHistoryDate) || !isGWH) && (
                  <div
                    className={styles.unitFont}
                    style={{ margin: '10px 0 0' }}
                  >
                    <div
                      style={{
                        height: 28,
                        paddingLeft: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img src={beforeIcon} alt="" />
                      <span
                        style={{
                          color: '#00000073',
                          fontFamily: 'PingFang SC',
                          fontSize: 11,
                        }}
                      >
                        该指标展示选定日期下的库存情况
                      </span>
                    </div>
                    {isGWH ? '(亿元)' : '(Gwh)'}
                  </div>
                )}

              {isGWH && isHistoryDate ? (
                <Empty src={empty} marginTop="70">
                  历史情况暂未上线，敬请期待
                </Empty>
              ) : (
                <>
                  {isLoading1 === 'empty' ? (
                    <Empty src={empty} marginTop="70">
                      暂无数据
                    </Empty>
                  ) : (
                    ''
                  )}
                </>
              )}

              {isLoading1 === 'show' ? (
                <>
                  {isGWH && !isHistoryDate && (
                    <div
                      style={{
                        marginTop: '5px',
                        color: '#678EF2',
                        border: '1px solid #678EF2',
                        width: '66px',
                        height: '24px',
                        lineHeight: '24px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        float: 'right',
                      }}
                    >
                      示例数据
                    </div>
                  )}
                  {(isGWH && !isHistoryDate) || !isGWH ? (
                    <div style={{ padding: '28px 0 0' }}>
                      <GrossProfitAmountPie
                        data={isGWH ? data1 : data}
                        customHtmlData={
                          isGWH ? customHtmlData1 : customHtmlData[0]
                        }
                        segmentKey={segmentKey}
                        key={segmentKey}
                        unit="Gwh"
                        isGWH={isGWH ? '关键原材料' : '成品'}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
            </>
          )}

          {segmentKey === '1' && <Segment1 segmentKey="1" />}

          {segmentKey === '2' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  className={styles.unitFont}
                  style={{ marginTop: segmentVisible ? '2vh' : '' }}
                >
                  (亿元)
                </div>
                <div
                  style={{
                    marginTop: '5px',
                    color: '#678EF2',
                    border: '1px solid #678EF2',
                    width: '66px',
                    height: '24px',
                    lineHeight: '24px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                >
                  示例数据
                </div>
              </div>
              <div style={{ padding: '28px 0 0' }}>
                <Cost
                  unit="亿元"
                  data={isGWH ? data1 : data}
                  customHtmlData={customHtmlData}
                  segmentKey={segmentKey}
                  key={segmentKey}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CardMode;
