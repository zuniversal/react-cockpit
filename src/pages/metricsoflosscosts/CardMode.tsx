import { Card, ErrorBlock } from 'antd-mobile';
import { useState, useEffect, useMemo } from 'react';

import { LabelCard } from '../../components/card/LabelCard';

import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { useRequest } from '../../hooks/useRequest';
import { tofixed } from '../../utils';
import { Item } from '../home/Sortable/Item';
import styles from './CardMode.module.less';
import { LosscostsPie } from './Pie';
import styles1 from './index.module.less';

export const CardMode = () => {
  const { navigateToDetail, setLoading } = useCurrentApp();
  //分类销售总额
  const {
    error,
    data: selectSaleClassifyData,
    query,
  } = useQuery('/saleForecast/selectSaleClassify');
  useMemo(() => {
    if (selectSaleClassifyData) {
      setLoading();
    }
  }, [selectSaleClassifyData]);
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query();
  }, [query]);
  // console.log(selectSaleClassifyData)

  //饼图数据
  const data = useMemo(() => {
    const temp = [];
    if (selectSaleClassifyData) {
      try {
        if (selectSaleClassifyData.saleClassifyList) {
          selectSaleClassifyData.saleClassifyList
            .sort(function (a, b) {
              return b.saleSum - a.saleSum; //销售额按降序排序
            })
            .map((item) => {
              temp.push({
                category: '销售额',
                type: item.applicationArea,
                value: item.saleSum,
                tooltipName: '销售量',
                tooltipValue: item.salesQuantitySum,
                CompareName: '环比',
                CompareValue: item.quantityChain,
              });
            });
        }
      } catch (error) {
        //console.log(error)
      }
    }
    return temp;
  }, [selectSaleClassifyData]);

  // 饼图中心内容
  const customHtmlData = useMemo(() => {
    const temp = [];
    if (selectSaleClassifyData) {
      try {
        temp.push({
          title: {
            type: '损耗金额',
            value: 8924.32,
          },
        });
      } catch (error) {
        //console.log(error)
      }
    }
    return temp[0];
  }, [selectSaleClassifyData]);

  // 图例卡片内容
  const legendCardItem = [
    {
      title: '江苏',
      type: '损耗金额',
      typeValue: 9120.21,
      CompareType: '单位损耗',
      CompareValue: '234(元/Kwh)',
    },
    {
      title: '厦门',
      type: '损耗金额',
      typeValue: 9120.21,
      CompareType: '单位损耗',
      CompareValue: '234(元/Kwh)',
    },
    {
      title: '武汉',
      type: '损耗金额',
      typeValue: 9120.21,
      CompareType: '单位损耗',
      CompareValue: '234(元/Kwh)',
    },
    {
      title: '江门',
      type: '损耗金额',
      typeValue: 9120.21,
      CompareType: '单位损耗',
      CompareValue: '234(元/Kwh)',
    },
  ];

  const isGraphLoading1 = !selectSaleClassifyData;

  // 点击环形图右边图例和小卡片的联动
  const [activeValue, setActiveValue] = useState({});
  function onCallBack(visible, value) {
    setActiveValue({
      ...activeValue,
      [value]: visible,
    });
  }

  if (error) {
    return <ErrorBlock description={error.message} />;
  }

  return (
    <div className={styles.Card}>
      <div className={styles1.unitFont}>(万元)</div>
      <div style={{ position: 'relative', zIndex: 103 }}>
        {!isGraphLoading1 && (
          <LosscostsPie
            data={data}
            customHtmlData={customHtmlData}
            onCallBack={onCallBack}
          />
        )}
        {isGraphLoading1 && (
          <Loading style={{ height: '25vh', width: '90vw' }} />
        )}
      </div>
      {/* 分类关联的卡片 */}
      <div className={styles.cards}>
        {legendCardItem.map((item) => {
          return (
            <LabelCard
              onClick={() => {
                navigateToDetail({ applicationArea: item.title });
              }}
              titleIcon={require('../../assets/icons/position.svg')}
              key={item.title}
              bodyStyle={activeValue[item.title]}
              title={item.title}
              rows={[
                [
                  {
                    label: item.type,
                    value: item.typeValue,
                  },
                  {
                    label: item.CompareType,
                    value: item.CompareValue,
                    valueColor: '#678EF2',
                  },
                ],
              ]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardMode;
