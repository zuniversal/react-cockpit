import { Pie, G2, measureTextWidth } from '@ant-design/plots';
import { Card, Empty, ErrorBlock } from 'antd-mobile';
import { useEffect, useMemo } from 'react';

import { LabelCard } from '../../components/card/LabelCard';
import { DemoPie } from '../../components/charts/Pie';
import { Loading } from '../../components/loading/Loading';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import styles from './CardMode.module.less';
import styles1 from './index.module.less';

// G2.registerTheme('common-theme', {
//   color10: ['#6E94F2', '#5FCABB', '#707E9D', '#5D6C8F', '#766BF5'],
// })

export function CardMode() {
  const { navigateToDetail, setLoading } = useCurrentApp();
  const {
    data: selectStorageAge,
    query: selectStorageAgeQuery,
    error: selectStorageAgeError,
  } = useQuery<{
    amountActualSum: number;
    quantityGwhSum: number;
    storageAgeList: {
      quantityGwh: number;
      amountActual: number;
      classification: string; // 成品
    }[];
    amountActual: number; //0
    classification: string; // '成品'
    quantityGwh: number; //42
  }>('/storageAge/selectStorageAge');
  useMemo(() => {
    if (selectStorageAge) {
      setLoading();
    }
  }, [selectStorageAge]);

  useEffect(() => {
    selectStorageAgeQuery();
  }, [selectStorageAgeQuery]);

  return (
    <div className={styles.Card}>
      <div className={styles1.unitFont}>(百万元)</div>
      {(() => {
        if (selectStorageAgeError) {
          return <ErrorBlock description={selectStorageAgeError.message} />;
        }
        if (!selectStorageAge) {
          return <Loading style={{ height: '30vh', width: '90vw' }} />;
        }

        if (!selectStorageAge.storageAgeList) {
          return (
            <Empty
              image={require('../../assets/icons/empty2.svg')}
              description="暂无数据"
            />
          );
        }

        return (
          <>
            <DemoPie
              data={selectStorageAge.storageAgeList
                .sort(function (a, b) {
                  return b.quantityGwh - a.quantityGwh; //按库存量降序排序
                })
                .map((item) => {
                  return {
                    type: item.classification,
                    value: item.quantityGwh,
                  };
                })}
              customHtmlData={{
                title: {
                  type: '总金额',
                  value: selectStorageAge.amountActualSum,
                },
                content: [
                  {
                    type: '库存量',
                    value: selectStorageAge.quantityGwhSum + 'Gwh',
                  },
                ],
              }}
            />
            {/* 分类关联的卡片 */}
            <div className={styles.cards}>
              {selectStorageAge.storageAgeList.map((item) => {
                return (
                  <LabelCard
                    onClick={() => {
                      navigateToDetail({ classification: item.classification });
                    }}
                    key={item.classification}
                    title={item.classification}
                    rows={[
                      [
                        {
                          label: '库存量',
                          valueColor: '#678EF2',
                          value: item.quantityGwh,
                        },
                        { label: '库存金额', value: item.amountActual },
                      ],
                    ]}
                  />
                );
              })}
              <div />
            </div>
          </>
        );
      })()}
    </div>
  );
}

export default CardMode;
