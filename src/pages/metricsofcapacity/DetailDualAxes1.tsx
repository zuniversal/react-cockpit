import { DualAxes } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { tofixed } from '../../utils';

export const Analysis1DualAxes = (props) => {
  const { ColumnData, LineData } = props;
  const height = 0.65 * document.body.clientWidth;
  const { navigateToDetail } = useCurrentApp();

  const config = {
    data: [ColumnData, LineData],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'factoryStage',
    yField: ['value', '产能达成率'],
    xAxis: {
      label: {
        autoHide: false,
        formatter(val: string) {
          let idx = -1;
          if (val.length > 5) {
            if (val.indexOf('（') !== -1) {
              idx = val.indexOf('（');
              return val.slice(0, idx) + '\n' + val.slice(idx);
            } else {
              if (/^[a-zA-Z]+$/.test(val)) {
                if (val.length > 7) {
                  idx = Math.trunc(val.length / 2);
                  return val.slice(0, idx) + '\n' + val.slice(idx);
                } else {
                  return val;
                }
              } else {
                idx = Math.trunc(val.length / 2);
                return val.slice(0, idx) + '\n' + val.slice(idx);
              }
            }
          }
          return val;
        },
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
      产能达成率: {
        nice: true,
        min: 0,
        // max: 100,
        label: {
          formatter: (val) => val + '%',
        },
        tickCount: 4,
      },
    },
    legend: {
      position: 'bottom',
      flipPage: false,
    },
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        marginRatio: 0.1,
        seriesField: 'type',
        color: ['#5183FD', '#5FCABB', '#A3A6FF'],
        tooltip: {
          formatter: (datum) => {
            return { name: datum.type, value: tofixed(datum.value, 4) };
          },
        },
      },
      {
        geometry: 'line',
        // seriesField: 'name',
        smooth: true,
        color: '#E08142',
        lineStyle: {
          lineWidth: 2,
        },
        point: { shape: '', size: 2.5 },
        tooltip: {
          formatter: (datum) => {
            return {
              name: '产能达成率',
              value: tofixed(datum.产能达成率, 2) + '%',
            };
          },
        },
      },
    ],
  };
  return <DualAxes {...config} />;
};
