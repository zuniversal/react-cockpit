import { useWindowSize } from '@react-hook/window-size';
import { ErrorBlock } from 'antd-mobile';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import beforeIcon from '../../assets/icons/beforeIcon.svg';
import empty from '../../assets/icons/no-data.svg';
import { LabelCard } from '../../components/card/LabelCard';
import { Loading } from '../../components/loading/Loading';
import { SegmentedControls } from '../../components/tabs/SegmentedControls';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { tofixed, sendBuriedPoint, accMul } from '../../utils';
import { Empty } from '../empty/index';
import styles from './CardMode.module.less';
import { DemoDualAxes } from './DualAxes';
import { MarginalPie } from './Pie';
import styles1 from './index.module.less';

// G2.registerTheme('common-theme', {
//   color10: ['#6E94F2', '#5FCABB', '#707E9D', '#5D6C8F', '#766BF5'],
// })

function omitNegativeItems(list: any[], field: string) {
  return list.filter((item) => {
    return item[field] > 0;
  });
}

export function CardMode() {
  // const { navigateToDetail, user, setLoading, setEndDate } = useCurrentApp()
  const { navigateToDetail, user, setLoading, setEndDate } = useModel('user');
  const { dateType, token } = user;
  // 顶部切换卡片内容
  const [segmentKey, setSegmentedControlsActiveKey] = useState('1');

  const [windowWidth] = useWindowSize();
  const {
    error,
    query,
    data: selectMarginalAmountData,
  } = useQuery<{
    maxTime: string;
    marginalAmountActualSum: number;
    marginalAmountActualYearOnYear: string;
    marginalAmountStandardSum: number;
    marginalAmountStandardYearOnYear: string;
    marginalAmountList:
      | {
          applicationArea: string;
          marginalAmountActual: number;
          marginalAmountStandard: number;
          salesQuantity: number;
          yearOnYear: string;
          bzYearOnYear: string;
        }[]
      | null;
  }>('/marginalAmount/selectMarginalAmount');

  useMemo(() => {
    if (selectMarginalAmountData) {
      setLoading();
    }
  }, [selectMarginalAmountData]);
  const segmentVisible = useMemo(() => {
    if (!selectMarginalAmountData) {
      return false;
    }
    if (selectMarginalAmountData.power === 'bz') {
      setSegmentedControlsActiveKey('1');
      return false;
    } else if (selectMarginalAmountData.power === 'sj') {
      setSegmentedControlsActiveKey('2');
      return false;
    } else {
      return selectMarginalAmountData.power === 'all';
    }
  }, [selectMarginalAmountData]);

  //饼图数据
  const data = useMemo(() => {
    const temp = [];
    if (selectMarginalAmountData) {
      if (segmentKey == '1') {
        try {
          selectMarginalAmountData.marginalAmountList
            .sort(function (a, b) {
              return b.marginalAmountStandard - a.marginalAmountStandard; //报价成本按降序排序
            })
            .map((item) => {
              temp.push({
                category: '边际额',
                type: item.applicationArea,
                value: item.marginalAmountStandard,
                tooltipName: '边际额',
                tooltipValue: item.marginalAmountStandard,
                CompareName: '环比',
                CompareValue: item.bzYearOnYear,
              });
            });
        } catch (error) {
          //console.log(error)
        }
      } else if (segmentKey == '2') {
        try {
          selectMarginalAmountData.marginalAmountList
            .sort(function (a, b) {
              return b.marginalAmountActual - a.marginalAmountActual; //实际成本按降序排序
            })
            .map((item) => {
              temp.push({
                category: '边际额',
                type: item.applicationArea,
                value: item.marginalAmountActual,
                tooltipName: '边际额',
                tooltipValue: item.marginalAmountActual,
                CompareName: '环比',
                CompareValue: item.yearOnYear,
              });
            });
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp;
  }, [selectMarginalAmountData, segmentKey]);

  // 饼图中心内容
  const customHtmlData = useMemo(() => {
    const temp = [];
    if (selectMarginalAmountData) {
      if (segmentKey == '1') {
        try {
          temp.push({
            title: {
              type: '总额',
              value: tofixed(
                selectMarginalAmountData.marginalAmountStandardSum,
                2,
              ),
            },
            content: [
              {
                type: '环比',
                value:
                  selectMarginalAmountData.marginalAmountStandardYearOnYear,
              },
            ],
          });
        } catch (error) {
          //console.log(error)
        }
      } else if (segmentKey == '2') {
        try {
          temp.push({
            title: {
              type: '总额',
              value: tofixed(
                selectMarginalAmountData.marginalAmountActualSum,
                2,
              ),
            },
            content: [
              {
                type: '环比',
                value: selectMarginalAmountData.marginalAmountActualYearOnYear,
              },
            ],
          });
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp[0];
  }, [selectMarginalAmountData, segmentKey]);

  const decline = require('../../assets/icons/decline.svg');
  const rise = require('../../assets/icons/rise.svg');

  // 图例卡片内容
  const legendCardItem = useMemo(() => {
    const temp = [];
    const DomesticPassengerVehicle = []; //国内乘用车
    const DomesticEnergyStorage = []; //国内储能
    const DomesticCommercialVehicle = []; //国内商务车
    const InternationalBusiness = []; //国际业务
    const other = []; // 其他
    try {
      DomesticPassengerVehicle.push({
        applicationArea: '国内乘用车',
        saleSum: '-',
        salesQuantitySum: '-',
        yearOnYear: '-',
      });
      DomesticEnergyStorage.push({
        applicationArea: '国内储能',
        saleSum: '-',
        salesQuantitySum: '-',
        yearOnYear: '-',
      });
      DomesticCommercialVehicle.push({
        applicationArea: '国内商用车',
        saleSum: '-',
        salesQuantitySum: '-',
        yearOnYear: '-',
      });
      InternationalBusiness.push({
        applicationArea: '国际业务',
        saleSum: '-',
        salesQuantitySum: '-',
        yearOnYear: '-',
      });
      other.push({
        applicationArea: '其他',
        saleSum: '-',
        salesQuantitySum: '-',
        yearOnYear: '-',
      });
      if (selectMarginalAmountData.marginalAmountList) {
        if (segmentKey == '1') {
          selectMarginalAmountData.marginalAmountList.map((item) => {
            if (item.applicationArea == '国内乘用车') {
              DomesticPassengerVehicle.pop();
              DomesticPassengerVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountStandard
                  ? item.marginalAmountStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '国内储能') {
              DomesticEnergyStorage.pop();
              DomesticEnergyStorage.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountStandard
                  ? item.marginalAmountStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '国内商用车') {
              DomesticCommercialVehicle.pop();
              DomesticCommercialVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountStandard
                  ? item.marginalAmountStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '国际业务') {
              InternationalBusiness.pop();
              InternationalBusiness.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountStandard
                  ? item.marginalAmountStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '其他') {
              other.pop();
              other.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountStandard
                  ? item.marginalAmountStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            }
          });
        } else if (segmentKey == '2') {
          selectMarginalAmountData.marginalAmountList.map((item) => {
            if (item.applicationArea == '国内乘用车') {
              DomesticPassengerVehicle.pop();
              DomesticPassengerVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountActual
                  ? item.marginalAmountActual
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '国内储能') {
              DomesticEnergyStorage.pop();
              DomesticEnergyStorage.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountActual
                  ? item.marginalAmountActual
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '国内商用车') {
              DomesticCommercialVehicle.pop();
              DomesticCommercialVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountActual
                  ? item.marginalAmountActual
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '国际业务') {
              InternationalBusiness.pop();
              InternationalBusiness.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountActual
                  ? item.marginalAmountActual
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '其他') {
              other.pop();
              other.push({
                applicationArea: item.applicationArea,
                saleSum: item.marginalAmountStandard
                  ? item.marginalAmountStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            }
          });
        }
      }
    } catch (error) {
      //console.log(error)
    }
    try {
      temp.push({
        title: DomesticPassengerVehicle[0].applicationArea,
        type: '边际额',
        typeValue: DomesticPassengerVehicle[0].saleSum,
        CompareType: '环比',
        CompareValue: DomesticPassengerVehicle[0].yearOnYear,
        titleIcon: require('../../assets/icons/car.svg'),
        icon:
          DomesticPassengerVehicle[0].yearOnYear === '0%' ||
          DomesticPassengerVehicle[0].yearOnYear === '-'
            ? ''
            : Number(
                DomesticPassengerVehicle[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? rise
            : decline,
        trendColor:
          DomesticPassengerVehicle[0].yearOnYear === '0%' ||
          DomesticPassengerVehicle[0].yearOnYear === '-'
            ? ''
            : Number(
                DomesticPassengerVehicle[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? '#F1965C'
            : '#5FCABB',
      });
      temp.push({
        title: DomesticEnergyStorage[0].applicationArea,
        type: '边际额',
        typeValue: DomesticEnergyStorage[0].saleSum,
        CompareType: '环比',
        CompareValue: DomesticEnergyStorage[0].yearOnYear,
        titleIcon: require('../../assets/icons/trend.svg'),
        icon:
          DomesticEnergyStorage[0].yearOnYear === '0%' ||
          DomesticEnergyStorage[0].yearOnYear === '-'
            ? ''
            : Number(
                DomesticEnergyStorage[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? rise
            : decline,
        trendColor:
          DomesticEnergyStorage[0].yearOnYear === '0%' ||
          DomesticEnergyStorage[0].yearOnYear === '-'
            ? ''
            : Number(
                DomesticEnergyStorage[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? '#F1965C'
            : '#5FCABB',
      });
      temp.push({
        title: DomesticCommercialVehicle[0].applicationArea,
        type: '边际额',
        typeValue: DomesticCommercialVehicle[0].saleSum,
        CompareType: '环比',
        CompareValue: DomesticCommercialVehicle[0].yearOnYear,
        titleIcon: require('../../assets/icons/businessCar.svg'),
        icon:
          DomesticCommercialVehicle[0].yearOnYear === '0%' ||
          DomesticCommercialVehicle[0].yearOnYear === '-'
            ? ''
            : Number(
                DomesticCommercialVehicle[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? rise
            : decline,
        trendColor:
          DomesticCommercialVehicle[0].yearOnYear === '0%' ||
          DomesticCommercialVehicle[0].yearOnYear === '-'
            ? ''
            : Number(
                DomesticCommercialVehicle[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? '#F1965C'
            : '#5FCABB',
      });
      temp.push({
        title: InternationalBusiness[0].applicationArea,
        type: '边际额',
        typeValue: InternationalBusiness[0].saleSum,
        CompareType: '环比',
        CompareValue: InternationalBusiness[0].yearOnYear,
        titleIcon: require('../../assets/icons/business.svg'),
        icon:
          InternationalBusiness[0].yearOnYear === '0%' ||
          InternationalBusiness[0].yearOnYear === '-'
            ? ''
            : Number(
                InternationalBusiness[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? rise
            : decline,
        trendColor:
          InternationalBusiness[0].yearOnYear === '0%' ||
          InternationalBusiness[0].yearOnYear === '-'
            ? ''
            : Number(
                InternationalBusiness[0].yearOnYear
                  .replace(/,/g, '')
                  .replace('%', ''),
              ) > 0
            ? '#F1965C'
            : '#5FCABB',
      });
      temp.push({
        title: other[0].applicationArea,
        type: '边际额',
        typeValue: other[0].saleSum,
        CompareType: '环比',
        CompareValue: other[0].yearOnYear,
        titleIcon: require('../../assets/icons/business.svg'),
        icon:
          other[0].yearOnYear === '0%' || other[0].yearOnYear === '-'
            ? ''
            : Number(other[0].yearOnYear.replace(/,/g, '').replace('%', '')) > 0
            ? rise
            : decline,
        trendColor:
          other[0].yearOnYear === '0%' || other[0].yearOnYear === '-'
            ? ''
            : Number(other[0].yearOnYear.replace(/,/g, '').replace('%', '')) > 0
            ? '#F1965C'
            : '#5FCABB',
        hiddent: true,
      });
    } catch (error) {
      //console.log(error)
    }
    return temp;
  }, [selectMarginalAmountData, segmentKey]);

  const {
    query: queryTrend,
    data: selectMarginalAmountTrendData,
    error: trendError,
  } = useQuery<
    {
      eachMonth: string; //'2022-08'
      forecastMarginalAmountActual: number; //0
      forecastMarginalAmountStandard: number; // 0
      marginalAmountActual: number;
      marginalAmountStandard: number;
      yearOnYear: string; // '-220.9%'
      bzYearOnYear: string;
    }[]
  >('/marginalAmount/selectMarginalAmountTrend');

  /*柱状图+折线图混合图相关数据*/
  // 柱状图数据
  const columnData = useMemo(() => {
    const temp = [];
    if (selectMarginalAmountTrendData) {
      // 标准成本
      if (segmentKey == '1') {
        try {
          selectMarginalAmountTrendData.map((item) => {
            temp.push({
              time: item.eachMonth,
              type: '预测边际额',
              value: item.forecastMarginalAmountStandard,
            });
            temp.push({
              time: item.eachMonth,
              type: '边际额',
              value: item.marginalAmountStandard,
            });
          });
        } catch (error) {
          //console.log(error)
        }
      }
      // 实际成本
      else if (segmentKey == '2') {
        try {
          selectMarginalAmountTrendData.map((item) => {
            temp.push({
              time: item.eachMonth,
              type: '预测边际额',
              value: item.forecastMarginalAmountActual,
            });
            temp.push({
              time: item.eachMonth,
              type: '边际额',
              value: item.marginalAmountActual,
            });
          });
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp;
  }, [selectMarginalAmountTrendData, segmentKey]);

  // 折线图数据
  const lineData = useMemo(() => {
    const temp = [];
    if (selectMarginalAmountTrendData) {
      // 标准成本
      if (segmentKey == '1') {
        try {
          selectMarginalAmountTrendData.map((item) => {
            temp.push(
              {
                time: item.eachMonth,
                name: '环比',
                price: Number(
                  item.bzYearOnYear
                    .slice(0, item.bzYearOnYear.length - 1)
                    .replace(',', ''),
                ),
              },
              {
                time: item.eachMonth,
                name: '边际率',
                price: accMul(item.bzbjl || 0, 100),
              },
            );
          });
        } catch (error) {
          //console.log(error)
        }
      }
      // 实际成本
      else if (segmentKey == '2') {
        try {
          selectMarginalAmountTrendData.map((item) => {
            temp.push(
              {
                time: item.eachMonth,
                name: '环比',
                price: Number(
                  item.yearOnYear
                    .slice(0, item.yearOnYear.length - 1)
                    .replace(',', ''),
                ),
              },
              {
                time: item.eachMonth,
                name: '边际率',
                price: accMul(item.sjbjl || 0, 100),
              },
            );
          });
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp;
  }, [selectMarginalAmountTrendData, segmentKey]);

  useEffect(() => {
    query();
    queryTrend();
  }, [query, queryTrend]);

  useEffect(() => {
    if (!selectMarginalAmountData) return;
    setEndDate && setEndDate(selectMarginalAmountData.maxTime);
  }, [setEndDate, selectMarginalAmountData]);

  // 点击环形图右边图例和小卡片的联动
  const [activeValue, setActiveValue] = useState({});
  function onCallBack(visible, value) {
    setActiveValue({
      ...activeValue,
      [value]: visible,
    });
  }

  if (error) {
    return <ErrorBlock status="default" description={error.message} />;
  }
  if (trendError) {
    return <ErrorBlock status="default" description={trendError.message} />;
  }

  const isGraphLoading1 = !selectMarginalAmountData;
  const isGraphLoading2 = !selectMarginalAmountTrendData;
  if (selectMarginalAmountData) {
    if (selectMarginalAmountData.marginalAmountList.length === 0) {
      return (
        <Empty src={empty} marginTop="90">
          暂无数据
        </Empty>
      );
    }
  }

  return (
    <div className={styles.Card}>
      {segmentVisible && (
        <SegmentedControls
          activeKey={segmentKey}
          onChange={(key) => {
            setSegmentedControlsActiveKey(key);
            setActiveValue({});

            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '维度切换',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `边际额 ${segmentKey === '1' ? '实际成本' : '报价成本'}`,
            );
          }}
          tabs={[
            { key: '1', title: '报价成本' },
            { key: '2', title: '实际成本' },
          ]}
        />
      )}
      <div
        className={styles1.unitFont}
        style={{ marginTop: segmentVisible ? '2vh' : '' }}
      >
        (百万元)
      </div>
      <div>
        {!isGraphLoading1 && (
          <MarginalPie
            data={data}
            customHtmlData={customHtmlData}
            segmentKey={segmentKey}
            onCallBack={onCallBack}
            key={segmentKey}
          />
        )}
        {isGraphLoading1 && (
          <Loading style={{ height: '25vh', width: '90vw' }} />
        )}
      </div>
      {/* 分类关联的卡片 */}
      <div className={styles.cards}>
        {legendCardItem.map((item) => {
          return (
            <LabelCard
              onClick={() => {
                navigateToDetail({
                  applicationArea: item.title,
                  segmentKey,
                });
              }}
              hiddent={item.hiddent}
              key={item.title}
              title={item.title}
              bodyStyle={activeValue[item.title]}
              titleIcon={item.titleIcon}
              rows={[
                [
                  {
                    label: item.type,
                    value: item.typeValue,
                  },
                  {
                    label: item.CompareType,
                    value: item.CompareValue,
                    valueColor: item.trendColor,
                    icon: item.icon,
                  },
                ],
              ]}
            />
          );
        })}
        <div />
      </div>
      {dateType === 'c' ? (
        <div
          style={{
            fontSize: '11px',
            verticalAlign: 'module',
            marginTop: '32px',
            marginBottom: '8px',
          }}
        >
          <img src={beforeIcon} alt="" />{' '}
          <span style={{ opacity: '0.45', color: '#000', marginLeft: '5px' }}>
            展示本年十二个月边际额分析{' '}
          </span>{' '}
        </div>
      ) : (
        ''
      )}
      <div
        className={styles1.unitFont}
        style={{ marginTop: '2vh', marginBottom: '1vh' }}
      >
        (百万元)
      </div>
      <div style={{ height: '31vh', position: 'relative', zIndex: 103 }}>
        {!isGraphLoading2 && (
          <DemoDualAxes
            columnData={columnData}
            lineData={lineData}
            key={segmentKey}
          />
        )}
        {isGraphLoading2 && (
          <Loading style={{ height: '31vh', width: '90vw' }} />
        )}
      </div>
    </div>
  );
}

export default CardMode;
