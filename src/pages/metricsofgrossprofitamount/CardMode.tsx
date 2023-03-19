import { ErrorBlock } from 'antd-mobile';
import moment from 'moment';
import { useState, useEffect, useMemo } from 'react';

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
import { GrossProfitAmountPie } from './Pie';
import styles1 from './index.module.less';
// G2.registerTheme('common-theme', {
//   color10: ['#6E94F2', '#5FCABB', '#707E9D', '#5D6C8F', '#766BF5'],
// })

export function CardMode() {
  // const { navigateToDetail, user, setLoading, setEndDate } = useCurrentApp()
  const { navigateToDetail, user, setLoading, setEndDate } = useModel('user');

  const { dateType, token } = user;
  // 顶部切换卡片内容
  const [segmentKey, setSegmentedControlsActiveKey] = useState('1');

  //分类毛利额
  const {
    error,
    data: selectGrossProfitData,
    query,
  } = useQuery('/grossProfit/selectGrossProfit');
  useMemo(() => {
    if (selectGrossProfitData) {
      setLoading();
    }
  }, [selectGrossProfitData]);
  const segmentVisible = useMemo(() => {
    if (!selectGrossProfitData) {
      return false;
    }
    if (selectGrossProfitData.power === 'bz') {
      setSegmentedControlsActiveKey('1');
      return false;
    } else if (selectGrossProfitData.power === 'sj') {
      setSegmentedControlsActiveKey('2');
      return false;
    } else {
      return selectGrossProfitData.power === 'all';
    }
  }, [selectGrossProfitData]);

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query();
  }, [query]);

  useEffect(() => {
    if (!selectGrossProfitData) return;
    setEndDate && setEndDate(selectGrossProfitData.maxTime);
  }, [setEndDate, selectGrossProfitData]);

  //饼图数据
  const data = useMemo(() => {
    const temp = [];
    if (selectGrossProfitData) {
      if (segmentKey == '1') {
        try {
          selectGrossProfitData.grossProfitList
            .sort(function (a, b) {
              return b.grossProfitStandard - a.grossProfitStandard; //报价成本按降序排序
            })
            .map((item) => {
              temp.push({
                category: '毛利额',
                type: item.applicationArea,
                value: item.grossProfitStandard,
                tooltipName: '毛利额',
                tooltipValue: item.grossProfitStandard,
                CompareName: '环比',
                CompareValue: item.bzYearOnYear,
              });
            });
        } catch (error) {
          //console.log(error)
        }
      } else if (segmentKey == '2') {
        try {
          selectGrossProfitData.grossProfitList
            .sort(function (a, b) {
              return b.grossProfitActual - a.grossProfitActual; //实际成本按降序排序
            })
            .map((item) => {
              temp.push({
                category: '毛利额',
                type: item.applicationArea,
                value: item.grossProfitActual,
                tooltipName: '毛利额',
                tooltipValue: item.grossProfitActual,
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
  }, [selectGrossProfitData, segmentKey]);

  // 饼图中心内容
  const customHtmlData = useMemo(() => {
    const temp = [];
    if (selectGrossProfitData) {
      if (segmentKey == '1') {
        try {
          temp.push({
            title: {
              type: '总额',
              value: tofixed(selectGrossProfitData.bzGrossProfitSum, 2),
            },
            content: [
              {
                type: '环比',
                value: selectGrossProfitData.bzGrossProfitYearOnYear,
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
              value: tofixed(selectGrossProfitData.sjGrossProfitSum, 2),
            },
            content: [
              {
                type: '环比',
                value: selectGrossProfitData.sjGrossProfitYearOnYear,
              },
            ],
          });
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp[0];
  }, [selectGrossProfitData, segmentKey]);

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
      if (selectGrossProfitData.grossProfitList) {
        if (segmentKey == '1') {
          selectGrossProfitData.grossProfitList.map((item) => {
            if (item.applicationArea == '国内乘用车') {
              DomesticPassengerVehicle.pop();
              DomesticPassengerVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitStandard
                  ? item.grossProfitStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '国内储能') {
              DomesticEnergyStorage.pop();
              DomesticEnergyStorage.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitStandard
                  ? item.grossProfitStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '国内商用车') {
              DomesticCommercialVehicle.pop();
              DomesticCommercialVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitStandard
                  ? item.grossProfitStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '国际业务') {
              InternationalBusiness.pop();
              InternationalBusiness.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitStandard
                  ? item.grossProfitStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            } else if (item.applicationArea == '其他') {
              other.pop();
              other.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitStandard
                  ? item.grossProfitStandard
                  : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.bzYearOnYear ? item.bzYearOnYear : '-',
              });
            }
          });
        } else if (segmentKey == '2') {
          selectGrossProfitData.grossProfitList.map((item) => {
            if (item.applicationArea == '国内乘用车') {
              DomesticPassengerVehicle.pop();
              DomesticPassengerVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitActual ? item.grossProfitActual : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '国内储能') {
              DomesticEnergyStorage.pop();
              DomesticEnergyStorage.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitActual ? item.grossProfitActual : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '国内商用车') {
              DomesticCommercialVehicle.pop();
              DomesticCommercialVehicle.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitActual ? item.grossProfitActual : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '国际业务') {
              InternationalBusiness.pop();
              InternationalBusiness.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitActual ? item.grossProfitActual : '-',
                salesQuantitySum: item.salesQuantity ? item.salesQuantity : '-',
                yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
              });
            } else if (item.applicationArea == '其他') {
              other.pop();
              other.push({
                applicationArea: item.applicationArea,
                saleSum: item.grossProfitStandard
                  ? item.grossProfitStandard
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
        type: '毛利额',
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
        type: '毛利额',
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
        type: '毛利额',
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
        type: '毛利额',
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
        type: '毛利额',
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
  }, [selectGrossProfitData, segmentKey]);

  // 毛利额趋势
  const {
    error: error1,
    data: selectGrossProfitTrendData,
    query: query1,
  } = useQuery('/grossProfit/selectGrossProfitTrend');
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query1({});
  }, [query1]);
  // console.log(selectGrossProfitTrendData)

  /*柱状图+折线图混合图相关数据*/
  // 柱状图数据
  const columnData = useMemo(() => {
    const temp = [];
    if (selectGrossProfitTrendData) {
      // 标准成本
      if (segmentKey == '1') {
        try {
          selectGrossProfitTrendData.map((item) => {
            temp.push({
              time: item.eachMonth,
              type: '预测毛利额',
              value: item.forecastGrossProfitStandard,
            });
            temp.push({
              time: item.eachMonth,
              type: '毛利额',
              value: item.grossProfitStandard,
            });
          });
        } catch (error) {
          //console.log(error)
        }
      }
      // 实际成本
      else if (segmentKey == '2') {
        try {
          selectGrossProfitTrendData.map((item) => {
            temp.push({
              time: item.eachMonth,
              type: '预测毛利额',
              value: item.forecastGrossProfitActual,
            });
            temp.push({
              time: item.eachMonth,
              type: '毛利额',
              value: item.grossProfitActual,
            });
          });
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp;
  }, [selectGrossProfitTrendData, segmentKey]);

  // 折线图数据
  const lineData = useMemo(() => {
    const temp = [];
    if (selectGrossProfitTrendData) {
      // 标准成本
      if (segmentKey == '1') {
        try {
          selectGrossProfitTrendData.map((item) => {
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
                name: '毛利率',
                price: accMul(item.bzmll || 0, 100),
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
          selectGrossProfitTrendData.map((item) => {
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
                name: '毛利率',
                price: accMul(item.sjmll || 0, 100),
              },
            );
          });
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp;
  }, [selectGrossProfitTrendData, segmentKey]);

  // 点击环形图右边图例和小卡片的联动
  const [activeValue, setActiveValue] = useState({});
  function onCallBack(visible, value) {
    setActiveValue({
      ...activeValue,
      [value]: visible,
    });
  }

  const isGraphLoading1 = !selectGrossProfitData;
  const isGraphLoading2 = !selectGrossProfitTrendData;

  if (error) {
    return <ErrorBlock status="default" description={error.message} />;
  }
  if (error1) {
    return <ErrorBlock status="default" description={error1.message} />;
  }

  if (
    selectGrossProfitTrendData === null ||
    selectGrossProfitTrendData.length === 0
  ) {
    return (
      <Empty src={empty} marginTop="90">
        暂无数据
      </Empty>
    );
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
              `毛利额 ${segmentKey === '1' ? '实际成本' : '报价成本'}`,
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
          <GrossProfitAmountPie
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
              key={item.title}
              title={item.title}
              bodyStyle={activeValue[item.title]}
              hiddent={item.hiddent}
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
            展示本年十二个月毛利额分析
          </span>
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
