import { useWindowWidth } from '@react-hook/window-size';
import { WaterMark, Card } from 'antd-mobile';
import * as echarts from 'echarts';
import { useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';

const data = [
  {
    name: '01',
    name2: '11',
    总人均产能: 16,
    一线人均产能: 14,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 37,
  },
  {
    name: '02',
    name2: '21.12',
    总人均产能: 16,
    一线人均产能: 14,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 30,
  },
  {
    name: '03',
    name2: '01',
    总人均产能: 17,
    一线人均产能: 13,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 28,
  },
  {
    name: '04',
    name2: '02',
    总人均产能: 18,
    一线人均产能: 14,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 30,
  },
  {
    name: '05',
    name2: '03',
    总人均产能: 18,
    一线人均产能: 13,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 37,
  },
  {
    name: '06',
    name2: '04',
    总人均产能: 16,
    一线人均产能: 14,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 30,
  },
  {
    name: '07',
    name2: '05',
    总人均产能: 15,
    一线人均产能: 12,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 28,
  },
  {
    name: '08',
    name2: '06',
    总人均产能: 16,
    一线人均产能: 12,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 30,
  },
  {
    name: '09',
    name2: '07',
    总人均产能: 15,
    一线人均产能: 11,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 37,
  },
  {
    name: '10',
    name2: '08',
    总人均产能: 15,
    一线人均产能: 11,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 30,
  },
  {
    name: '11',
    name2: '09',
    总人均产能: 14,
    一线人均产能: 10,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 28,
  },
  {
    name: '12',
    name2: '22.10',
    总人均产能: 13,
    一线人均产能: 9,
    目标单位产能成本: 32,
    实际产能成本: 40,
    单位产能偏差率: 30,
  },
];

export function DetailMode() {
  const [search] = useSearchParams();
  const { navigateToDetail } = useCurrentApp();
  const type = search.get('type') ?? '';
  const baseName = search.get('baseName') ?? '';
  const groupTab = search.get('groupTab') ?? '';
  const lineChartRef = useRef();
  const axesChartRef = useRef();

  const changeGroupTab = useCallback(
    (groupTab) => {
      navigateToDetail(
        {
          type: 'group',
          groupTab,
        },
        { replace: true },
      );
    },
    [navigateToDetail],
  );

  const subtitle = useMemo(() => {
    return type === 'group' ? '集团人均产能' : baseName;
  }, [baseName, type]);

  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (lineChartRef.current) {
      const lineChart = echarts.init(lineChartRef.current);
      let legendData = ['总人均产能', '一线人均产能'];
      if (type === 'group') {
        legendData = [groupTab];
      }
      let series = [
        {
          name: '总人均产能',
          data: data.map((item) => item['总人均产能']),
          type: 'line',
          color: '#766BF5',
          smooth: true,
        },
        {
          name: '一线人均产能',
          data: data.map((item) => item['一线人均产能']),
          color: '#E08142',
          type: 'line',
          smooth: true,
        },
      ];
      if (type === 'group') {
        series = series.filter((item) => item.name === groupTab);
      }
      lineChart.setOption({
        grid: { x: 30, y: 20, x2: 20, y2: 60 },
        legend: {
          bottom: 0,
          data: legendData,
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name),
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          min: 0,
          max: 30,
          type: 'value',
        },
        series,
      });
    }

    if (axesChartRef.current) {
      const axesChart = echarts.init(axesChartRef.current);
      const legendData = ['目标单位产能成本', '实际产能成本', '单位产能偏差率'];

      const series = [
        {
          name: '目标单位产能成本',
          data: data.map((item) => item['目标单位产能成本']),
          type: 'bar',
          color: '#5183FD',
          smooth: true,
          barMaxWidth: 4,
        },
        {
          name: '实际产能成本',
          data: data.map((item) => item['实际产能成本']),
          color: '#5FCABB',
          type: 'bar',
          smooth: true,
          barMaxWidth: 4,
        },
        {
          name: '单位产能偏差率',
          data: data.map((item) => item['单位产能偏差率']),
          color: '#E08142',
          type: 'line',
          smooth: true,
        },
      ];

      axesChart.setOption({
        grid: { x: 30, y: 20, x2: 20, y2: windowWidth > 380 ? 60 : 70 },
        legend: {
          bottom: 0,
          data: legendData,
          itemWidth: 15,
          itemHeight: 9,
          textStyle: {
            fontSize: 10,
          },
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: data.map((item) => item.name2),
          axisLabel: { interval: 0 },
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          min: 0,
          max: 40,
          type: 'value',
        },
        series,
      });
    }
  }, [groupTab, windowWidth, type]);

  return (
    <>
      <HeadTitle>{`人效分析-${subtitle}`}</HeadTitle>
      <Card
        headerStyle={{ borderBottom: 'none' }}
        title="近12个月人均产能"
        // extra={
        //   type === 'group' && (
        //     <div
        //       style={{
        //         display: 'flex',
        //         alignItems: 'center',
        //         justifyContent: 'flex-end',
        //       }}
        //     >
        //       <div
        //         style={{ display: 'flex', alignItems: 'center' }}
        //         onClick={() => {
        //           changeGroupTab(
        //             groupTab === '一线人均产能' ? '总人均产能' : '一线人均产能'
        //           )
        //         }}
        //       >
        //         <div style={{ color: '#4774E7' }}>{groupTab.slice(0, -2)}</div>
        //         <div>
        //           <img src={require('../../assets/icons/arrowDown.svg')} />
        //         </div>
        //       </div>
        //     </div>
        //   )
        // }
      >
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (Kwh/人)
        </div>
        <div>
          <div
            ref={lineChartRef}
            style={{ width: windowWidth - 44, height: windowWidth * 0.6 }}
          />
        </div>
      </Card>
      <Card
        headerStyle={{ borderBottom: 'none', marginTop: '10px' }}
        title="近12月单位产能成本"
      >
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (元/Kwh)
        </div>

        <div
          ref={axesChartRef}
          style={{ width: windowWidth - 44, height: windowWidth * 0.6 }}
        />
      </Card>
      <WaterMark />
    </>
  );
}

export default DetailMode;
