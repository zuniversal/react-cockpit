import { Column } from '@ant-design/plots';
import { useWindowWidth } from '@react-hook/window-size';
import { WaterMark, Card, ErrorBlock, Toast } from 'antd-mobile';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import React, { useState, useEffect, memo, useRef } from 'react';
import { useMatch, useSearchParams } from 'react-router-dom';

import decline from '../../assets/icons/decline.svg';
import empty from '../../assets/icons/no-data.svg';
import rise from '../../assets/icons/rise.svg';
import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { tofixed } from '../../utils';
import styles from './styles.module.less';

const Column1 = memo(Column, () => true);

export function DetailMode() {
  const toastHandler = useRef<ToastHandler>();
  const { navigateToDetail } = useCurrentApp();
  const [search] = useSearchParams();
  const baseName = search.get('baseName') ?? '江苏';
  const plotRef = useRef<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        localStorage.getItem(
          'datafrontcalb/tooltip/clickcolumn/energyconsumptioncost',
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
                    'datafrontcalb/tooltip/clickcolumn/energyconsumptioncost',
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

  const data = [
    { year: '江苏', value: 1500, type: '气' },
    { year: '成都', value: 1000, type: '气' },
    { year: '武汉', value: 1000, type: '气' },
    { year: '合肥', value: 800, type: '气' },
    { year: '厦门', value: 1000, type: '气' },
    { year: '江门', value: 800, type: '气' },
    { year: '江苏', value: 1200, type: '水' },
    { year: '成都', value: 1500, type: '水' },
    { year: '武汉', value: 1500, type: '水' },
    { year: '合肥', value: 1500, type: '水' },
    { year: '厦门', value: 1600, type: '水' },
    { year: '江门', value: 1500, type: '水' },
    { year: '江苏', value: 2200, type: '电' },
    { year: '成都', value: 1800, type: '电' },
    { year: '武汉', value: 1900, type: '电' },
    { year: '合肥', value: 1700, type: '电' },
    { year: '厦门', value: 2100, type: '电' },
    { year: '江门', value: 1800, type: '电' },
  ];

  const config = {
    data,
    height: 200,
    isStack: true,
    xField: 'year',
    yField: 'value',
    padding: 'auto',
    appendPadding: [0, 0, 10, 0],
    color: ['#707E9D', '#5FCABB', '#5183FD'],
    yAxis: {
      nice: true,
      tickCount: 5,
      tickInterval: 2000,
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
    onReady: (plot) => {
      plotRef.current = plot;
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
                const baseName1 = evt.event.data.data.year;
                if (baseName1 !== baseName) {
                  navigateToDetail({ baseName: baseName1 }, { replace: true });
                }
              },
            },
          ],
        },
      },
    ],
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

  const data2 = [
    { year: '工厂1', value: 1500, type: '气' },
    { year: '工厂2', value: 1000, type: '气' },
    { year: '工厂3', value: 1000, type: '气' },
    { year: '工厂4', value: 800, type: '气' },
    { year: '工厂5', value: 1000, type: '气' },
    { year: '工厂6', value: 800, type: '气' },
    { year: '工厂1', value: 1200, type: '水' },
    { year: '工厂2', value: 1500, type: '水' },
    { year: '工厂3', value: 1500, type: '水' },
    { year: '工厂4', value: 1500, type: '水' },
    { year: '工厂5', value: 1600, type: '水' },
    { year: '工厂6', value: 1500, type: '水' },
    { year: '工厂1', value: 2200, type: '电' },
    { year: '工厂2', value: 1800, type: '电' },
    { year: '工厂3', value: 1900, type: '电' },
    { year: '工厂4', value: 1700, type: '电' },
    { year: '工厂5', value: 2100, type: '电' },
    { year: '工厂6', value: 1800, type: '电' },
  ].map((item) => {
    return {
      ...item,
      value: parseInt(
        Math.round(item.value * (1 - Math.random())).toFixed(0),
        10,
      ),
    };
  });

  const config2 = {
    data: data2,
    height: 200,
    isStack: true,
    xField: 'year',
    yField: 'value',
    padding: 'auto',
    appendPadding: [0, 0, 10, 0],
    color: ['#707E9D', '#5FCABB', '#5183FD'],
    yAxis: {
      nice: true,
      tickCount: 5,
      tickInterval: 2000,
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
  useEffect(() => {
    plotRef.current?.setState('inactive', (item) => {
      if (baseName === '' || baseName === 'undefined') {
        return false;
      }
      return baseName !== item.year;
    });
  }, [baseName]);
  return (
    <>
      <HeadTitle>能耗成本</HeadTitle>

      <Card headerStyle={{ borderBottom: 'none' }} title="基地能耗成本分析">
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (万元)
        </div>
        <div style={{ position: 'relative', zIndex: 103 }}>
          <Column1 key={baseName} {...config} />
        </div>

        <div className={styles.legendBox}>
          <div className={styles.legend}>
            <span style={{ background: '#5183FD' }} />
            <div>电</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#5FCABB' }} />
            <div>水</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#707E9D' }} />
            <div>气</div>
          </div>
        </div>
      </Card>

      <Card
        headerStyle={{ borderBottom: 'none', marginTop: 20 }}
        title={`工厂能耗成本-${baseName}`}
      >
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (万元)
        </div>
        <div style={{ position: 'relative', zIndex: 103 }}>
          <Column {...config2} />
        </div>

        <div className={styles.legendBox}>
          <div className={styles.legend}>
            <span style={{ background: '#5183FD' }} />
            <div>电</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#5FCABB' }} />
            <div>水</div>
          </div>
          <div className={styles.legend}>
            <span style={{ background: '#707E9D' }} />
            <div>气</div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default DetailMode;
