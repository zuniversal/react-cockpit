import { Column } from '@ant-design/plots';
import { useWindowWidth } from '@react-hook/window-size';
import {
  WaterMark,
  Card,
  ErrorBlock,
  SafeArea,
  Toast,
  Popover,
  Picker,
} from 'antd-mobile';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useMatch, useSearchParams, useParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { Pagination } from '../../components/pagination';
import { useQuery } from '../../hooks/useQuery';
import { DemoDualAxes } from './DualAxesDetail';
import { sendBuriedPoint } from '../../utils/index';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import styles from './index.module.less';

const Column1 = memo(Column, () => {
  return true;
});

export function DetailMode() {
  const toastHandler = useRef<ToastHandler>();
  const [chooseName, setChooseName] = useState('江苏基地');

  const [visible, setVisible] = useState(false);
  const [popoverValue, setPopoverValue] = useState('电池');

  const [key, setKey] = useState(1);
  const routeParams = useParams();
  const { metricId } = routeParams;
  const { user } = useCurrentApp();
  const { currentName } = user;
  const [search] = useSearchParams();
  const parentName = search.get('parentName') ?? '';
  const eventTitle = search.get('eventTitle') ?? '';
  const width = (document.body.clientWidth - 44) * 0.82;

  const {
    error: error1,
    data: data1,
    query: query1,
  } = useQuery('/lossCost/selectLossCostSecondList');

  const {
    error: error2,
    data: data2,
    query: query2,
  } = useQuery('/lossCost/selectLossCostSecondDetailList');

  useEffect(() => {
    query1({});
  }, [query1]);
  const [page1, setPage1] = useState(1);

  const data = useMemo(() => {
    const temp = [];
    if (data1) {
      data1.shcbList.map((item, index) => {
        if (index === 0) {
          setChooseName(item.baseName);
          setPage1(1);
        }
        temp.push({
          year: item.baseName,
          value: Number(item.dbCost),
          type: '打包',
        });
        temp.push({
          year: item.baseName,
          value: Number(item.paCost),
          type: 'Pack',
        });
        temp.push({
          year: item.baseName,
          value: Number(item.mzCost),
          type: '模组',
        });
        temp.push({
          year: item.baseName,
          value: Number(item.dxCost),
          type: '电池',
        });
      });
    }
    return temp;
  }, [data1, setChooseName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        localStorage.getItem(
          'datafrontcalb/tooltip/clickcolumn/wastagecost',
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
                    'datafrontcalb/tooltip/clickcolumn/wastagecost',
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
    query2({
      level1Val: chooseName === '江苏基地' ? 'JS' : 'XM',
      level2Val: popoverValue === 'Pack' ? 'PACK' : popoverValue,
    });
  }, [query2, chooseName, popoverValue]);
  const pageSize1 = 6;

  const detailData = useMemo(() => {
    let columnData = [];
    let lineData = [];
    const sort = [];
    if (data2) {
      const start = (page1 - 1) * pageSize1;
      const arr = [];
      const temp1 = [];
      const temp2 = [];
      data2.shcbList.map((item, index) => {
        if (index >= start && index < start + pageSize1) {
          arr.push(item.factoryStage);
          temp1.push(
            {
              name: item.factoryStage + '-' + item.productNum,
              type: '损耗金额(万元)',
              value: item.shje || 0,
              factoryStage: item.factoryStage,
            },
            {
              name: item.factoryStage + '-' + item.productNum,
              type: '单位损耗(元/Kwh)',
              value: item.dwshcb || 0,
              factoryStage: item.factoryStage,
            },
          );
          temp2.push({
            name: item.factoryStage + '-' + item.productNum,
            投入产出比: item.trccl || 0,
            factoryStage: item.factoryStage,
          });
        }
      });
      const factoryStage = Array.from(new Set(arr));
      const json1 = {};
      const json2 = {};
      temp1.map((item) => {
        factoryStage.map((item1) => {
          if (item.factoryStage === item1) {
            if (json1[item1]) {
              json1[item1] = [...json1[item1], ...[item]];
            } else {
              json1[item1] = [...[item]];
            }
          }
        });
      });
      temp2.map((item) => {
        factoryStage.map((item1) => {
          if (item.factoryStage === item1) {
            if (json2[item1]) {
              json2[item1] = [...json2[item1], ...[item]];
            } else {
              json2[item1] = [...[item]];
            }
          }
        });
      });
      factoryStage.map((item) => {
        columnData = [...columnData, ...json1[item]];
        lineData = [...lineData, ...json2[item]];
        sort.push({
          name: item,
          width: (width / temp2.length) * json2[item].length - 5,
        });
      });
    }
    return {
      columnData,
      lineData,
      sort,
    };
  }, [data2, pageSize1, page1, width]);
  const total1 = useMemo(() => {
    if (data2 && data2.shcbList && data2.shcbList.length > 0) {
      return Math.ceil(data2.shcbList.length / pageSize1);
    }
  }, [data2, pageSize1]);

  const basicColumns = [
    [
      {
        label: '电池',
        value: '电池',
      },
      {
        label: '模组',
        value: '模组',
      },
      {
        label: 'Pack',
        value: 'Pack',
      },
      {
        label: '打包',
        value: '打包',
      },
    ],
  ];
  const keys = popoverValue + '/' + chooseName + key;

  const plotRef = useRef<any>();
  const windowWidth = useWindowWidth();
  const height = windowWidth * 0.6;
  const [column1Key, setColumnKey] = useState(0);
  const config = {
    data,
    height,
    isStack: true,
    xField: 'year',
    yField: 'value',
    appendPadding: [0, 0, 10, 0],
    color: ['#5D6C8F', '#707E9D', '#5FCABB', '#6E94F2'],
    xAxis: {
      label: {
        autoHide: true,
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        offsetY: 3,
      },
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
                setKey(Number(keys) + 1);
                if (chooseName === nextCompany) {
                } else {
                  setChooseName(nextCompany);
                  setPage1(1);
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
  }, [data, chooseName]);

  useEffect(() => {
    plotRef.current.setState('inactive', (item) => {
      if (chooseName === '') {
        return false;
      }
      return item.year !== chooseName;
    });
  }, [chooseName, column1Key]);
  return (
    <>
      <HeadTitle>损耗成本占比</HeadTitle>

      <Card headerStyle={{ borderBottom: 'none' }} title="基地损耗成本分析">
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (万元)
        </div>

        <Column1
          key={column1Key}
          {...config}
          onReady={(plot) => {
            plotRef.current = plot;
            plot.on('element:click', (...args: any) => {
              sendBuriedPoint({
                pageName: eventTitle,
                level1: `${currentName}-关注页-${parentName}`,
                level2: `${currentName}-关注页-${parentName}-${eventTitle}`,
                pageAddress: 'metrics/' + metricId + '/detail',
                eventName: '维度切换',
                interfaceParam: `维度切换 ${args[0].data.data.year}`,
              });
            });
          }}
        />

        <div className={styles.legendBox}>
          <div className={styles.legend}>
            <span style={{ background: '#5183FD' }} />
            <div>电芯段</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#5FCABB' }} />
            <div>模组段</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#707E9D' }} />
            <div>Pack段</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#5D6C8F' }} />
            <div>打包段</div>
          </div>
        </div>
      </Card>

      <Card
        headerStyle={{ borderBottom: 'none', marginTop: '10px' }}
        title={`工段分析-${chooseName}`}
      >
        <div
          style={{
            float: 'right',
            marginTop: '-44px',
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
        {/* <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (元)
        </div> */}
        <DemoDualAxes
          columnData={detailData.columnData}
          lineData={detailData.lineData}
          keys={keys}
        />
        <div
          style={{
            width: '82%',
            margin: '-10px auto 10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {detailData.sort.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  height: '18px',
                  lineHeight: '18px',
                  background: '#F5F5F5',
                  color: '#777777',
                  fontSize: '12px',
                  textAlign: 'center',
                  borderRadius: '2px',
                  width: item.width,
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <div className={styles.legendBox} style={{ marginTop: '10px' }}>
          <div className={styles.legend}>
            <span style={{ background: '#5183FD' }} />
            <div>损耗金额(万元)</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#5FCABB' }} />
            <div>单位损耗(元/Kwh)</div>
          </div>
          <div className={styles.legend}>
            <span
              style={{ width: '8px', height: '2px', background: '#E08142' }}
            />
            <div>投入产出比</div>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 104 }}>
          <Pagination
            current={page1}
            onChange={(n) => {
              setPage1(n);
              sendBuriedPoint({
                pageName: eventTitle,
                level1: `${currentName}-关注页-${parentName}`,
                level2: `${currentName}-关注页-${parentName}-${eventTitle}`,
                pageAddress: 'metrics/' + metricId + '/detail',
                eventName: '维度切换',
                interfaceParam: `维度切换 第${n}页`,
              });
            }}
            total={total1}
          />
        </div>
      </Card>

      <Picker
        columns={basicColumns}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        value={[popoverValue]}
        onConfirm={(v) => {
          sendBuriedPoint({
            pageName: eventTitle,
            level1: `${currentName}-关注页-${parentName}`,
            level2: `${currentName}-关注页-${parentName}-${eventTitle}`,
            pageAddress: 'metrics/' + metricId + '/detail',
            eventName: '维度切换',
            interfaceParam: `维度切换 ${v[0]}`,
          });
          setPopoverValue(v[0]);
        }}
      />
    </>
  );
}

export default DetailMode;
