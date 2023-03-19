import { G2 } from '@ant-design/plots';
import { ErrorBlock } from 'antd-mobile';
import { useState, useEffect, useMemo } from 'react';

import empty from '../../assets/icons/no-data.svg';
import { LabelCard } from '../../components/card/LabelCard';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { tofixed } from '../../utils';
import { Empty } from '../empty/index';
import styles from './CardMode.module.less';
import { DeliveryPie } from './Pie';
import styles1 from './index.module.less';

G2.registerTheme('common-theme', {
  color10: ['#6E94F2', '#5FCABB', '#707E9D', '#5D6C8F', '#766BF5'],
});

export function CardMode() {
  // const { navigateToDetail, setLoading, setEndDate } = useCurrentApp();
  const { navigateToDetail, setLoading, setEndDate } = useModel('user');
  console.log(' useCurrentApp() ： ', useCurrentApp());

  const [activeValue, setActiveValue] = useState({});
  //分类销售总额
  const {
    error,
    data: selectCustomerDemandDeliveryData,
    query,
  } = useQuery('/customerDemandDelivery/selectCustomerDemandDelivery');
  useMemo(() => {
    if (selectCustomerDemandDeliveryData) {
      setLoading();
    }
  }, [selectCustomerDemandDeliveryData]);
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query();
  }, [query]);

  useEffect(() => {
    if (!selectCustomerDemandDeliveryData) return;
    setEndDate && setEndDate(selectCustomerDemandDeliveryData.maxTime);
  }, [selectCustomerDemandDeliveryData, setEndDate]);

  //饼图数据
  const data = useMemo(() => {
    const temp = [];
    if (selectCustomerDemandDeliveryData) {
      try {
        if (selectCustomerDemandDeliveryData.customerDemandDeliveryList) {
          selectCustomerDemandDeliveryData.customerDemandDeliveryList
            .sort(function (a, b) {
              return b.factoryActualQty - a.factoryActualQty; //实际发货量按降序排序
            })
            .map((item) => {
              temp.push({
                category: '实际发货量',
                type: item.type,
                value: item.factoryActualQty,
                tooltipName: '实际发货量',
                tooltipValue: item.factoryActualQty,
                CompareName: '发货达成率',
                CompareValue: item.demandDeliveryPersent,
              });
            });
        }
      } catch (error) {
        //console.log(error)
      }
    }

    return temp;
  }, [selectCustomerDemandDeliveryData]);

  // 饼图中心内容
  const customHtmlData = useMemo(() => {
    const temp = [];
    if (selectCustomerDemandDeliveryData) {
      try {
        temp.push({
          title: {
            type: '实际交付量',
            value: tofixed(
              selectCustomerDemandDeliveryData.factoryActualQtySum,
              2,
            ),
          },
          content: [
            {
              type: '预计剩余发货量',
              value: tofixed(
                selectCustomerDemandDeliveryData.surplusForecastQtySum,
                2,
              ),
            },
            {
              type: '发货达成率',
              value: selectCustomerDemandDeliveryData.qtyPersent,
            },
          ],
        });
      } catch (error) {
        //console.log(error)
      }
    }
    return temp[0];
  }, [selectCustomerDemandDeliveryData]);

  const legendCardItem = useMemo(() => {
    let temp = [];
    const { customerDemandDeliveryList } =
      selectCustomerDemandDeliveryData || {};
    if (customerDemandDeliveryList) {
      temp = customerDemandDeliveryList.map((item) => {
        return {
          title: item.type,
          type1: '发货达成率',
          value1: item.demandDeliveryPersent || '-',
          type2: '实际发货',
          value2: item.factoryActualQty || '-',
          type3: '预测剩余',
          value3: item.surplusForecastQty || '-',
          titleIcon: require(`../../assets/icons/${
            item.type === '国内乘用车'
              ? 'car'
              : item.type === '国内储能'
              ? 'trend'
              : item.type === '国内商用车'
              ? 'businessCar'
              : item.type === '国际业务'
              ? 'business'
              : 'other'
          }.svg`),
          hiddent: item.type === '其他',
        };
      });
    }
    return temp;
  }, [selectCustomerDemandDeliveryData]);

  // 点击环形图右边图例和小卡片的联动
  function onCallBack(visible, value) {
    setActiveValue({
      ...activeValue,
      [value]: visible,
    });
  }

  if (error) {
    return <ErrorBlock description={error.message} />;
  }
  if (!selectCustomerDemandDeliveryData) {
    return <Loading style={{ height: '30vh', width: '90vw' }} />;
  }

  return (
    <div className={styles.Card}>
      <div className={styles1.unitFont}>(Gwh)</div>
      <div>
        <DeliveryPie
          data={data}
          customHtmlData={customHtmlData}
          onCallBack={onCallBack}
        />
      </div>
      {/* 分类关联的卡片 */}
      <div className={styles.cards}>
        {legendCardItem.map((item) => {
          return (
            <LabelCard
              onClick={() => {
                navigateToDetail({ applicationArea: item.title });
              }}
              titleIcon={item.titleIcon}
              hiddent={item.hiddent}
              key={item.title}
              title={item.title}
              bodyStyle={activeValue[item.title]}
              rows={[
                {
                  value: item.type1, // 这里label是value，value是label
                  label: item.value1,
                  valueColor: 'rgba(9, 17, 26, 0.6)',
                  labelColor: '#587AE3',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    lineHeight: '18px',
                  },
                },
                {
                  value: item.type2,
                  label: item.value2,
                  valueColor: 'rgba(9, 17, 26, 0.6)',
                  labelColor: '#587AE3',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    lineHeight: '18px',
                  },
                },
                {
                  value: item.type3,
                  label: item.value3,
                  valueColor: 'rgba(9, 17, 26, 0.6)',
                  labelColor: '#5FCABB',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    lineHeight: '18px',
                  },
                },
              ]}
            />
          );
        })}
        <div />
      </div>
      {!legendCardItem.length && (
        <ErrorBlock
          style={{ marginTop: '40px' }}
          description="无维度权限，请联系管理员维护权限！"
        />
      )}
    </div>
  );
}

export default CardMode;
