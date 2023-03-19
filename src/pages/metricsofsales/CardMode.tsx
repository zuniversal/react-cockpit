import { Pie } from '@ant-design/plots';
import { Card, ErrorBlock } from 'antd-mobile';
import React, { useState, useEffect, useMemo } from 'react';

import beforeIcon from '../../assets/icons/beforeIcon.svg';
import empty from '../../assets/icons/no-data.svg';
import { LabelCard } from '../../components/card/LabelCard';
import { DemoDualAxes } from '../../components/charts/DualAxes';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { tofixed } from '../../utils';
import { Empty } from '../empty/index';
import { Item } from '../home/Sortable/Item';
import styles from './CardMode.module.less';
import { SalesPie } from './Pie';
import styles1 from './index.module.less';

import decline from '@/assets/icons/decline.svg';
import rise from '@/assets/icons/rise.svg';
import carIcon from '@/assets/icons/car.svg';
import trendIcon from '@/assets/icons/trend.svg';
import businessCarIcon from '@/assets/icons/businessCar.svg';
import businessIcon from '@/assets/icons/business.svg';
import otherIcon from '@/assets/icons/other.svg';
import salesIcon from '@/assets/icons/sales.svg';
import markIcon from '@/assets/icons/mark.svg';
import warringIcon from '@/assets/icons/warring.svg';
import rightIcon from '@/assets/icons/sales/right.svg';

