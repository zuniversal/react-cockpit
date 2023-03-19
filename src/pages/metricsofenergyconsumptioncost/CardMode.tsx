import { Pie, Column } from '@ant-design/plots';
import { ErrorBlock } from 'antd-mobile';
import { useState, useEffect, useMemo, memo } from 'react';

import empty from '../../assets/icons/no-data.svg';
import { Loading } from '../../components/loading/Loading';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { Empty } from '../empty/index';
import styles from './styles.module.less';

import costrightIcon from '@/assets/icons/costright.svg';
import declineIcon from '@/assets/icons/decline.svg';
import downIcon from '@/assets/icons/down-arrow.svg';
import upIcon from '@/assets/icons/up-arrow.svg';

const Pie1 = memo(Pie, () => {
  return true;
});

export function CardMode() {
  const [isFold, setIsFold] = useState(true);
  // const { navigateToDetail, setDataMode, setEndDate, user, setLoading } =
  //   useCurrentApp()
  const { navigateToDetail, setDataMode, setEndDate, user, setLoading } =
    useModel('user');
  useEffect(() => {
    setLoading();
  }, []);
  const { dateType } = user;
  const data = [
    {
      type: '电',
      value: 60,
    },
    {
      type: '水',
      value: 30,
    },
    {
      type: '气',
      value: 10,
    },
  ];
  const config = {
    appendPadding: 0,
    data,
    height: 200,
    color: ['#6E94F2', '#5FCABB', '#707E9D', '#5D6C8F'],
    legend: false,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    tooltip: {
      formatter: (value) => {
        return {
          name: value.type,
          value: value.value,
        };
      },
      containerTpl: `
          <div class="g2-tooltip">
            <!-- 列表容器，会自己填充 -->
            <ul class="g2-tooltip-list"></ul>
          </div>
        `,
      itemTpl: `
          <ul class="g2-tooltip-list">
            <li class="g2-tooltip-list-item">
              <span class="g2-tooltip-name">{name}</span>
            </li>
            <li class="g2-tooltip-list-item">
              <span class="g2-tooltip-name">成本</span>
              <span class="g2-tooltip-value">{value}</span>
            </li>
        </ul>
        `,
      domStyles: {
        'g2-tooltip-name': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 13,
        },
        'g2-tooltip-value': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 10,
        },
        'g2-tooltip': {
          background: 'rgba(0, 0, 0, 0.86)',
          color: '#fff',
        },
      },
    },
  };

  const data1 = [
    { year: '01', value: 90, type: '气' },
    { year: '02', value: 50, type: '气' },
    { year: '03', value: 80, type: '气' },
    { year: '04', value: 40, type: '气' },
    { year: '05', value: 50, type: '气' },
    { year: '06', value: 60, type: '气' },
    { year: '07', value: 50, type: '气' },
    { year: '08', value: 45, type: '气' },
    { year: '09', value: 80, type: '气' },
    { year: '10', value: 60, type: '气' },
    { year: '11', value: 60, type: '气' },
    { year: '12', value: 90, type: '气' },
    { year: '01', value: 90, type: '水' },
    { year: '02', value: 50, type: '水' },
    { year: '03', value: 70, type: '水' },
    { year: '04', value: 40, type: '水' },
    { year: '05', value: 50, type: '水' },
    { year: '06', value: 60, type: '水' },
    { year: '07', value: 50, type: '水' },
    { year: '08', value: 45, type: '水' },
    { year: '09', value: 80, type: '水' },
    { year: '10', value: 60, type: '水' },
    { year: '11', value: 60, type: '水' },
    { year: '12', value: 90, type: '水' },
    { year: '01', value: 160, type: '电' },
    { year: '02', value: 110, type: '电' },
    { year: '03', value: 140, type: '电' },
    { year: '04', value: 90, type: '电' },
    { year: '05', value: 120, type: '电' },
    { year: '06', value: 130, type: '电' },
    { year: '07', value: 120, type: '电' },
    { year: '08', value: 100, type: '电' },
    { year: '09', value: 140, type: '电' },
    { year: '10', value: 130, type: '电' },
    { year: '11', value: 100, type: '电' },
    { year: '12', value: 160, type: '电' },
  ];
  const config2 = {
    data: data1,
    height: 200,
    isStack: true,
    xField: 'year',
    yField: 'value',
    color: ['#707E9D', '#5FCABB', '#5183FD'],
    yAxis: {
      nice: true,
      tickCount: 5,
      tickInterval: 100,
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
    setDataMode && setDataMode('mock');
    if (setEndDate) {
      setTimeout(() => {
        if (dateType === 'b') {
          setEndDate('2022.12');
        } else if (dateType === 'c') {
          setEndDate('截至2022.12');
        }
      }, 0);
    }
  }, [setEndDate, dateType, setDataMode]);

  return (
    <>
      <div
        className={styles.topBox}
        onClick={() => {
          navigateToDetail();
        }}
      >
        <div className={styles.top}>
          <div>
            总成本(万元)<span>40</span>
          </div>
          <img src={costrightIcon} />
        </div>
        <div className={styles.bottomBox}>
          <div className={styles.bottom}>
            <span className={styles.bottomName}>同比</span>
            <span className={styles.bottomValue}>
              -15%
              <img src={declineIcon} />
            </span>
            <span>
              (20<span>万元</span>)
            </span>
          </div>
          <div className={styles.line} />
          <div className={styles.bottom}>
            <span className={styles.bottomName}>环比</span>
            <span className={styles.bottomValue}>
              -15%
              <img src={declineIcon} />
            </span>
            <span>
              (20<span>万元</span>)
            </span>
          </div>
        </div>
      </div>

      <div className={styles.wastagecost}>能耗成本占比</div>

      <div className={styles.pieBox}>
        <Pie1 {...config} />
      </div>

      {isFold ? (
        <div
          className={styles.fold_box}
          onClick={() => {
            setIsFold(!isFold);
          }}
        >
          <span>查看近12月趋势对比</span>
          <img
            style={{
              marginLeft: '9px',
            }}
            src={downIcon}
          />
        </div>
      ) : (
        <div>
          <div
            className={styles.fold_box}
            onClick={() => {
              setIsFold(!isFold);
            }}
          >
            <span>收起</span>
            <img
              style={{
                marginLeft: '9px',
              }}
              src={upIcon}
            />
          </div>

          <div
            className={styles.wastagecost}
            style={{ marginTop: '15px', fontWeight: 400 }}
          >
            近12月趋势
          </div>

          <div
            style={{
              color: '#999',
              padding: '16px 0 5px 0',
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
        </div>
      )}
    </>
  );
}
