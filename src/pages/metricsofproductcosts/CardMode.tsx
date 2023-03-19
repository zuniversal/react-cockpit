import { ErrorBlock } from 'antd-mobile';
import moment from 'moment';
import { useState, useEffect, useMemo } from 'react';

import { Loading } from '../../components/loading/Loading';
import { SegmentedControls } from '../../components/tabs/SegmentedControls';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { tofixed, sendBuriedPoint } from '../../utils';

import styles from './CardMode.module.less';
import { ProductCostDualAxes } from './DualAxes';
// G2.registerTheme('common-theme', {
//   color10: ['#6E94F2', '#5FCABB', '#707E9D', '#5D6C8F', '#766BF5'],
// })

export function CardMode() {
  // const { user, setLoading, setEndDate } = useCurrentApp()
  const { user, setLoading, setEndDate } = useModel('user');
  const { token } = user;
  // 顶部切换卡片内容
  const [segmentKey, setSegmentedControlsActiveKey] = useState('1');
  // 本体标识(a)/交付类型(b)
  const [type1, setType1] = useState('');
  const [value1, setValue1] = useState<(string | null)[]>(['单体']);

  // 产品成本类别
  const {
    error: error1,
    data: sort,
    query: querySort,
  } = useQuery('/productcost/selectDeliveryType');

  //产品成本
  const {
    error,
    data: ProductCostData,
    query,
  } = useQuery('/productcost/selectProductCostClassify');
  console.log(ProductCostData);
  useMemo(() => {
    if (ProductCostData) {
      setLoading();
    }
  }, [ProductCostData]);
  useEffect(() => {
    querySort();
  }, [querySort]);

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    if (type1 !== '') {
      query({ type1, deliveryType: value1 });
    }
  }, [query, type1, value1]);

  useEffect(() => {
    if (!ProductCostData) return;
    setEndDate && setEndDate(ProductCostData.maxTime);
  }, [setEndDate, ProductCostData]);

  const segmentVisible = useMemo(() => {
    if (!ProductCostData) {
      return false;
    }
    if (ProductCostData.power === 'bj') {
      setSegmentedControlsActiveKey('1');
      return false;
    } else if (ProductCostData.power === 'sj') {
      setSegmentedControlsActiveKey('2');
      return false;
    } else {
      return ProductCostData.power === 'all';
    }
  }, [ProductCostData]);

  if (error) {
    return <ErrorBlock status="default" description={error.message} />;
  }

  return (
    <div className={styles.Card}>
      {segmentVisible && (
        <SegmentedControls
          activeKey={segmentKey}
          onChange={(key) => {
            setSegmentedControlsActiveKey(key);
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '维度切换',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `产品成本 ${segmentKey === '1' ? '实际成本' : '报价成本'}`,
            );
          }}
          tabs={[
            { key: '1', title: '报价成本' },
            { key: '2', title: '实际成本' },
          ]}
        />
      )}

      <div
        style={{
          // minHeight: '50vh',
          // maxHeight: '90vh',
          position: 'relative',
          zIndex: 103,
        }}
      >
        <ProductCostDualAxes
          // uvData={uvData}
          // transformData={transformData}
          sort={sort}
          type1={type1}
          setType1={setType1}
          segmentKey={segmentKey}
          data={ProductCostData && ProductCostData.productCostList}
          value1={value1}
          setValue1={setValue1}
        />
      </div>
    </div>
  );
}

export default CardMode;