export const CardMode = (props) => {
  console.log(' CardMode props ： ', props);
  // const { navigateToDetail, user, setLoading, setEndDate } = useCurrentApp()
  // const { navigateToDetail, user, setLoading, setEndDate } = useModel('user');
  const { user, setLoading, setEndDate } = useCurrentApp();
  const { navigateToDetail } = props;
  const { dateType } = user;

  // const decline = require('../../assets/icons/decline.svg');
  // const rise = require('../../assets/icons/rise.svg');

  //分类销售总额
  const {
    error,
    data: selectSaleClassifyData,
    query,
  } = useQuery('/saleForecast/selectSaleClassify');
  useMemo(() => {
    if (selectSaleClassifyData) {
      setLoading();
    }
  }, [selectSaleClassifyData]);
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query();
  }, [query]);
  // console.log(selectSaleClassifyData)

  useEffect(() => {
    if (selectSaleClassifyData && selectSaleClassifyData.maxTime) {
      setEndDate && setEndDate(selectSaleClassifyData.maxTime);
    }
  }, [setEndDate, selectSaleClassifyData]);

  //饼图数据
  const data = useMemo(() => {
    const temp = [];
    if (selectSaleClassifyData) {
      try {
        if (selectSaleClassifyData.saleClassifyList) {
          selectSaleClassifyData.saleClassifyList
            .sort(function (a, b) {
              return b.saleSum - a.saleSum; //销售额按降序排序
            })
            .map((item) => {
              temp.push({
                category: '销售额',
                type: item.applicationArea,
                value: item.saleSum,
                tooltipName: '销售量',
                tooltipValue: item.salesQuantitySum,
                CompareName: '环比',
                CompareValue: item.quantityChain,
              });
            });
        }
      } catch (error) {
        //console.log(error)
      }
    }
    return temp;
  }, [selectSaleClassifyData]);
  // 假数据
  // const data = [
  //   {
  //     category: '销售额',
  //     type: '国内乘用车',
  //     value: 45, //销售额
  //     // 以下字段为提示框中展示的内容
  //     tooltipName: '销售量',
  //     tooltipValue: 2591.32, //销售量，单位(Mwh)
  //     CompareName: '环比',
  //     CompareValue: 15, //环比值
  //   },
  // 饼图中心内容
  const customHtmlData = useMemo(() => {
    const temp = [];
    if (selectSaleClassifyData) {
      try {
        temp.push({
          title: {
            type: '总额',
            value: tofixed(selectSaleClassifyData.saleClassifySum, 2),
          },
          content: [
            {
              type: '环比',
              value: selectSaleClassifyData.saleClassifyYearOnYear,
            },
          ],
          value: {
            otherSaleSum: selectSaleClassifyData.otherSaleSum,
            otherSaleSumChain: selectSaleClassifyData.otherSaleSumChain,
            icon2:
              selectSaleClassifyData.otherSaleSumChain === '0%' ||
              selectSaleClassifyData.otherSaleSumChain === '-'
                ? ''
                : Number(
                    selectSaleClassifyData.otherSaleSumChain
                      .replace(/,/g, '')
                      .replace('%', ''),
                  ) > 0
                ? rise
                : decline,
            color2:
              selectSaleClassifyData.otherSaleSumChain === '0%' ||
              selectSaleClassifyData.otherSaleSumChain === '-'
                ? ''
                : Number(
                    selectSaleClassifyData.otherSaleSumChain
                      .replace(/,/g, '')
                      .replace('%', ''),
                  ) > 0
                ? '#f1965c'
                : '#5FCABB',
            saleClassifySum: selectSaleClassifyData.saleClassifySum,
            saleClassifyYearOnYear:
              selectSaleClassifyData.saleClassifyYearOnYear,
            icon1:
              selectSaleClassifyData.saleClassifyYearOnYear === '0%' ||
              selectSaleClassifyData.saleClassifyYearOnYear === '-'
                ? ''
                : Number(
                    selectSaleClassifyData.saleClassifyYearOnYear
                      .replace(/,/g, '')
                      .replace('%', ''),
                  ) > 0
                ? rise
                : decline,
            color1:
              selectSaleClassifyData.saleClassifyYearOnYear === '0%' ||
              selectSaleClassifyData.saleClassifyYearOnYear === '-'
                ? ''
                : Number(
                    selectSaleClassifyData.saleClassifyYearOnYear
                      .replace(/,/g, '')
                      .replace('%', ''),
                  ) > 0
                ? '#f1965c'
                : '#5FCABB',
          },
        });
      } catch (error) {
        //console.log(error)
      }
    }
    return temp[0];
  }, [selectSaleClassifyData]);

  // 图例卡片内容
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

    if (selectSaleClassifyData.saleClassifyList) {
      selectSaleClassifyData.saleClassifyList.map((item) => {
        if (item.applicationArea == '国内乘用车') {
          DomesticPassengerVehicle.pop();
          DomesticPassengerVehicle.push({
            applicationArea: item.applicationArea,
            saleSum: item.saleSum ? item.saleSum : '-',
            salesQuantitySum: item.salesQuantitySum
              ? item.salesQuantitySum
              : '-',
            yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
          });
        } else if (item.applicationArea == '国内储能') {
          DomesticEnergyStorage.pop();
          DomesticEnergyStorage.push({
            applicationArea: item.applicationArea,
            saleSum: item.saleSum ? item.saleSum : '-',
            salesQuantitySum: item.salesQuantitySum
              ? item.salesQuantitySum
              : '-',
            yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
          });
        } else if (item.applicationArea == '国内商用车') {
          DomesticCommercialVehicle.pop();
          DomesticCommercialVehicle.push({
            applicationArea: item.applicationArea,
            saleSum: item.saleSum ? item.saleSum : '-',
            salesQuantitySum: item.salesQuantitySum
              ? item.salesQuantitySum
              : '-',
            yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
          });
        } else if (item.applicationArea == '国际业务') {
          InternationalBusiness.pop();
          InternationalBusiness.push({
            applicationArea: item.applicationArea,
            saleSum: item.saleSum ? item.saleSum : '-',
            salesQuantitySum: item.salesQuantitySum
              ? item.salesQuantitySum
              : '-',
            yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
          });
        } else if (item.applicationArea == '其他') {
          other.pop();
          other.push({
            applicationArea: item.applicationArea,
            saleSum: item.saleSum ? item.saleSum : '-',
            salesQuantitySum: item.salesQuantitySum
              ? item.salesQuantitySum
              : '-',
            yearOnYear: item.yearOnYear ? item.yearOnYear : '-',
          });
        }
      });
    }
  } catch (error) {
    //console.log(error)
  }

  const legendCardItem = useMemo(() => {
    const temp = [];
    try {
      temp.push({
        title: DomesticPassengerVehicle[0].applicationArea,
        type: '销售额',
        typeValue: DomesticPassengerVehicle[0].saleSum,
        CompareType: '环比',
        CompareValue: DomesticPassengerVehicle[0].yearOnYear,
        titleIcon: carIcon,
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
        type: '销售额',
        typeValue: DomesticEnergyStorage[0].saleSum,
        CompareType: '环比',
        CompareValue: DomesticEnergyStorage[0].yearOnYear,
        titleIcon: trendIcon,
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
        type: '销售额',
        typeValue: DomesticCommercialVehicle[0].saleSum,
        CompareType: '环比',
        CompareValue: DomesticCommercialVehicle[0].yearOnYear,
        titleIcon: businessCarIcon,
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
        type: '销售额',
        typeValue: InternationalBusiness[0].saleSum,
        CompareType: '环比',
        CompareValue: InternationalBusiness[0].yearOnYear,
        titleIcon: businessIcon,
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
        type: '销售额',
        typeValue: other[0].saleSum,
        CompareType: '环比',
        CompareValue: other[0].yearOnYear,
        titleIcon: otherIcon,
        icon:
          other[0].yearOnYear === '0%' || other[0].yearOnYear === '-'
            ? ''
            : Number(other[0].yearOnYear.replace(/,/g, '').replace('%', '')) > 0
            ? rise
            : decline,
        trendColor:
          other[0].yearOnYear === '0%' || other[0].yearOnYear === '-'
            ? '#09101D'
            : Number(other[0].yearOnYear.replace(/,/g, '').replace('%', '')) > 0
            ? '#F1965C'
            : '#5FCABB',
        hiddent: true,
      });
    } catch (error) {
      console.log(error);
    }
    return temp;
  }, [selectSaleClassifyData]);

  // 半年销售趋势
  const {
    error: error1,
    data: selectSaleTrendData,
    query: query1,
  } = useQuery('/saleForecast/selectSaleTrend');
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query1({}, { method: 'GET' });
  }, [query1]);
  // console.log(selectSaleTrendData)

  /*柱状图+折线图混合图相关数据*/
  // 柱状图数据
  const columnData = useMemo(() => {
    const temp = [];
    if (selectSaleTrendData) {
      try {
        selectSaleTrendData.map((item) => {
          temp.push({
            time: item.eachMonth,
            type: '预测销售额',
            value: item.forecastSalesVolumeSum,
          });
          temp.push({
            time: item.eachMonth,
            type: '销售额',
            value: item.saleSum,
          });
        });
      } catch (error) {
        //console.log(error)
      }
    }
    return temp;
  }, [selectSaleTrendData]);

  // 折线图数据
  const lineData = useMemo(() => {
    const temp = [];
    if (selectSaleTrendData) {
      try {
        selectSaleTrendData.map((item) => {
          temp.push({
            time: item.eachMonth,
            环比: Number(item.yearOnYear.slice(0, item.yearOnYear.length - 1)),
          });
        });
      } catch (error) {
        //console.log(error)
      }
    }
    return temp;
  }, [selectSaleTrendData]);

  const isGraphLoading1 = !selectSaleClassifyData;
  const isGraphLoading2 = !selectSaleTrendData;

  // 点击环形图右边图例和小卡片的联动
  const [activeValue, setActiveValue] = useState({});
  function onCallBack(visible, value) {
    setActiveValue({
      ...activeValue,
      [value]: visible,
    });
  }

  if (error) {
    return <ErrorBlock description={error.message} />;
  }
  if (error1) {
    return <ErrorBlock description={error1.message} />;
  }

  if (selectSaleClassifyData) {
    if (
      selectSaleClassifyData.saleClassifyList === null ||
      selectSaleClassifyData.saleClassifyList.length <= 0
    ) {
      return (
        <Empty src={empty} marginTop="90">
          暂无数据
        </Empty>
      );
    }
  }

  return (
    <>
      <div className={styles.Card}>
        <div className={styles1.infoBox}>
          <div
            className={styles1.info}
            onClick={() => {
              navigateToDetail();
            }}
          >
            <div className={styles1.infoTitle}>
              <span>正常产品</span>
              <img src={rightIcon} />
            </div>
            <div className={styles1.infoContent}>
              <div className={styles1.infoCon}>
                <div className={styles1.infoConValue}>
                  {customHtmlData && customHtmlData.value.saleClassifySum}
                </div>
                <div className={styles1.infoConTitle}>销售额(百万元)</div>
              </div>
              <div className={styles1.infoCon}>
                <div className={styles1.infoConValue}>
                  <span
                    style={{
                      color: `${customHtmlData && customHtmlData.value.color1}`,
                    }}
                  >
                    {customHtmlData &&
                      customHtmlData.value.saleClassifyYearOnYear}
                  </span>
                  <img src={customHtmlData && customHtmlData.value.icon1} />
                </div>
                <div className={styles1.infoConTitle}>环比</div>
              </div>
            </div>
          </div>
          <div className={styles1.info}>
            <div className={styles1.infoTitle}>
              <span>其他</span>
            </div>
            <div className={styles1.infoContent}>
              <div className={styles1.infoCon}>
                <div className={styles1.infoConValue}>
                  {customHtmlData && customHtmlData.value.otherSaleSum}
                </div>
                <div className={styles1.infoConTitle}>销售额(百万元)</div>
              </div>
              <div className={styles1.infoCon}>
                <div className={styles1.infoConValue}>
                  <span
                    style={{
                      color: `${customHtmlData && customHtmlData.value.color2}`,
                    }}
                  >
                    {customHtmlData && customHtmlData.value.otherSaleSumChain}
                  </span>
                  <img src={customHtmlData && customHtmlData.value.icon2} />
                </div>
                <div className={styles1.infoConTitle}>环比</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles1.unitFont}>
          <img src={markIcon} />
          <span>以下仅展示正常产品信息</span>
        </div>
        <div>
          {!isGraphLoading1 && (
            <SalesPie
              data={data}
              customHtmlData={customHtmlData}
              onCallBack={onCallBack}
            />
          )}
          {isGraphLoading1 && (
            <Loading style={{ height: '25vh', width: '90vw' }} />
          )}
        </div>
        <div
          className={styles1.tipsBox}
          style={{ position: 'relative', zIndex: 103 }}
        >
          <img src={warringIcon} alt="tips" />
          <p>当月数据为报价收入,月结后可查询上月实际收入</p>
        </div>
        {/* 分类关联的卡片 */}
        <div className={styles.cards}>
          {legendCardItem.map((item) => {
            return (
              <LabelCard
                onClick={() => {
                  navigateToDetail({ applicationArea: item.title });
                }}
                titleIcon={item.titleIcon}
                key={item.title}
                hiddent={item.hiddent}
                bodyStyle={activeValue[item.title]}
                title={item.title}
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
        </div>
        {dateType === 'a' || 'c' ? (
          <div
            style={{
              fontSize: '11px',
              verticalAlign: 'module',
              marginTop: '32px',
              marginBottom: '8px',
            }}
          >
            <img src={beforeIcon} alt="" />
            <span style={{ opacity: '0.45', color: '#000', marginLeft: '5px' }}>
              展示本年十二个月销售额分析
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
            <DemoDualAxes columnData={columnData} lineData={lineData} />
          )}
          {isGraphLoading2 && (
            <Loading style={{ height: '31vh', width: '90vw' }} />
          )}
        </div>
      </div>
    </>
  );
};

export default CardMode;
