import { ErrorBlock } from 'antd-mobile';
import moment from 'moment';
import { useEffect, useMemo } from 'react';

import beforeIcon from '../../assets/icons/beforeIcon.svg';
import empty from '../../assets/icons/no-data.svg';
import { Loading } from '../../components/loading/Loading';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { toFixedNumber, accMul } from '../../utils';
import { Empty } from '../empty/index';
import { Chart1 } from './Chart1';
import { DetailEcharts } from './DetailEcharts';
import { AnalysisGauge } from './Gauge';
import descendIcon from '@/assets/icons/descend.svg';

export function CardMode() {
  // const { navigateToDetail, setEndDate, user, setLoading } = useCurrentApp()
  const { navigateToDetail, setEndDate, user, setLoading } = useModel('user');

  const {
    error,
    data: orderAnalysis,
    query,
  } = useQuery<{
    deadline: string;
    orderAnalysisList: {
      baseName: string;
      chain: number;
      deadline: string;
      eachMonth: null;
      factoryName: null;
      orderNum: number;
      orderYqNum: number;
      overdue: number;
      overdueTotal: number;
      yearOnYear: number;
      yearOnYearTotal: number;
    }[];
  }>('/orderAnalysis/selectOrderAnalysis');

  useMemo(() => {
    if (orderAnalysis) {
      setLoading();
    }
  }, [orderAnalysis]);
  useEffect(() => {
    query();
  }, [query]);
  const { orderAnalysisList: data, deadline } = orderAnalysis || {
    orderAnalysisList: [],
  };

  useEffect(() => {
    if (!deadline) {
      return;
    }
    setEndDate && setEndDate(deadline);

    /**
     * 默认进去：
切换到日，显示“2023.01.06 13:23:10”（取业务最新时间）
切换到月，显示“截至2023.01.06 13:23:10”（取业务最新时间）
切换到年，显示“截至2023.01.06 13:23:10”（取业务最新时间）
历史：
选择历史日，显示“2023.01.05”
选择历史月，显示”2022.12“
选择历史年，显示“截至2022.12”
切换到日、月、年，之间都是独立的，互相不影响，比如，选择历史日，切换到月，会重新刷新，按照最新时间来
     */
    // const { dateType, chooseDate } = user
    // const chooseDate1 = moment(chooseDate)
    // const today = moment()

    // let deadline = ''
    // if (Array.isArray(data) && data.length > 0) {
    //   if (data[0].deadline) {
    //     deadline = data[0].deadline
    //     const deadlineMoment = moment(deadline)
    //     if (deadlineMoment.isValid()) {
    //       deadline = deadlineMoment.format('YYYY.MM.DD HH:mm:SS')
    //     }
    //   }
    // }

    // if (dateType === 'a') {
    //   if (chooseDate1.format('YYYY-MM-DD') === today.format(`YYYY-MM-DD`)) {
    //     deadline && setEndDate(deadline)
    //   } else {
    //     setEndDate(chooseDate1.format(`YYYY.MM.DD`))
    //   }
    // } else if (dateType === 'b') {
    //   if (chooseDate1.format('YYYY-MM') === today.format(`YYYY-MM`)) {
    //     deadline && setEndDate('截至' + deadline)
    //   } else {
    //     setEndDate(chooseDate1.format(`YYYY.MM`))
    //   }
    // } else if (dateType === 'c') {
    //   if (chooseDate1.format('YYYY') === today.format(`YYYY`)) {
    //     deadline && setEndDate('截至' + deadline)
    //   } else {
    //     setEndDate(chooseDate1.format(`截至YYYY.MM`))
    //   }
    // }
  }, [data, deadline, setEndDate, user]);

  const processedData = useMemo(() => {
    if (orderAnalysis && orderAnalysis.orderAnalysisList) {
      return orderAnalysis.orderAnalysisList.map((item) => {
        return {
          ...item,
          name: item.baseName,
          工单总数: item.orderNum,
          工单逾期数: item.orderYqNum,
          工单逾期率: toFixedNumber(item.overdue * 100),
          同比: toFixedNumber(item.yearOnYear * 100),
          环比: toFixedNumber(item.chain * 100),
        };
      });
    }
  }, [data]);

  if (error) {
    return <ErrorBlock description={error.message} />;
  }

  if (!orderAnalysis) {
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
    <>
      {/* <div style={{}}>
        <AnalysisGauge
          contentValue={data[0].overdueTotal}
          contentText="集团工单逾期率"
        />
      </div> */}
      <div
        style={{
          display: 'flex',
          background: '#F5F5F5',
          borderRadius: '6px',
          padding: '12px 0 16px 12px',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'PingFang SC',
              color: '#8C8FA0',
              lineHeight: '18px',
              fontSize: '13px',
            }}
          >
            集团工单逾期率
          </div>
          <div
            style={{
              fontFamily: 'PingFang HK',
              color: '#000000',
              lineHeight: '25px',
              fontSize: '18px',
              fontWeight: 600,
              marginTop: '9px',
            }}
          >
            {accMul(orderAnalysis.orderAnalysisList[0].overdueTotal, 100)}%
          </div>
        </div>
        <div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'PingFang SC',
              lineHeight: '18px',
              fontSize: '13px',
              alignItems: 'center',
              justifyContent: 'end',
              paddingRight: '15px',
            }}
          >
            <span
              style={{
                color: '#616161',
              }}
            >
              同比
            </span>
            <span
              style={{
                color: '#5FCABB',
                fontFamily: 'DIN',
                margin: '0 4px 0 8px',
              }}
            >
              {accMul(orderAnalysis.orderAnalysisList[0].yearOnYearTotal, 100)}%
            </span>
            <img src={descendIcon} />
          </div>
          <div>
            <DetailEcharts />
          </div>
        </div>
      </div>
      <div>
        <p style={{ color: '#999', display: 'flex', alignItems: 'center' }}>
          <img
            style={{ width: '16px', marginRight: '5px' }}
            src={beforeIcon}
            alt=""
          />
          <span>手指移入展示同比环比信息</span>
        </p>

        <Chart1
          data={processedData}
          onClickTooltip={(item) => {
            navigateToDetail({
              baseName: item[0].name,
            });
          }}
        />
      </div>
    </>
  );
}

export default CardMode;
