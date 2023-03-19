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
import { LoadEcharts, LoadTabs } from './Components';
import styles from './index.module.less';

export function CardMode() {
  // const { setDataMode, setEndDate, user, setLoading } = useCurrentApp()
  const { setDataMode, setEndDate, user, setLoading } = useModel('user');
  const { dateType } = user;
  const { pathname } = useLocation();
  // const { error, data, query } = useQuery(
  //   '/marketanalysis/selectMarketAnalysis'
  // )
  // useEffect(() => {
  //   query()
  // }, [])
  const [isLine, setIsLine] = useState(false);

  // if (!data) {
  //   return <Loading style={{ height: '30vh', width: '90vw' }} />
  // }

  // if (data.length <= 0) {
  //   return (
  //     <Empty src={empty} marginTop="34">
  //       暂无数据
  //     </Empty>
  //   )
  // }

  // if (error) {
  //   return <ErrorBlock description={error.message} />
  // }

  useEffect(() => {
    setLoading();
    setDataMode && setDataMode('mock');
  }, [setDataMode, pathname]);

  useEffect(() => {
    if (setEndDate) {
      setTimeout(() => {
        if (dateType === 'b') {
          setEndDate('截至2022.12.20');
        } else if (dateType === 'c') {
          setEndDate('截至2022.12.20');
        }
      }, 0);
    }
  }, [setEndDate, dateType]);

  return (
    <>
      <div>
        <LoadTabs />
        <LoadEcharts />
      </div>
    </>
  );
}

export default CardMode;
