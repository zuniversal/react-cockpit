import { useWindowWidth } from '@react-hook/window-size';
import { ErrorBlock, Picker } from 'antd-mobile';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import beforeIcon from '../../assets/icons/beforeIcon.svg';
import empty from '../../assets/icons/no-data.svg';
import { Loading } from '../../components/loading/Loading';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { Empty } from '../empty/index';
import { PieEcharts, FaultTabs, AnalysisDualAxes, MoreBtn } from './Components';
import styles from './index.module.less';
export function CardMode() {
  // const { setDataMode, setEndDate, setLoading } = useCurrentApp();
  const { setDataMode, setEndDate, setLoading } = useModel('user');
  const [IsFold, setIsFold] = useState(false);
  const { pathname } = useLocation();
  const windowWidth = useWindowWidth();

  const api1 = useQuery('/equipmentAnalysis/selectEquipmentAnalysis');
  const api2 = useQuery('/equipmentAnalysis/selectEquipmentAnalysisTrend');

  useEffect(() => {
    api1.query();
  }, [api1.query]);

  useEffect(() => {
    api2.query();
  }, [api2.query]);
  useMemo(() => {
    if ((api1.data, api2.data)) {
      setLoading();
    }
  }, [api1, api2]);
  useEffect(() => {
    if (api1.data && api1.data.deadline) {
      setEndDate && setEndDate(api1.data.deadline);
    }
  }, [setEndDate, api1.data]);

  return (
    <>
      <div>
        <FaultTabs data={api1.data ?? []} />
        <div
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#000',
            margin: '16px 0 0',
          }}
        >
          设备故障占比
        </div>
        <div
          style={{
            zIndex: '99',
          }}
        >
          {(() => {
            if (api1.error) {
              return <ErrorBlock description={api1.error.message} />;
            }

            if (!api1.data) {
              return <Loading style={{ height: '30vh', width: '90vw' }} />;
            }

            if (api1.data && api1.data.equipmentAnalysisList.length <= 0) {
              return (
                <Empty src={empty} marginTop="34">
                  暂无数据
                </Empty>
              );
            }
            return <PieEcharts data={api1.data.equipmentAnalysisList} />;
          })()}
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: '98',
            // marginTop: '-60px',
          }}
        >
          <MoreBtn
            click={(e) => {
              setIsFold(e);
            }}
          />
          {IsFold && (
            <div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  fontFamily: 'PingFang SC',
                  color: '#000',
                  marginBottom: 10,
                }}
              >
                近12月趋势
              </div>
              <div style={{ height: windowWidth * 0.65 }}>
                {(() => {
                  if (api2.error) {
                    return <ErrorBlock description={api2.error.message} />;
                  }

                  if (!api2.data) {
                    return (
                      <Loading style={{ height: '30vh', width: '90vw' }} />
                    );
                  }

                  if (api2.data.length <= 0) {
                    return (
                      <Empty src={empty} marginTop="34">
                        暂无数据
                      </Empty>
                    );
                  }
                  return (
                    <AnalysisDualAxes
                      data={api2.data}
                      height={windowWidth * 0.65}
                      unit="min"
                      shouldInactive={() => false}
                    />
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CardMode;
