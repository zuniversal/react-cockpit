import moment from 'moment';
import { useState, useEffect, useMemo } from 'react';

import empty from '../../assets/icons/no-data.svg';
import { SegmentedControls } from '../../components/tabs/SegmentedControls';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { sendBuriedPoint } from '../../utils/index';
import { Empty } from '../empty/index';
import { CardInfo } from './CardInfo';
import { MarketLine } from './CardLine';
import style from './CardMode.module.less';
import styles from './index.module.less';
export function CardMode() {
  // const { user, setLoading, setEndDate } = useCurrentApp()
  const { user, navigateToDetail, setLoading, setEndDate } = useModel('user');
  const [segmentKey, setSegmentedControlsActiveKey] = useState('1');
  const { materialPriceEndDate, token } = user;
  const [CardName, setCardName] = useState('');
  const endDate = new Date(materialPriceEndDate);
  //市场材料价格趋势
  const {
    error,
    data: selectMaterialPriceData,
    query,
  } = useQuery('/saleForecast/selectMaterialPrice');
  useMemo(() => {
    if (selectMaterialPriceData) {
      setLoading();
    }
  }, [selectMaterialPriceData]);
  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query({}, { method: 'GET' });
  }, [query]);

  useEffect(() => {
    if (!selectMaterialPriceData) return;
    setEndDate && setEndDate(selectMaterialPriceData.maxTime);
  }, [setEndDate, selectMaterialPriceData]);

  type data = {
    temp: any[];
    compare: any[];
  };
  const colorArr: string[] = [
    '#6E94F2',
    '#83DAAD',
    '#697798',
    '#EDBF45',
    '#6F63F4',
    '#8ED1F4',
    '#8E63B7',
    '#E8954F',
    '#3A8484',
    '#E290B3',
  ];

  // const y = endDate.getFullYear()
  // const m =
  //   endDate.getMonth() + 1 < 10
  //     ? `0${endDate.getMonth() + 1}`
  //     : endDate.getMonth() + 1
  // const d = endDate.getDate() < 10 ? `0${endDate.getDate()}` : endDate.getDate()
  // const chooseDate = `${y}-${m}-${d}`

  let y = '';
  let m = '';
  let d = '';
  if (materialPriceEndDate) {
    const dateArr = materialPriceEndDate.split('.') || [];
    y = dateArr[0];
    m = Number(dateArr[1]) > 9 ? dateArr[1] : `0${dateArr[1]}`;
    d = Number(dateArr[2]) > 9 ? dateArr[2] : `0${dateArr[2]}`;
  }
  const chooseDate = `${y}-${m}-${d}`;

  function fn1(tempArr) {
    for (let i = 0; i < tempArr.length; i++) {
      for (let j = i + 1; j < tempArr.length; j++) {
        if (tempArr[i].materialName == tempArr[j].materialName) {
          tempArr.splice(j, 1);
          j--;
        }
      }
    }
    return tempArr;
  }

  const hanldeData = (arr) => {
    const temp = [];
    // const category = new Set()
    const category = [];
    const compare = [];
    arr.map((item) => {
      temp.push({
        date: item.eachDate,
        value: item.materialPrice,
        category: item.materialName,
        chain: item.chain,
      });
      // category.add(item.materialName)
    });

    const newArr = fn1(JSON.parse(JSON.stringify(arr))) || [];
    newArr.map((item) => {
      category.push(item.materialName);
    });
    category.forEach((v) => {
      let json = {};
      temp.map((item) => {
        if (item.category === v) {
          json = {
            category: v,
            materialPrice: item.value,
            value: item.chain,
          };
        }
      });
      compare.push(json);
    });
    return { temp, compare };
  };

  // 折线图数据
  const lineData = useMemo(() => {
    let data: data = { temp: [], compare: [] };
    try {
      if (
        selectMaterialPriceData &&
        selectMaterialPriceData.materialPriceTotalList
      ) {
        if (segmentKey == '1') {
          try {
            selectMaterialPriceData.materialPriceTotalList.map((res, index) => {
              if (res.resultName === 'zheng') {
                data = hanldeData(res.materialPriceList);
              }
            });
          } catch (error) {
            console.log(error);
          }
        } else if (segmentKey == '2') {
          try {
            selectMaterialPriceData.materialPriceTotalList.map((res, index) => {
              if (res.resultName === 'dian') {
                data = hanldeData(res.materialPriceList);
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return data;
  }, [selectMaterialPriceData, segmentKey]);

  if (selectMaterialPriceData?.materialPriceTotalList?.length) {
    const [f = {}, s = {}] = selectMaterialPriceData.materialPriceTotalList;
    if (!f.materialPriceList.length || !s.materialPriceList.length) {
      return (
        <Empty src={empty} marginTop="90">
          暂无数据
        </Empty>
      );
    }
  }
  return (
    <>
      <SegmentedControls
        activeKey={segmentKey}
        onChange={(key) => {
          setSegmentedControlsActiveKey(key);
          setCardName('');
          // 事件埋点
          sendBuriedPoint(
            '关注',
            '/home',
            '维度切换',
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            `材料价格趋势 ${segmentKey === '1' ? '电解液/铜铝' : '正负极材料'}`,
          );
        }}
        tabs={[
          { key: '1', title: '正负极材料' },
          { key: '2', title: '电解液/铜铝' },
        ]}
        className={style.Card}
      />
      <div
        className={styles.unitFont}
        style={{ marginTop: '3vh', marginBottom: '2vh' }}
      >
        (元/kg)
      </div>
      <MarketLine
        lineData={lineData.temp}
        colorConfig={colorArr}
        date={chooseDate}
        CardName={CardName}
        setCardName={setCardName}
      />
      <CardInfo
        infoData={lineData.compare}
        colorConfig={colorArr}
        CardName={CardName}
        setCardName={setCardName}
      />
      {/* <div className={styles.tipsBox}>
        <img src={require('../../assets/icons/warring.svg')} alt="tips" />
        <p>环比数据仅展示当前最新日期</p>
      </div> */}
    </>
  );
}

export default CardMode;
