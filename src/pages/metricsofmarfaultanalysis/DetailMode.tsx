import { Line } from '@ant-design/plots';
import { useWindowWidth } from '@react-hook/window-size';
import { WaterMark, Card, ErrorBlock } from 'antd-mobile';
import React, { useState, useEffect, useMemo } from 'react';
import { useMatch, useSearchParams } from 'react-router-dom';

import decline from '../../assets/icons/decline.svg';
import empty from '../../assets/icons/no-data.svg';
import rise from '../../assets/icons/rise.svg';
import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { accMul } from '../../utils/index';
import { Empty } from '../empty/index';
import { AnalysisDualAxes, BarEcharts } from './Components';
import { Chart1 } from './Components/Chart1';
import { AnalysisDualAxes2 } from './Components/DualAxes2';
export function DetailMode() {
  const [search] = useSearchParams();
  const windowWidth = useWindowWidth();
  const factoryStage = search.get('factoryStage') ?? '';
  const [factoryType, setFactoryType] = useState(null);
  /**
   * 影响产量为a,故障时长为b
   */
  const [unit, setUnit] = useState<'a' | 'b'>('a');

  const api1 = useQuery('/equipmentAnalysis/selectEquipmentAnalysisByWorkshop');
  const api2 = useQuery('/equipmentAnalysis/selectEquipmentAnalysisDetail');

  useEffect(() => {
    api1.query({ factory: factoryStage });
  }, [api1.query, factoryStage]);

  useEffect(() => {
    if (factoryType) {
      api2.query({
        factory: factoryStage,
        workshop: factoryType,
        chooseFlag: unit,
      });
    }
  }, [api2.query, factoryStage, factoryType, unit]);

  useEffect(() => {
    if (api1.data && api1.data.length > 0) {
      if (!factoryType) {
        setFactoryType(api1.data[0].workShop);
      }
    }
  }, [api1.data]);

  return (
    <>
      <HeadTitle>{`设备故障分析-${factoryStage}`}</HeadTitle>
      <Card headerStyle={{ borderBottom: 'none' }} title="车间故障分析">
        {(() => {
          if (api1.error) {
            return <ErrorBlock description={api1.error.message} />;
          }

          if (!api1.data) {
            return <Loading style={{ height: '30vh', width: '90vw' }} />;
          }

          if (api1.data.length === 0) {
            return (
              <Empty src={empty} marginTop="90">
                暂无数据
              </Empty>
            );
          }
          return (
            <Chart1
              data={api1.data}
              onClickItem={(item) => {
                const next = item.workShop;
                if (factoryType !== next) {
                  setFactoryType(next);
                }
              }}
              height={windowWidth * 0.65}
            />
          );
        })()}
      </Card>
      <Card
        headerStyle={{ borderBottom: 'none', marginTop: '10px' }}
        title={factoryType ? `影响产量TOP10-${factoryType}` : '影响产量TOP10'}
        extra={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => {
                setUnit((prev) => (prev === 'a' ? 'b' : 'a'));
              }}
            >
              <div style={{ color: '#4774E7' }}>
                {unit === 'a' ? '影响产量' : '故障时间'}
              </div>
              <img src={require('../../assets/icons/switch-1.svg')} />
            </div>
          </div>
        }
      >
        <div style={{ height: 300 }}>
          {(() => {
            if (api1.data && api1.data.length === 0) {
              return (
                <Empty src={empty} marginTop="90">
                  暂无数据
                </Empty>
              );
            }
            if (api2.error) {
              return <ErrorBlock description={api2.error.message} />;
            }

            if (!api2.data) {
              return <Loading style={{ height: '30vh', width: '90vw' }} />;
            }
            return (
              <BarEcharts
                data={api2.data}
                unit={unit}
                factoryType={factoryType}
              />
            );
          })()}
        </div>
      </Card>
    </>
  );
}

export default DetailMode;
