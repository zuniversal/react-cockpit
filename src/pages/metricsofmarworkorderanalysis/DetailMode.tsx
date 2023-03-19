import { WaterMark, Card, ErrorBlock } from 'antd-mobile';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMatch, useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { useQuery } from '../../hooks/useQuery';
import { toFixedNumber } from '../../utils';
import { Chart1 } from './Chart1';

export function DetailMode() {
  const [search] = useSearchParams();
  const baseName = search.get('baseName') ?? '';
  const [factoryName, setFactoryName] = useState(null);

  const {
    error: chart2Error,
    data: chart2Data,
    query: chart2Query,
  } = useQuery('/orderAnalysis/selectOrderAnalysisByBaseName');

  const {
    error: chart3Error,
    data: chart3Data,
    query: chart3Query,
  } = useQuery('/orderAnalysis/selectOrderAnalysisTrend');

  useEffect(() => {
    chart2Query({ baseName });
  }, [chart2Query, baseName]);

  useEffect(() => {
    if (chart2Data && !factoryName) {
      if (Array.isArray(chart2Data) && chart2Data.length > 0) {
        setFactoryName(chart2Data[0].factoryName);
      }
    }
  }, [factoryName, chart2Data]);

  useEffect(() => {
    if (factoryName) {
      chart3Query({ factoryName });
    }
  }, [chart3Query, factoryName]);

  const processedData = useMemo(() => {
    if (chart2Data) {
      return chart2Data.map((item) => {
        return {
          ...item,
          name: item.factoryName,
          工单总数: {
            value: item.orderNum,
            itemStyle: factoryName && {
              color: item.factoryName !== factoryName ? '#5C82F555' : undefined,
            },
          },
          工单逾期数: {
            value: item.orderYqNum,
            itemStyle: factoryName && {
              color: item.factoryName !== factoryName ? '#7BC7BB55' : undefined,
            },
          },
          工单逾期率: toFixedNumber(item.overdue * 100),
          同比: toFixedNumber(item.yearOnYear * 100),
          环比: toFixedNumber(item.chain * 100),
        };
      });
    }
    return [];
  }, [chart2Data, factoryName]);

  const processedData2 = useMemo(() => {
    if (chart3Data) {
      return chart3Data.map((item) => {
        return {
          ...item,
          name: item.eachMonth,
          工单总数: {
            value: item.orderNum,
          },
          工单逾期数: {
            value: item.orderYqNum,
          },
          工单逾期率: toFixedNumber(item.overdue * 100),
          同比: toFixedNumber(item.yearOnYear * 100),
          环比: toFixedNumber(item.chain * 100),
        };
      });
    }
    return [];
  }, [chart3Data]);

  if (chart2Error) {
    return <ErrorBlock description={chart2Error.message} />;
  }

  if (chart3Error) {
    return <ErrorBlock description={chart3Error.message} />;
  }

  return (
    <>
      <HeadTitle>{`工厂工单分析-${baseName}`}</HeadTitle>
      <Card headerStyle={{ borderBottom: 'none' }} title="工厂工单分析">
        <Chart1
          data={processedData}
          onClickItem={(dataItem) => {
            setFactoryName(dataItem.name);
          }}
        />
      </Card>
      <Card
        headerStyle={{ borderBottom: 'none', marginTop: '10px' }}
        title={
          !factoryName ? '近6个月工单趋势' : `近6个月工单趋势-${factoryName}`
        }
      >
        {/* <AnalysisDualAxes columnData={chart3Column} lineData={chart3Line} /> */}
        <Chart1 data={processedData2} />
      </Card>
    </>
  );
}

export default DetailMode;
