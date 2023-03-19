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
import { AnalysisDualAxes } from './Components';
import { AnalysisDualAxes2 } from './Components/DualAxes2';
import styles from './index.module.less';
export function DetailMode() {
  const [search] = useSearchParams();
  const factoryName = search.get('factoryName') ?? '';
  // const factoryStage = search.get('factoryStage') ?? ''
  const [factoryStage, setFactoryState] = useState('');
  const { user } = useCurrentApp();
  const { userInfo } = user;
  const [lineName, setLineName] = useState('');
  const [isShow, setIsShow] = useState(false);
  // const {
  //   error,
  //   data: detailData,
  //   query,
  // } = useQuery('/marketanalysis/selectMarketAnalysisTrend')
  const data = [];
  useEffect(() => {
    // query({ groupCustomer: type })
    // setTimeout(() => {
    //   setIsShow(true)
    // }, 500)
  }, []);

  // if (!data) {
  //   return <Loading style={{ height: '30vh', width: '90vw' }} />
  // }

  // if (data.length <= 0 && isShow) {
  //   return (
  //     <Empty src={empty} marginTop="34">
  //       暂无数据
  //     </Empty>
  //   )
  // }

  // if (error) {
  //   return <ErrorBlock description={error.message} />
  // }

  return (
    <>
      <HeadTitle>{`产能负荷度-${factoryName}`}</HeadTitle>
      <Card headerStyle={{ borderBottom: 'none' }} title="十二个月产能负荷情况">
        {/* <Line {...config} /> */}
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (Gwh)
        </div>
        <AnalysisDualAxes
          factoryName={factoryName}
          factoryStage={factoryStage}
          isGWH
          key={factoryStage}
          setFactoryState={setFactoryState}
        />
        <div className={styles.legendBox}>
          <div>
            <span style={{ background: '#5183FD' }} />
            产能
          </div>
          <div>
            <span style={{ background: '#5FCABB' }} />
            客户需求
          </div>
          <div>
            <span
              style={{
                background: '#E08142',
                width: 14,
                height: 2,
              }}
            />
            产线负荷率
          </div>
        </div>
      </Card>
      <Card
        headerStyle={{ borderBottom: 'none', marginTop: '10px' }}
        title="当月产品型号产能负荷情况"
      >
        <div
          style={{
            color: '#999',
            padding: '0 0 5px 0',
            fontSize: '12px',
          }}
        >
          (Mwh)
        </div>
        <AnalysisDualAxes2
          factoryName={factoryName}
          factoryStage={factoryStage}
          isGWH
          key={factoryStage}
        />
        <div className={styles.legendBox}>
          <div>
            <span style={{ background: '#5183FD' }} />
            产能
          </div>
          <div>
            <span style={{ background: '#5FCABB' }} />
            客户需求
          </div>
          <div>
            <span
              style={{
                background: '#E08142',
                width: 14,
                height: 2,
              }}
            />
            产线负荷率
          </div>
        </div>
      </Card>
      {/* <Line {...config} /> */}

      {/* <WaterMark {...props} /> */}
    </>
  );
}

export default DetailMode;
