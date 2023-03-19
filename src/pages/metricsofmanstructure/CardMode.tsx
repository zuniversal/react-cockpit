import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import decline from '../../assets/metricsicons/decline.svg';
import rise from '../../assets/metricsicons/rise.svg'; //上升图标
import top from '../../assets/metricsicons/top.svg';
import { Pagination } from '../../components/pagination';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import styles from './CardMode.module.less';
import { DemoDualAxes } from './Pie';
import { DemoDualAxes1 } from './Pie1';
export function CardMode() {
  const [state, setState] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pages, setPages] = useState(1);
  // const { setEndDate, user, setDataMode, setLoading } = useCurrentApp()
  const { setEndDate, user, setDataMode, setLoading } = useModel('user');
  const { dateType } = user;
  // 图例卡片内容
  const legendCardItem = [
    {
      title: '当前在职人数',
      persion: '100000',
      withtype: '同比',
      withValue: '-15',
      ringType: '环比',
      ringValue: '-15',
    },
    {
      title: '年初在职人数',
      persion: '100000',
      withtype: '同比',
      withValue: '-15',
      ringType: '环比',
      ringValue: '-15',
    },
  ];
  const handleClick = () => {
    setState(!state);
  };

  useEffect(() => {
    setLoading();
    setDataMode && setDataMode('mock');
    if (setEndDate) {
      setTimeout(() => {
        if (dateType === 'a') {
          setEndDate('2023.01.04');
        } else {
          setEndDate('截至2023.01.04');
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
              <h2>{item.title}</h2>
              <p>{item.persion}</p>
              <div className={styles.bottomType}>
                <div className={styles.cardType}>
                  <p>
                    {item.withValue}%<img src={decline} />
                  </p>

                  <div>{item.withtype}</div>
                </div>
                <div className={styles.cardType}>
                  <p>
                    {item.ringValue}%<img src={decline} />
                  </p>
                  <div>{item.ringType}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className={styles.persionP}>(人数)</p>
      <DemoDualAxes />
      <div className={styles.legendList}>
        <div>
          <span />
          当前在职人数
        </div>
      </div>
      <div className={styles.showBtn} onClick={handleClick}>
        查看应届生情况
        {state ? (
          <img src={top} />
        ) : (
          <img src={top} style={{ transform: 'rotate(180deg)' }} />
        )}
      </div>
      {state ? (
        <>
          <DemoDualAxes1 />
          <div className={styles.legendList}>
            <div>
              <span style={{ background: '#5D6C8F' }} />
              2022届
            </div>
            <div>
              <span style={{ background: '#707E9D' }} />
              2021届
            </div>
            <div>
              <span style={{ background: '#5FCABB' }} />
              2020届
            </div>
            <div>
              <span style={{ background: '#6E94F2' }} />
              2019届
            </div>
          </div>
          <Pagination total={pages} current={pageNo} onChange={setPageNo} />
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default CardMode;
