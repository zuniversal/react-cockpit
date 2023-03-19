import { useMemo } from 'react';

import { DetailContent } from './DetailContent';
import { TabContent } from './TabContent';
import { TotalContent } from './TotalContent';
import decline from '@/assets/icons/decline.svg';
import rise from '@/assets/icons/rise.svg';

export function GroupPage(props) {
  const { detailTitle, nextPage, pageTitle, allData, allData2 } = props;
  const colorArr = ['#678EF2', '#5FCABB', '#766BF5', '#D97D43', '#766BF5'];
  const title = [
    { title: '生产段', unit: '' },
    { title: '总损耗金额', unit: '万元' },
    { title: '单位损耗金额', unit: '元/Kwh' },
    { title: '投入产出率', unit: '%' },
  ];

  const topData = useMemo(() => {
    let temp = {};
    if (allData) {
      temp = {
        sumDwLoss: allData.sumDwLoss,
        sumDwLossRate: allData.sumDwLossRate,
        sumDwLossRateColor: ['0%', '-', null, 0].includes(allData.sumDwLossRate)
          ? '#616161'
          : Number(allData.sumDwLossRate) > 0
          ? '#F1965C'
          : '#5FCABB',
        sumDwLossRateIcon: ['0%', '-', null, 0].includes(allData.sumDwLossRate)
          ? ''
          : Number(allData.sumDwLossRate) > 0
          ? rise
          : decline,
        sumLoss: allData.sumLoss,
        sumLossRate: allData.sumLossRate,
        sumLossRateColor: ['0%', '-', null, 0].includes(allData.sumLossRate)
          ? '#616161'
          : Number(allData.sumLossRate) > 0
          ? '#F1965C'
          : '#5FCABB',
        sumLossRateIcon: ['0%', '-', null, 0].includes(allData.sumLossRate)
          ? ''
          : Number(allData.sumLossRate) > 0
          ? rise
          : decline,
      };
    }
    return temp;
  }, [allData, decline, rise]);

  const data = useMemo(() => {
    const temp = [];
    if (allData) {
      allData.costLastSixMonthList.map((item) => {
        temp.push({
          name: item.closeMonth.slice(-2),
          总损耗成本: item.shje,
          单位损耗成本: item.dwshcb,
        });
      });
    }
    return temp;
  }, [allData]);

  const lineData = useMemo(() => {
    const temp = [];
    allData2?.costLastSixMonthList?.map((item) => {
      temp.push({
        category: item.workSection,
        date: item.closeMonth,
        value: item.trccl,
      });
    });
    return temp;
  }, [allData2]);

  const legendData = useMemo(() => {
    const temp = [];
    allData2?.costLastSixMonthList?.map((item) => {
      temp.push(item.workSection);
    });
    const data = [...new Set(temp)];
    return data;
  }, [allData2]);

  return (
    <>
      <TotalContent
        title={detailTitle}
        topData={topData}
        nextPage={nextPage}
        pageTitle={pageTitle}
      />
      <DetailContent title={title} list={allData?.shcbList || []} />
      <TabContent
        data={data}
        lineData={lineData}
        colorArr={colorArr}
        legendData={legendData}
      />
    </>
  );
}
