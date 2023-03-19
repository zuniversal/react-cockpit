import { ErrorBlock, Picker } from 'antd-mobile';
import { useState, useEffect, useMemo } from 'react';

import empty from '../../assets/icons/no-data.svg';
import { Loading } from '../../components/loading/Loading';
import { Pagination } from '../../components/pagination';
import { SegmentedControls } from '../../components/tabs/SegmentedControls';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { accMul } from '../../utils/index';
import { Empty } from '../empty/index';
import { EchartsMode } from './echartsMode';
import { EchartsMode2 } from './echartsMode2';

import styles from './styles.module.less';
import downIcon from '@/assets/icons/down-arrow.svg';
import upIcon from '@/assets/icons/up-arrow.svg';

export function CardMode() {
  // const { setLoading, setEndDate, cache, setCache } = useCurrentApp();
  const { setLoading, setEndDate, cache, setCache } = useModel('user');
  const { error, data, query } = useQuery(
    '/marketanalysis/selectMarketAnalysis',
  );

  const {
    error: error1,
    data: data1,
    query: query1,
  } = useQuery('/marketanalysis/selectMarketAnalysisTotal');

  const {
    error: error2,
    data: data2,
    query: query2,
  } = useQuery('/marketanalysis/selectMarketAnalysis');
  useMemo(() => {
    if (data && data1 && data2) {
      setLoading();
    }
  }, [data, data1, data2]);
  // const [segmentKey, setSegmentKey] = useState('国内乘用车')
  // const [isFold, setIsFold] = useState(true)
  // const [currentStage, setCurrentStage] = useState('上汽通用五菱')

  // const [segmentKey, setSegmentKey] = useState('国内乘用车')
  const segmentKey = cache.segmentKey ?? '国内乘用车';
  const setSegmentKey = (key) => setCache({ segmentKey: key });

  // const [isFold, setIsFold] = useState(true)
  const isFold = cache.isFold ?? true;
  const setIsFold = (key) => setCache({ isFold: key });

  // const [currentStage, setCurrentStage] = useState('上汽通用五菱')
  const currentStage = cache.currentStage ?? '';
  const setCurrentStage = (key) => setCache({ currentStage: key });

  const [visible, setVisible] = useState(false);
  // const [page, setPage] = useState(1)
  const page = cache.page ?? 1;
  const setPage = (key) => setCache({ page: key });

  const pageSize = 4;

  // const [page1, setPage1] = useState(1)
  const page1 = cache.page1 ?? 1;
  const setPage1 = (key) => setCache({ page1: key });

  const pageSize1 = 5;
  useEffect(() => {
    query({
      applicationArea: segmentKey,
    });
  }, [query, segmentKey]);

  const total1 = useMemo(() => {
    if (data && data.length > 0) {
      return Math.ceil(data.length / pageSize1);
    }
  }, [data, pageSize1]);

  const pageData1 = useMemo(() => {
    if (data && data.length > 0) {
      if (pageSize1 > 0) {
        const start = (page1 - 1) * pageSize1;
        return data.slice(start, start + pageSize1);
      }
      return data;
    }
  }, [data, pageSize1, page1]);

  const pickValue = useMemo(() => {
    if (data && data.length > 0) {
      const value = [];
      data.map((item, index) => {
        value.push({
          label: item.groupCustomer,
          value: item.groupCustomer,
        });
        if (index === 0 && !currentStage) {
          setCurrentStage(item.groupCustomer);
        }
      });
      return [value];
    }
  }, [data]);

  useEffect(() => {
    query1();
  }, [query1]);

  useEffect(() => {
    if (!data1) return;
    setEndDate && setEndDate(data1.deadline);
  }, [data1, setEndDate]);

  const selectMarketAnalysisTotal = useMemo(() => {
    let value = {};
    if (
      data1 &&
      data1.marketAnalysisTotalList &&
      data1.marketAnalysisTotalList.length > 0
    ) {
      data1.marketAnalysisTotalList.map((item) => {
        if (item.applicationArea === segmentKey) {
          value = item;
        }
      });
    }
    return value;
  }, [segmentKey, data1]);

  useEffect(() => {
    query2({
      groupCustomer: currentStage,
      applicationArea: segmentKey,
    });
  }, [query2, currentStage, segmentKey]);

  const total = useMemo(() => {
    if (data2 && data2.length > 0) {
      return Math.ceil(data2.length / pageSize) || 0;
    }
  }, [data2, pageSize]);

  const pageData = useMemo(() => {
    if (data2 && data2.length > 0) {
      if (pageSize > 0) {
        const start = (page - 1) * pageSize;
        return data2.slice(start, start + pageSize);
      }
      return data2;
    }
  }, [data2, pageSize, page]);

  if (error) {
    return <ErrorBlock description={error.message} />;
  }

  if (!data) {
    return <Loading style={{ height: '30vh', width: '90vw' }} />;
  }

  if (data.length <= 0) {
    return (
      <Empty src={empty} marginTop="34">
        暂无数据
      </Empty>
    );
  }

  return (
    <div className={styles.Card}>
      <SegmentedControls
        activeKey={segmentKey}
        onChange={(key) => {
          setSegmentKey(key);
          setPage(1);
          setPage1(1);
          setCurrentStage('');
        }}
        tabs={[
          { key: '国内乘用车', title: '国内乘用车' },
          { key: '国内商用车', title: '国内商用车' },
        ]}
      />
      <div className={styles.contentBox}>
        <div className={styles.contentItem}>
          <div className={styles.item1}>
            {selectMarketAnalysisTotal.installedClientQtySum}
            <span>Mwh</span>
          </div>
          <div className={styles.item2}>总装机量</div>
        </div>
        <div className={styles.contentItem}>
          <div className={styles.item1}>
            {selectMarketAnalysisTotal.installedCalbQtySum}
            <span>Mwh</span>
          </div>
          <div className={styles.item2}>CALB装机量</div>
        </div>
        <div className={styles.contentItem}>
          <div className={styles.item1}>
            {accMul(selectMarketAnalysisTotal.permeabilityTotal, 100)}%
          </div>
          <div className={styles.item2}>CALB渗透率</div>
        </div>
      </div>
      <div style={{ height: '280px' }}>
        <EchartsMode data={pageData1} segmentKey={segmentKey} />
      </div>
      <div style={{ position: 'relative', zIndex: 104 }}>
        <Pagination current={page1} onChange={setPage1} total={total1} />
      </div>

      {isFold ? (
        <div className={styles.fold_box_bg}>
          <div
            className={styles.fold_box}
            onClick={() => {
              setIsFold(!isFold);
            }}
          >
            <span>查看详细车型</span>
            <img
              style={{
                marginLeft: '9px',
              }}
              src={downIcon}
            />
          </div>
        </div>
      ) : (
        <div className={styles.fold_box_bg}>
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
          <div className={styles.fold_box_title}>
            <span className={styles.title}>具体车型</span>
            <div style={{ float: 'right', color: '#4774E7' }}>
              <div
                style={{
                  float: 'right',
                  color: '#4774E7',
                  position: 'relative',
                  zIndex: 104,
                }}
                onClick={() => {
                  setVisible(true);
                }}
              >
                {currentStage}
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    border: '1px solid rgb(71, 116, 231)',
                    borderWidth: '0 1px 1px 0',
                    transform: 'rotate(45deg)',
                    margin: '0 0 0 5px',
                    position: 'relative',
                    top: '-2px',
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ height: '245px' }}>
            <EchartsMode2 data={pageData} segmentKey={segmentKey} />
          </div>
          <div style={{ position: 'relative', zIndex: 104, marginTop: 14 }}>
            <Pagination current={page} onChange={setPage} total={total} />
          </div>
        </div>
      )}

      <Picker
        columns={pickValue}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        value={[currentStage]}
        onConfirm={(v) => {
          setCurrentStage(v[0]);
          setPage(1);
        }}
      />
    </div>
  );
}

export default CardMode;
