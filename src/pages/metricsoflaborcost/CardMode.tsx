import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pagination } from '../../components/pagination';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import styles from './CardMode.module.less';
import { Cost } from './Cost';

export function CardMode() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [pages, setPages] = useState(1);
  // const { setEndDate, user, setLoading, setDataMode } = useCurrentApp()
  const { setEndDate, user, setLoading, setDataMode } = useModel('user');
  console.log(' user ： ', user);
  const { dateType } = user;
  // 图例卡片内容
  const legendCardItem = [
    {
      text: '一线单位成本',
      text1: '(万元/Gwh)',
      value: '30',
    },
    {
      text: '非一线单位成本',
      text1: '(万元/Gwh)',
      value: '50',
    },
  ];

  useEffect(() => {
    setDataMode && setDataMode('mock');
    setLoading();
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
    <div className={styles.maximal} style={{ position: 'relative' }}>
      <div className={styles.tabCard}>
        {legendCardItem.map((item, index) => {
          return (
            <div className={styles.cardDetail} key={index}>
              <h2>{item.value}</h2>
              <p>{item.text}</p>
              <p>{item.text1}</p>
            </div>
          );
        })}
      </div>
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.unitFont} style={{ marginTop: '10px' }}>
            (万元)
          </div>
        </div>
        <div style={{ padding: '0 0 0' }}>
          <Cost />
        </div>
      </>
    </div>
  );
}

export default CardMode;
