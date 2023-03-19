import { Picker, ErrorBlock } from 'antd-mobile';
import { useEffect, useMemo, useState } from 'react';

import { Loading } from '../../components/loading/Loading';
// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useQuery } from '../../hooks/useQuery';
import { FactoryPage } from './component/FactoryPage';
import { GroupPage } from './component/GroupPage';
import downArrowIcon from '@/assets/icons/down-arrow-1.svg';

export function CardMode() {
  // const { user, navigateToDetail, setEndDate, cache, setCache, setLoading } =
  //   useCurrentApp()
  const { user, navigateToDetail, setEndDate, cache, setCache, setLoading } =
    useModel('user');
  const { userInfo, dateType } = user;
  const { dimensionPermissionList, roleType } = userInfo;
  // const [roleType, setRoleType] = useState('2')
  const originList = dimensionPermissionList.find(
    (item) => item.dimensionName === '组织维',
  )?.child;
  const [visible, setVisible] = useState(false);
  const [flag, setFlag] = useState(false);
  // const [popoverValue, setPopoverValue] = useState('')
  // const [name, setName] = useState('')

  const popoverValue = cache.popoverValue ?? '';
  const setPopoverValue = (key) => setCache({ popoverValue: key });

  const name = cache.name ?? '';
  const setName = (key) => setCache({ name: key });

  const basicColumns = useMemo(() => {
    const temp = [[]];
    originList?.map((item, index) => {
      temp[0].push({
        label: item.dimensionName,
        value: item.dimensionValue,
      });
      if (index === 0 && !popoverValue && !name) {
        setPopoverValue(item.dimensionValue);
        setName(item.dimensionName);
      }
    });
    return temp;
  }, [originList]);

  const [segmentKey, setSegmentKey] = useState('电池');
  const [page1, setPage1] = useState(1);

  const {
    error: error1,
    data: allData,
    query: query1,
  } = useQuery('/lossCost/selectLossCostList');

  const {
    error: error2,
    data: allData2,
    query: query2,
  } = useQuery('/lossCost/selectTrccLastSixMonthList');

  useMemo(() => {
    if (allData) {
      setLoading();
    }
  }, [allData]);

  useEffect(() => {
    if (roleType === '0') {
      query1({ type: 0 });
      query2({ type: 0 });
    }
  }, [query1, query2, roleType]);

  useEffect(() => {
    if (roleType === '1') {
      query1({ type: 1, level1Val: popoverValue });
      query2({ type: 1, level1Val: popoverValue });
    }
  }, [popoverValue, query1, query2, roleType]);

  const {
    error: error3,
    data: data3,
    query: query3,
  } = useQuery('/lossCost/selectLossCostSecondDetailList');

  useEffect(() => {
    if (roleType !== '2') return;
    query3({
      level1Val: popoverValue,
      level2Val: segmentKey,
    });
  }, [query3, segmentKey, roleType, popoverValue]);

  useEffect(() => {
    if (!setEndDate) return;
    if (roleType === '2') {
      if (!data3) return;
      setEndDate(data3.maxTime);
    } else {
      if (!allData) return;
      setEndDate(allData.maxTime);
    }
  }, [setEndDate, allData, dateType, roleType, data3]);

  if (error1) {
    return <ErrorBlock description={error1.message} />;
  }

  if (error2) {
    return <ErrorBlock description={error2.message} />;
  }

  if (error3) {
    return <ErrorBlock description={error3.message} />;
  }

  /**
   * 根据roleType判断是什么角色
   * roleType 0 集团 1 基地 2 工厂 "" 没有权限
   */
  if (roleType === '0') {
    return (
      <>
        {allData ? (
          <GroupPage
            pageTitle="集团损耗成本"
            detailTitle="基地详情"
            allData={allData}
            allData2={allData2}
            key={Date.now()}
            nextPage={() => {
              navigateToDetail();
            }}
          />
        ) : (
          <Loading style={{ height: '25vh', width: '90vw' }} />
        )}
      </>
    );
  } else if (roleType === '1' || roleType === '2') {
    return (
      <>
        {(allData || data3 || flag) && (
          <div style={{ marginBottom: '12px' }}>
            选择基地
            <div
              style={{
                color: '#4774E7',
                display: 'flex',
                alignContent: 'center',
                float: 'right',
              }}
              onClick={() => {
                setVisible(true);
              }}
            >
              {name}
              <img style={{ marginLeft: '4.5px' }} src={downArrowIcon} />
            </div>
          </div>
        )}

        {roleType === '1' ? (
          <>
            {allData ? (
              <GroupPage
                pageTitle="基地损耗成本"
                detailTitle="工厂详情"
                allData={allData}
                allData2={allData2}
                key={Date.now()}
                nextPage={() => {
                  navigateToDetail({
                    view: 'detail',
                    base: popoverValue,
                  });
                }}
              />
            ) : (
              <Loading style={{ height: '25vh', width: '90vw' }} />
            )}
          </>
        ) : (
          <>
            <FactoryPage
              key={Date.now()}
              segmentKey={segmentKey}
              setSegmentKey={setSegmentKey}
              data2={data3}
              page1={page1}
              setPage1={setPage1}
              setFlag={setFlag}
            />
          </>
        )}

        <Picker
          columns={basicColumns}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          value={[popoverValue]}
          onConfirm={(v) => {
            setPopoverValue(v[0]);
            setPage1(1);
            const val = originList.find(
              (item) => item.dimensionValue == v[0],
            ).dimensionName;
            setName(val);
          }}
        />
      </>
    );
  } else if (roleType === '') {
    return (
      <ErrorBlock description="损耗成本无维度权限，请联系管理员维护权限！" />
    );
  }
}

export default CardMode;
