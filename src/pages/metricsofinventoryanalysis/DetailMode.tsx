import { Column } from '@ant-design/plots';
import { useWindowWidth } from '@react-hook/window-size';
import {
  WaterMark,
  Card,
  Picker,
  ErrorBlock,
  Toast,
  Popover,
} from 'antd-mobile';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  memo,
  useCallback,
} from 'react';
import { useMatch, useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { useQuery } from '../../hooks/useQuery';
import { toFixedNumber } from '../../utils';
import { Chart1 } from './Chart1';
import { Chart2 } from './Chart2';
import { DemoDualAxes } from './DualAxesDetail';
import styles from './styles.module.less';

const Column1 = memo(Column, () => {
  return true;
});

export function DetailMode() {
  const [search] = useSearchParams();
  /**
   * 不同入口进来的业务意义是不一样的，
   */
  const type = search.get('applicationArea') ?? '';
  const segmentKey = search.get('segmentKey') ?? '';
  const isGWH = search.get('isGWH');
  const windowWidth = useWindowWidth();
  const height = windowWidth * 0.6 + 20;
  const toastHandler = useRef<ToastHandler>();
  const [chooseName, setChooseName] = useState(
    isGWH === '原材料' ? null : '江苏',
  );
  const [visible, setVisible] = useState(false);
  const [popoverValue, setPopoverValue] = useState('线边');
  const plotRef = useRef<any>();
  const [highlight, setHighlight] = useState('');
  const [title, setTitle] = useState('');
  const [state, setState] = useState(true);
  const [linkageTitle, setLinkageTitle] = useState('全部');

  const [column1Key, setColumnKey] = useState(0);

  useEffect(() => {
    if (segmentKey === '0') {
      const name = isGWH ?? '';
      setTitle(`库存结构-${name}`);
    } else if (segmentKey === '1') {
      const name = isGWH ?? '';
      setTitle(`库存效率-${name}-${type}`);
    } else if (segmentKey === '2') {
      setTitle(`库存金额`);
    }
  }, [isGWH, type, segmentKey]);

  const {
    error: error1,
    data: inventoryanalysisData1,
    query: query1,
  } = useQuery('/storageAnalysis/selectStorageProList');

  const {
    error: error2,
    data: inventoryanalysisData2,
    query: query2,
  } = useQuery('/storageAnalysis/selectStorageProList');

  const {
    error: error3,
    data: inventoryanalysisData3,
    query: query3,
  } = useQuery('/storageAnalysis/selectStorageMatList');

  const {
    error: error4,
    data: inventoryanalysisData4,
    query: query4,
  } = useQuery('/storageAnalysis/selectStorageMatList');

  const {
    error: error5,
    data: inventoryanalysisData5,
    query: query5,
  } = useQuery('/storageAnalysis/selectStorageStructMatList');

  const {
    error: error6,
    data: inventoryanalysisData6,
    query: query6,
  } = useQuery('/storageAnalysis/selectStorageStructMatList');

  useEffect(() => {
    if (segmentKey === '1' && isGWH === '原材料') {
      query3({
        storageType: segmentKey,
        level1Val: type,
      });
    } else if (segmentKey === '0' && isGWH === '关键原材料') {
      query5({
        storageType: segmentKey,
        level1Val: '总量',
      });
    } else {
      query1({
        storageType: segmentKey,
        level1Val: segmentKey === '0' ? '总量' : type,
      });
    }
  }, [segmentKey, type, query1, query3, isGWH, query5]);

  useEffect(() => {
    if (isGWH === '关键原材料') {
      query6({
        storageType: segmentKey,
        level1Val: chooseName,
        level2Val: popoverValue,
      });
    }
  }, [query6, popoverValue, chooseName, segmentKey, isGWH]);

  const keyRawMaterialsData = useMemo(() => {
    let temp = { data: [], legend: [] };
    if (inventoryanalysisData5?.storeList?.length > 0) {
      const data = [];
      const legend = [];
      inventoryanalysisData5.storeList.map((item) => {
        data.push({
          type: item.category,
          value: Number(item.labst),
          year: item.entityName,
        });
        legend.push(item.category);
      });
      const legendData = legend.filter((item, index, array) => {
        return array.indexOf(item) === index;
      });
      temp = { data, legend: legendData };
      setPopoverValue([legendData[0]]);
    }
    return temp;
  }, [inventoryanalysisData5]);

  const keyRawMaterialsData2 = useMemo(() => {
    const temp = [];
    if (inventoryanalysisData6?.storeList?.length > 0) {
      inventoryanalysisData6.storeList.map((item) => {
        temp.push({
          type: '库存金额',
          value: Number(item.labst),
          year: item.criticalMaterial,
        });
      });
    }
    return temp;
  }, [inventoryanalysisData6]);

  useEffect(() => {
    if (segmentKey === '1' && isGWH === '原材料') {
      if (chooseName) {
        query4({
          storageType: segmentKey,
          level1Val: type,
          level2Val: chooseName,
        });
      }
    } else {
      query2({
        storageType: segmentKey,
        level1Val: segmentKey === '0' ? popoverValue : type,
        level2Val: chooseName,
      });
    }
  }, [segmentKey, chooseName, query4, isGWH, query2, popoverValue, type]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        localStorage.getItem(
          'datafrontcalb/tooltip/clickcolumn/inventoryanalysis',
        ) !== 'off'
      ) {
        toastHandler.current = Toast.show({
          content: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                }}
              >
                点击各基地可对应显示详细
              </div>
              <div style={{ width: 10 }}> </div>
              <div
                onClick={() => {
                  toastHandler.current.close();
                  localStorage.setItem(
                    'datafrontcalb/tooltip/clickcolumn/inventoryanalysis',
                    'off',
                  );
                }}
                style={{ fontSize: 9, whiteSpace: 'nowrap', color: '#aaa' }}
              >
                不再提示
              </div>
            </div>
          ),
          duration: 3000,
          position: 'top',
          maskClassName: styles.toaster,
        });
      }
    }, 1000);
    return () => {
      toastHandler.current?.close();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!chooseName) {
      if (
        inventoryanalysisData3 &&
        Array.isArray(inventoryanalysisData3.storeList)
      ) {
        if (inventoryanalysisData3.storeList.length > 0) {
          setChooseName(inventoryanalysisData3.storeList[0].criticalMaterial);
        }
      }
    }
  }, [chooseName, inventoryanalysisData3]);

  /**
   * 库存效率数据
   */
  const data = useMemo(() => {
    if (isGWH === '原材料') {
      const columnData1 = [];
      const lineData1 = [];
      if (
        inventoryanalysisData3 &&
        Array.isArray(inventoryanalysisData3.storeList)
      ) {
        inventoryanalysisData3.storeList.forEach((item) => {
          columnData1.push({
            name: item.criticalMaterial,
            type: '目标',
            value: item.inventoryGoalDay,
          });
          columnData1.push({
            name: item.criticalMaterial,
            type: '现状',
            value: item.inventoryDay,
          });
          lineData1.push({
            name: item.criticalMaterial,
            '偏差(天数)': toFixedNumber(item.inventoryDeviationDay, 2),
          });
        });
      }
      console.log({ columnData1, lineData1 });
      return { columnData1, lineData1 };
      // return {
      //   columnData1: [
      //     { name: '原材料1', type: '目标', value: 25 },
      //     { name: '原材料1', type: '现状', value: 30 },
      //     { name: '原材料2', type: '目标', value: 20 },
      //     { name: '原材料2', type: '现状', value: 25 },
      //     { name: '原材料3', type: '目标', value: 18 },
      //     { name: '原材料3', type: '现状', value: 20 },
      //     { name: '原材料4', type: '目标', value: 25 },
      //     { name: '原材料4', type: '现状', value: 31 },
      //     { name: '原材料5', type: '目标', value: 20 },
      //     { name: '原材料5', type: '现状', value: 25 },
      //     { name: '原材料6', type: '目标', value: 10 },
      //     { name: '原材料6', type: '现状', value: 12 },
      //     { name: '原材料7', type: '目标', value: 22 },
      //     { name: '原材料7', type: '现状', value: 28 },
      //     { name: '原材料8', type: '目标', value: 28 },
      //     { name: '原材料8', type: '现状', value: 32 },
      //   ],
      //   lineData1: [
      //     { name: '原材料1', '偏差(天数)': 9 },
      //     { name: '原材料2', '偏差(天数)': 7 },
      //     { name: '原材料3', '偏差(天数)': 9 },
      //     { name: '原材料4', '偏差(天数)': 7 },
      //     { name: '原材料5', '偏差(天数)': 9 },
      //     { name: '原材料6', '偏差(天数)': 7 },
      //     { name: '原材料7', '偏差(天数)': 9 },
      //     { name: '原材料8', '偏差(天数)': 7 },
      //   ],
      // }
    }
    if (inventoryanalysisData1) {
      if (inventoryanalysisData1.storeList !== null) {
        if (segmentKey === '0') {
          const data = [];
          const legend = [];
          inventoryanalysisData1.storeList.map((item) => {
            data.push({
              year: item.entityName,
              value: item.inventoryGwhQty,
              type: item.inventoryCategory,
            });
            legend.push(item.inventoryCategory);
          });
          const legendData = legend.filter((item, index, array) => {
            return array.indexOf(item) === index;
          });
          return { data, legend: legendData };
        } else {
          const columnData1 = [];
          const lineData1 = [];
          inventoryanalysisData1.storeList.map((item) => {
            columnData1.push(
              {
                name: item.entityName,
                type: '目标',
                value: item.inventoryGoalDay,
              },
              {
                name: item.entityName,
                type: '现状',
                value: item.inventoryDay,
              },
            );
            lineData1.push({
              name: item.entityName,
              '偏差(天数)': item.inventoryDeviationDay,
            });
          });
          return {
            columnData1,
            lineData1,
          };
        }
      }
    }
    return { data: [], legend: [], columnData1: [], lineData1: [] };
  }, [inventoryanalysisData1, inventoryanalysisData3, isGWH, segmentKey]);

  const color = [
    '#EEC78D',
    '#E39F39',
    '#A098F9',
    '#766BF5',
    '#5D6C8F',
    '#707E9D',
    '#5FCABB',
    '#6E94F2',
  ];

  const color1 = [
    '#6E94F2',
    '#5FCABB',
    '#707E9D',
    '#5D6C8F',
    '#766BF5',
    '#A098F9',
    '#E39F39',
    '#EEC78D',
  ];

  const config = {
    data: isGWH === '关键原材料' ? keyRawMaterialsData.data : data.data,
    width: windowWidth - 44,
    height,
    isStack: true,
    xField: 'year',
    yField: 'value',
    appendPadding: [0, 0, 20, 0],
    color: isGWH === '关键原材料' ? color1 : color,
    yAxis: {
      nice: true,
      tickCount: 5,
      // tickInterval: 20,
      grid: {
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
    seriesField: 'type',
    legend: false,
    tooltip: {
      customItems: (originalItems) => {
        // process originalItems,
        return originalItems.concat({
          name: '总量',
          value: originalItems.reduce((total, item) => {
            return toFixedNumber(total + toFixedNumber(item.value, 2));
          }, 0),
        });
      },
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
    interactions: [
      {
        type: 'element-selected',
        cfg: {
          start: [
            {
              trigger: 'element:click',
              action(evt) {},
            },
          ],
          end: [
            {
              trigger: 'element:click',
              action(evt) {
                if (!evt.event.data) {
                  return;
                }
                const nextCompany = evt.event.data.data.year;
                if (chooseName !== nextCompany) {
                  setChooseName(nextCompany);
                }
              },
            },
          ],
        },
      },
    ],
  };

  useEffect(() => {
    setColumnKey((prev) => prev + 1);
  }, [data, chooseName, keyRawMaterialsData]);

  useEffect(() => {
    if (segmentKey === '0') {
      plotRef.current.setState('inactive', (item) => {
        if (chooseName === '') {
          return false;
        }
        return item.year !== chooseName;
      });
    }
  }, [chooseName, segmentKey, column1Key]);
  useEffect(() => {
    if (segmentKey === '2') {
      plotRef.current.setState('inactive', (item) => {
        if (highlight === '') {
          return false;
        }
        return item.year !== highlight;
      });
    }
  }, [highlight, segmentKey]);
  const data2 = useMemo(() => {
    if (isGWH === '原材料') {
      const columnData2 = [];
      const lineData2 = [];
      if (
        inventoryanalysisData4 &&
        Array.isArray(inventoryanalysisData4.storeList)
      ) {
        inventoryanalysisData4.storeList.forEach((item) => {
          columnData2.push({
            name: item.entityName,
            type: '目标',
            value: item.inventoryGoalDay,
          });
          columnData2.push({
            name: item.entityName,
            type: '现状',
            value: item.inventoryDay,
          });
          lineData2.push({
            name: item.entityName,
            '偏差(天数)': item.inventoryDeviationDay,
          });
        });
      }
      // console.log({ columnData2, lineData2 })
      return { columnData2, lineData2 };

      // return {
      //   columnData2: [
      //     { name: '江苏', type: '目标', value: 50 },
      //     { name: '江苏', type: '现状', value: 70 },
      //     { name: '厦门', type: '目标', value: 30 },
      //     { name: '厦门', type: '现状', value: 45 },
      //     { name: '洛阳', type: '目标', value: 75 },
      //     { name: '洛阳', type: '现状', value: 40 },
      //     { name: '成都', type: '目标', value: 48 },
      //     { name: '成都', type: '现状', value: 30 },
      //     { name: '合肥', type: '目标', value: 48 },
      //     { name: '合肥', type: '现状', value: 20 },
      //     { name: '武汉', type: '目标', value: 50 },
      //     { name: '武汉', type: '现状', value: 20 },
      //   ].map((item) => {
      //     return {
      //       ...item,
      //       value: toFixedNumber(item.value * (1 - Math.random() / 5), 0),
      //     }
      //   }),
      //   lineData2: [
      //     { name: '江苏', '偏差(天数)': 9 },
      //     { name: '厦门', '偏差(天数)': 7 },
      //     { name: '洛阳', '偏差(天数)': 9 },
      //     { name: '成都', '偏差(天数)': 7 },
      //     { name: '合肥', '偏差(天数)': 9 },
      //     { name: '武汉', '偏差(天数)': 7 },
      //   ].map((item) => {
      //     return {
      //       ...item,
      //       '偏差(天数)': toFixedNumber(
      //         item['偏差(天数)'] * (1 - Math.random() / 5),
      //         0
      //       ),
      //     }
      //   }),
      // }
    }
    if (inventoryanalysisData2 && inventoryanalysisData2.storeList !== null) {
      if (segmentKey === '0') {
        const data = [];
        inventoryanalysisData2.storeList.map((item) => {
          data.push({
            year: item.productModel,
            value: item.inventoryGwhQty,
            type: '库存量',
          });
        });
        return { data };
      } else {
        const columnData2 = [];
        const lineData2 = [];
        inventoryanalysisData2.storeList.map((item) => {
          columnData2.push(
            {
              name: item.productModel,
              type: '目标',
              value: item.inventoryGoalDay,
            },
            { name: item.productModel, type: '现状', value: item.inventoryDay },
          );
          lineData2.push({
            name: item.productModel,
            '偏差(天数)': toFixedNumber(item.inventoryDeviationDay, 2),
          });
        });
        return {
          columnData2,
          lineData2,
        };
      }
    }
    return { data: [], columnData2: [], lineData2: [] };
  }, [inventoryanalysisData2, inventoryanalysisData4, isGWH, segmentKey]);

  const data3 = [
    { year: '江苏', value: 100, type: '原材料' },
    { year: '厦门', value: 80, type: '原材料' },
    { year: '洛阳', value: 100, type: '原材料' },
    { year: '成都', value: 80, type: '原材料' },
    { year: '合肥', value: 50, type: '原材料' },
    { year: '武汉', value: 70, type: '原材料' },
    { year: '江苏', value: 150, type: '成品' },
    { year: '厦门', value: 120, type: '成品' },
    { year: '洛阳', value: 180, type: '成品' },
    { year: '成都', value: 110, type: '成品' },
    { year: '合肥', value: 100, type: '成品' },
    { year: '武汉', value: 110, type: '成品' },
  ];
  const config3 = {
    data: data3,
    height,
    isStack: true,
    xField: 'year',
    yField: 'value',
    color: ['#5FCABB', '#5183FD'],
    columnStyle: {
      fillOpacity: 1,
    },
    appendPadding: [0, 0, 10, 0],
    yAxis: {
      max: 400,
      nice: true,
      // tickCount: 5,
      // tickInterval: 20,
      grid: {
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
    seriesField: 'type',
    legend: false,
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
  };

  const data4 = [
    { name: '线边', value: 130, type: '库存' },
    { name: '静止', value: 110, type: '库存' },
    { name: '仓库', value: 90, type: '库存' },
    { name: '待发', value: 130, type: '库存' },
    { name: '在途&中储', value: 100, type: '库存' },
    { name: '小组别', value: 50, type: '库存' },
    { name: '异常品', value: 123, type: '库存' },
    { name: '售后', value: 138, type: '库存' },
  ];
  const config4 = {
    data: data4,
    height,
    xField: 'name',
    yField: 'value',
    padding: 'auto',
    color: '#5183FD',
    appendPadding: [0, 0, 10, 0],
    yAxis: {
      max: 200,
      grid: {
        alignTick: true,
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
    xAxis: {
      label: {
        formatter: (val) => {
          if (state) {
            if (val.length > 3) {
              return val.substring(0, 3) + '\n' + val.substring(3);
            } else {
              return val;
            }
          }
        },
        style: {
          fontSize: 10,
        },
      },
    },
    seriesField: 'type',
    legend: {
      position: 'bottom',
      flipPage: false,
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
  };
  const data5 = [
    { name: '战略库存', value: 130, type: '库存' },
    { name: '未结订单', value: 110, type: '库存' },
    { name: '在检', value: 90, type: '库存' },
    { name: '仓库', value: 130, type: '库存' },
  ];
  const config5 = {
    data: data5,
    height,
    xField: 'name',
    yField: 'value',
    padding: 'auto',
    color: '#5183FD',
    yAxis: {
      max: 200,
      grid: {
        alignTick: true,
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
    xAxis: {
      label: {
        formatter: (val) => {
          return val;
        },
      },
      fontSize: 10,
    },
    seriesField: 'type',
    legend: {
      position: 'bottom',
      flipPage: false,
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
  };

  return (
    <>
      <HeadTitle>{title}</HeadTitle>
      {segmentKey === '0' && (
        <>
          <Card headerStyle={{ borderBottom: 'none' }} title="基地库存结构分析">
            <div
              style={{
                color: '#999',
                padding: '0 0 5px 0',
                fontSize: '12px',
              }}
            >
              {isGWH === '关键原材料' ? '(亿元)' : '(Gwh)'}
            </div>
            <Column1
              key={column1Key}
              {...config}
              onReady={(plot) => {
                plotRef.current = plot;
              }}
            />
            <div className={styles.legendBox}>
              {(isGWH === '关键原材料'
                ? keyRawMaterialsData.legend
                : data.legend
              ).map((item, index) => {
                const colorArr = isGWH === '关键原材料' ? color1 : color;
                return (
                  <div className={styles.legend} key={index}>
                    <span style={{ background: colorArr[index] }} />
                    <div>{item}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card
            headerStyle={{ borderBottom: 'none', marginTop: '20px' }}
            title={
              chooseName
                ? `${
                    isGWH === '关键原材料' ? '主材' : '型号'
                  }分析-${chooseName}`
                : '型号分析'
            }
            extra={
              <>
                <Picker
                  columns={[
                    isGWH === '关键原材料'
                      ? keyRawMaterialsData.legend
                      : data.legend,
                  ]}
                  visible={visible}
                  onClose={() => {
                    setVisible(false);
                  }}
                  value={[popoverValue]}
                  onConfirm={(v) => {
                    setPopoverValue(v[0]);
                  }}
                />
                <div
                  style={{
                    color: '#4774E7',
                    fontFamily: 'PingFang SC',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  {popoverValue}
                  <img src={require('../../assets/icons/arrowDown.svg')} />
                </div>
              </>
            }
          >
            <div
              style={{
                color: '#999',
                padding: '0 0 5px 0',
                fontSize: '12px',
              }}
            >
              {isGWH === '关键原材料' ? '(亿元)' : '(Gwh)'}
            </div>
            <Chart2
              key={data2.data}
              height={height}
              data={isGWH === '关键原材料' ? keyRawMaterialsData2 : data2.data}
            />
            <div className={styles.legendBox}>
              <div className={styles.legend}>
                <span style={{ background: '#5183FD' }} />
                <div>{isGWH === '关键原材料' ? '库存金额' : '库存量'}</div>
              </div>
            </div>
          </Card>
        </>
      )}

      {segmentKey === '1' && (
        <>
          <Card headerStyle={{ borderBottom: 'none' }} title="基地库存效率分析">
            {isGWH === '原材料' && (
              <Chart1
                data={inventoryanalysisData3?.storeList ?? []}
                nameField="criticalMaterial"
                onClickItem={(item) => {
                  setChooseName(item.criticalMaterial);
                }}
                pageSize={8}
                gridX2={type === '仓库' ? 40 : 30}
              />
            )}

            {isGWH === '成品' && (
              <Chart1
                data={inventoryanalysisData1?.storeList ?? []}
                nameField="entityName"
                onClickItem={(item) => {
                  setChooseName(item.entityName);
                }}
                gridX2={type === '静置' ? 60 : 30}
              />
            )}
          </Card>

          <Card
            headerStyle={{ borderBottom: 'none', marginTop: '20px' }}
            title={chooseName ? `型号效率分析-${chooseName}` : '型号效率分析'}
          >
            {isGWH === '原材料' && (
              <Chart1
                data={inventoryanalysisData4?.storeList ?? []}
                nameField="entityName"
                key={chooseName}
                gridX2={type === '仓库' ? 40 : 30}
              />
            )}

            {isGWH === '成品' && (
              <Chart1
                data={inventoryanalysisData2?.storeList ?? []}
                key={chooseName}
                nameField="productModel"
                xAxisLabelProviderNumber={15}
                pageSize={5}
                gridX2={type === '静置' ? 60 : 30}
              />
            )}
          </Card>
        </>
      )}
      {segmentKey === '2' && (
        <>
          <Card headerStyle={{ borderBottom: 'none' }} title="基地库存金额">
            <div
              style={{
                color: '#999',
                padding: '0 0 5px 0',
                fontSize: '12px',
              }}
            >
              (亿元)
            </div>
            <Column
              {...config3}
              onReady={(plot) => {
                plotRef.current = plot;
                plot.on('plot:click', (evt) => {
                  const { x, y } = evt;
                  const tooltipData = plot.chart.getTooltipItems({ x, y });
                  setHighlight(tooltipData[0].title);
                  setLinkageTitle(tooltipData[0].title);
                });
              }}
            />
            <div className={styles.legendBox}>
              <div className={styles.legend}>
                <span style={{ background: '#5183FD' }} />
                <div>成品 {}</div>
              </div>
              <div className={styles.legend}>
                <span style={{ background: '#5FCABB' }} />
                <div>原材料</div>
              </div>
            </div>
          </Card>

          <Card
            headerStyle={{
              borderBottom: 'none',
              marginTop: '20px',
            }}
            title={`结构库存金额-${linkageTitle}`}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '-40px',
                  color: '#4774E7',
                  fontFamily: 'PingFang SC',
                  fontSize: '11px',
                }}
                onClick={() => setState(!state)}
              >
                {state ? '成品' : '原材料'}
                <img src={require('../../assets/icons/arrowDown.svg')} />
              </div>
              <div
                style={{
                  color: '#999',
                  padding: '0 0 5px 0',
                  fontSize: '12px',
                }}
              >
                (亿元)
              </div>
              {state ? <Column {...config4} /> : <Column {...config5} />}
            </div>
          </Card>
        </>
      )}
    </>
  );
}

export default DetailMode;
