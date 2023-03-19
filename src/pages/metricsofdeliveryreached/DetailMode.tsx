import { Mix, DualAxes } from '@ant-design/plots';
import { useWindowWidth } from '@react-hook/window-size';
import { Card, ErrorBlock, WaterMark } from 'antd-mobile';

import moment from 'moment';
import React, { useState, useEffect, useMemo } from 'react';
import { useMatch, useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { Pagination } from '../../components/pagination';
import { Table } from '../../components/table';
import { SegmentedControls } from '../../components/tabs/SegmentedControls';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { sendBuriedPoint, sendPagePoint } from '../../utils/index';
import style from './Detail.module.less';
import { DeliveryDualAxes } from './DetailDualAxes';
import { DetailTable } from './DetailTable';
import styles1 from './index.module.less';
export function DetailMode() {
  const windowWidth = useWindowWidth();
  const [tabKey, setTabKey] = useState('1');
  const [search] = useSearchParams();
  const type = search.get('applicationArea') ?? '';
  //发货柱状
  const [chooseName, setChooseName] = useState('');
  const [chooseNameType, setChooseNameType] = useState('');
  const [title, setTableTitle] = useState('全部');

  // 页面埋点
  const { user, indicator } = useCurrentApp();
  const { chooseDate, dateType, userInfo, token } = user;

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
    console.log('进入DetailMode页面');
    window.scrollTo(0, 0);
    let id;
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: type ? `发货量-${type}` : '发货量-实际交付量',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
          type,
        }),
        requestUrl: '/customerDemandDelivery/selectDemandDeliveryDetails',
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
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
    error,
    data: DeliveryDetailsData,
    query,
  } = useQuery('/customerDemandDelivery/selectDemandDeliveryDetails');
  const [pageNo, setPageNo] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query({ pageNo, type });
  }, [query, pageNo, type]);

  /*上面的柱状图+折线图混合图相关数据*/
  // 柱状图数据
  const topColumnData = useMemo(() => {
    const temp = [];
    if (DeliveryDetailsData) {
      // 客户维度
      if (tabKey == '1') {
        try {
          setPages(
            DeliveryDetailsData.customerDemandDeliveryDetailPage
              .pageCustomerList.pages,
          );
          DeliveryDetailsData.customerDemandDeliveryDetailPage.pageCustomerList.records.map(
            (item, index) => {
              temp.push({
                company: item.customerNumber,
                value: item.surplusForecastQty,
                name: '预测剩余发货量',
              });
              temp.push({
                company: item.customerNumber,
                value: item.factoryActualQty,
                name: '实际发货量',
              });
            },
          );
        } catch (error) {
          // console.log(error)
        }
      }
      // 基地维度
      else if (tabKey == '2') {
        try {
          setPages(
            DeliveryDetailsData.entityDemandDeliveryDetailPage.pageEntityList
              .pages,
          );
          DeliveryDetailsData.entityDemandDeliveryDetailPage.pageEntityList.records.map(
            (item, index) => {
              temp.push({
                company: item.baseName,
                value: item.surplusForecastQty,
                name: '预测剩余发货量',
              });
              temp.push({
                company: item.baseName,
                value: item.factoryActualQty,
                name: '实际发货量',
              });
            },
          );
        } catch (error) {
          console.log(error);
        }
      }
    }

    return temp;
  }, [DeliveryDetailsData, tabKey]);

  // const topColumnData = [
  //   {
  //     company: '领克',
  //     value: 2200,
  //     name: '实际发货量',
  //   },
  // ]
  // 折线图数据
  const topLineData = useMemo(() => {
    const temp = [];
    if (DeliveryDetailsData) {
      if (tabKey == '1') {
        try {
          DeliveryDetailsData.customerDemandDeliveryDetailPage.pageCustomerList.records.map(
            (item, index) => {
              temp.push({
                company: item.customerNumber,
                发货达成率: Number(
                  item.demandDeliveryPersent.slice(
                    0,
                    item.demandDeliveryPersent.length - 1,
                  ),
                ),
              });
            },
          );
        } catch (error) {
          console.log(error);
        }
      }
      // 基地维度
      else if (tabKey == '2') {
        try {
          DeliveryDetailsData.entityDemandDeliveryDetailPage.pageEntityList.records.map(
            (item, index) => {
              temp.push({
                company: item.baseName,
                发货达成率: Number(
                  item.demandDeliveryPersent.slice(
                    0,
                    item.demandDeliveryPersent.length - 1,
                  ),
                ),
              });
            },
          );
        } catch (error) {
          console.log(error);
        }
      }
    }

    return temp;
  }, [DeliveryDetailsData, tabKey]);
  // // 折线图数据
  // const topLineData = [
  //   {
  //     company: '领克',
  //     发货达成率: 66, //发货量达成率
  //   },
  // ]
  /*下面的柱状图+折线图混合图相关数据*/
  // 柱状图数据
  const [baseName, setBaseName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  //发货柱状
  const {
    error: error1,
    data: DeliveryTrendData,
    query: query1,
  } = useQuery('/customerDemandDelivery/selectCustomerDemandDeliveryTrend');

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query1({ baseName, customerNumber, type });
  }, [query1, baseName, customerNumber, type]);
  // 表格数据测试
  // const {
  //   error: error2,
  //   data,
  //   query: query2,
  // } = useQuery('/customerDemandDelivery/selectCustomerDemandDeliveryForm')
  // const [orderBy, setOrderBy] = useState('demandDeliveryPersent')
  // const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  // const [chooseName, setChooseName] = useState('')
  // const [chooseNameType, setChooseNameType] = useState('')
  // useEffect(() => {
  //   /**
  //    * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
  //    */
  //   query2({ orderBy, sort, type, chooseName, chooseNameType, pageNo })
  // }, [query2, orderBy, sort, type, chooseName, chooseNameType, pageNo])
  // console.log(5555555555)
  // console.log(data)
  const columnData = useMemo(() => {
    const temp = [];
    if (DeliveryTrendData) {
      try {
        DeliveryTrendData.map((item) => {
          temp.push({
            time: item.eachMonth,
            type: '实际发货量',
            value: item.factoryActualQty,
          });
          temp.push({
            time: item.eachMonth,
            type: '计划发货量',
            value: item.factoryPlanQty,
          });
        });
      } catch (error) {
        console.log(error);
      }
    }

    return temp.reverse();
  }, [DeliveryTrendData]);

  // 折线图数据
  const lineData = useMemo(() => {
    const temp = [];
    if (DeliveryTrendData) {
      try {
        DeliveryTrendData.map((item) => {
          temp.push({
            time: item.eachMonth,
            发货达成率: Number(
              item.demandDeliveryPersent.slice(
                0,
                item.demandDeliveryPersent.length - 1,
              ),
            ),
          });
        });
      } catch (error) {
        console.log(error);
      }
    }

    return temp.reverse();
  }, [DeliveryTrendData]);

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

  if (error) {
    return <ErrorBlock description={error.message} />;
  }
  if (error1) {
    return <ErrorBlock description={error1.message} />;
  }

  const isGraphLoading = !DeliveryTrendData;
  const isTableLoading = false;

  return (
    <div className={style.detailBox}>
      <HeadTitle>{type ? `发货量-${type}` : '发货量'}</HeadTitle>
      <div>
        <Card>
          <SegmentedControls
            activeKey={tabKey}
            tabs={[
              { title: '客户', key: '1' },
              { title: '基地', key: '2' },
            ]}
            defaultActiveKey={tabKey}
            onChange={(key) => {
              setTabKey(key);
              setPageNo(1);
              setTableTitle('全部');
              setChooseName('');
              setBaseName('');
              setCustomerNumber('');
              setChooseNameType('');

              // 事件埋点
              sendBuriedPoint(
                '关注',
                'metrics/metricsofdeliveryreached/detail',
                '维度切换',
                moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                `发货量 ${key === '1' ? '客户' : '基地'}`,
              );
            }}
            className={style.detailTop}
          />
          <div className={styles1.unitFont}>
            <span>(Gwh)</span>
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
                <DeliveryDualAxes
                  topColumnData={topColumnData}
                  topLineData={topLineData}
                  tabKey={tabKey}
                  chooseName={chooseName}
                  setChooseName={setChooseName}
                  setChooseNameType={setChooseNameType}
                  setTableTitle={setTableTitle}
                  setBaseName={setBaseName}
                  setCustomerNumber={setCustomerNumber}
                  key={tabKey}
                />
              </div>
            )}
            {isGraphLoading && (
              <Loading style={{ height: '34.78vh', width: '90vw' }} />
            )}
          </div>

          <Pagination total={pages} current={pageNo} onChange={setPageNo} />
          <div
            style={{
              marginLeft: -12,
              marginRight: -12,
              backgroundColor: '#EEEFF3',
            }}
          >
            <div
              style={{
                height: 12,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            />
          </div>

          <div
            style={{
              marginLeft: -12,
              marginRight: -12,
              height: 10,
              backgroundColor: '#EEEFF3',
            }}
          />

          <div
            style={{
              marginLeft: -12,
              marginRight: -12,
              height: 10,
              backgroundColor: '#EEEFF3',
            }}
          >
            <div
              style={{
                height: 10,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                backgroundColor: '#fff',
              }}
            />
          </div>
          {title === '全部' ? (
            <p style={{ fontSize: '13px', color: '#000' }}>
              本年十二个月发货量分析
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: '#000' }}>
              本年十二个月发货量分析-{title}
            </p>
          )}

          <div>
            <div className={styles1.unitFont}>
              <span>(Gwh)</span>
            </div>
            <div
              style={{
                height: windowWidth * 0.65,
                position: 'relative',
                zIndex: 103,
              }}
            >
              {!isGraphLoading && (
                <DualAxes
                  {...{
                    data: [columnData, lineData],
                    appending: 'auto',
                    autoFix: true,
                    height: windowWidth * 0.65,
                    xField: 'time',
                    yField: ['value', '发货达成率'],
                    xAxis: {
                      label: {
                        // 数值格式化为千分位
                        formatter: (v) => v.slice(-2),
                      },
                    },
                    yAxis: {
                      value: {
                        nice: true,
                        tickCount: 4,
                        grid: {
                          line: {
                            style: {
                              stroke: 'rgba(217, 217, 217, 0.5)',
                              lineDash: [4, 5],
                            },
                          },
                        },
                      },
                      发货达成率: {
                        nice: true,
                        tickCount: 4,
                        label: {
                          formatter: (val) => Number(val).toFixed(2) + '%',
                        },
                      },
                    },
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      domStyles: {
                        'g2-tooltip-name': {
                          fontFamily: 'PingFang SC',
                          fontWeight: 400,
                          fontSize: 13,
                          color: '#56555C',
                        },
                        'g2-tooltip-value': {
                          fontFamily: 'DIN',
                          fontWeight: 400,
                          fontSize: 13,
                          color: '#56555C',
                        },
                        'g2-tooltip-title': {
                          fontFamily: 'PingFang SC',
                          fontWeight: 400,
                          fontSize: 13,
                          color: '#56555C',
                        },
                      },
                    },
                    geometryOptions: [
                      {
                        geometry: 'column',
                        isGroup: true,
                        seriesField: 'type',
                        color: ['#D1F0EC', '#609EDF'],
                        columnStyle: ({ type }) => {
                          if (type.includes('计划')) {
                            return {
                              // 柱状图描边
                              fill: 'rgba(95, 202, 187, 0.3)',
                              stroke: '#5FCABB',
                              lineWidth: 1,
                              lineDash: [2, 2],
                              strokeOpacity: 0.7,
                            };
                          }
                        },
                      },
                      {
                        geometry: 'line',
                        color: '#7368EF',
                        smooth: true,
                        lineStyle: {
                          stroke: '#7368EF',
                          lineWidth: 2,
                        },
                        point: {
                          shape: '',
                          size: 2.5,
                        },
                        tooltip: {
                          formatter: (datum) => {
                            // 如果是写死的常量则可以不进行声明
                            return {
                              name: '发货达成率',
                              value: datum.发货达成率 + '%',
                            };
                          },
                        },
                      },
                    ],
                  }}
                />
              )}
            </div>
          </div>
        </Card>
        <div style={{ height: 10 }} />
        {!isTableLoading && (
          <DetailTable
            title={title}
            chooseNameType={chooseNameType}
            chooseName={chooseName}
          />
        )}
      </div>
      <WaterMark {...props} />
    </div>
  );
}

export default DetailMode;
