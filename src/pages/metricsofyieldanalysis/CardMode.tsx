import { Card, ErrorBlock } from 'antd-mobile';
import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { Loading } from '../../components/loading/Loading';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { tofixed } from '../../utils';
import { Empty } from '../empty/index';
import styles from './CardMode.module.less';
import { AnalysisDualAxes } from './DualAxes';
import { AnalysisGauge } from './Gauge';
import styles1 from './index.module.less';

export const CardMode = () => {
  // const { user, setLoading, setEndDate } = useCurrentApp()
  const { user, setLoading, setEndDate } = useModel('user');
  const { chooseDate, dateType } = user;
  const time = localStorage.getItem('yieldAnalysisTime');

  const con = useMemo(() => {
    if (dateType === 'a') {
      return {
        chooseDate: time,
      };
    }
    return {};
  }, [dateType, time]);

  // 良率分析
  const { error, data, query } = useQuery('/productanaly/selectProductAnaly');
  useMemo(() => {
    if (data) {
      setLoading();
    }
  }, [data]);
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query();
  }, [con, query]);

  useEffect(() => {
    if (data && data.deadline) {
      setEndDate && setEndDate(data.deadline);
    }
  }, [data, setEndDate]);

  if (error) {
    return <ErrorBlock description={error.message} />;
  }
  if (!data) {
    return <Loading style={{ height: '30vh', width: '90vw' }} />;
  }
  if (data?.productAnalyList?.length <= '0' || !data?.productAnalyList) {
    return (
      <div
        className={styles.no_data}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          width: '100%',
          height: '188px',
        }}
      >
        <Empty src={require('../../assets/icons/no-data.svg')} marginTop={0}>
          暂无数据
        </Empty>
      </div>
    );
  }
  return (
    <div className={styles.Card}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridGap: '12px',
          alignItems: 'stretch',
          padding: 10,
          position: 'relative',
          zIndex: 103,
        }}
      >
        <AnalysisGauge
          contentValue={data && data.finalPerTotal}
          contentText="最终合格率"
        />
        <AnalysisGauge
          contentValue={data && data.firstPerTotal}
          contentText="一次合格率"
        />
      </div>
      <div style={{ height: 20 }} />

      <div style={{ height: '31vh', position: 'relative', zIndex: 103 }}>
        <AnalysisDualAxes con={con} />
      </div>
      <div className={styles.legendBox} style={{ padding: '10px 10% 0' }}>
        <div>
          <span style={{ background: '#5183FD' }} />
          报废金额
        </div>
        <div>
          <span
            style={{
              borderRadius: '50%',
              border: '2px solid #5FCABB',
              width: 6,
              height: 6,
            }}
          />
          最终合格率
        </div>
        <div>
          <span
            style={{
              borderRadius: '50%',
              border: '2px solid #E08142',
              width: 6,
              height: 6,
            }}
          />
          一次合格率
        </div>
      </div>
    </div>
  );
};

export default CardMode;
