import { Card, Picker } from 'antd-mobile';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { Pagination } from '../../components/pagination';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { toFixedNumber } from '../../utils';
import { Chart1 } from './Components/Chart1';
import { Chart2 } from './Components/Chart2';
import { MoreBtn } from './Components/MoreBtn';
import {
  dataTransformCoefficientMap2,
  rawData2,
  rawData3,
  rawData4,
  rawData5,
} from './Components/data';

export function DetailMode() {
  const { navigateToDetail } = useCurrentApp();
  const [search] = useSearchParams();
  const factoryStage = search.get('factoryStage') ?? '';
  const currentUnit = search.get('currentUnit') ?? '';
  const workshop = search.get('workshop') ?? '';
  const detailPage =
    search.get('detailPage') === 'workshop' ? 'workshop' : 'default';
  const [isFold, setIsFold] = useState(false);
  const [isFold2, setIsFold2] = useState(false);
  const [page, setPage] = useState(1);
  const [topWorkshopPickerVisible, setTopWorkshopPickerVisible] =
    useState(false);
  const [currentTopWorkshop, setCurrentTopWorkshop] = useState(['前20']);
  const topWorkshopColumns = [
    [
      { label: '前20', value: '前20' },
      { label: '后20', value: '后20' },
    ],
  ];

  const pageSize = 5;

  const currentTopWorkshopLabel = topWorkshopColumns[0].find(
    (item) => item.value === currentTopWorkshop[0],
  ).label;

  const total = parseInt(currentTopWorkshopLabel.slice(1), 10) / 5;

  const headTitle = useMemo(() => {
    if (detailPage === 'default') {
      return `人效分析-${factoryStage}`;
    }
    return workshop;
  }, [factoryStage, workshop, detailPage]);

  const onClickChart1Tooltip = useCallback(
    (item) => {
      const [series1] = item;
      navigateToDetail({
        factoryStage,
        currentUnit,
        workshop: series1.name,
        detailPage: 'workshop',
      });
    },
    [factoryStage, currentUnit, navigateToDetail],
  );

  const data3 = useMemo(() => {
    if (pageSize > 0) {
      const start = (page - 1) * pageSize;
      const data = rawData5.slice(start, start + pageSize);
      return data.map((item) => {
        return {
          ...item,
          实际人效: Math.max(
            toFixedNumber(item.实际人效 * Math.random()) - 1 / page,
            10,
          ),
          目标人效: Math.max(
            toFixedNumber(item.目标人效 * Math.random()) - 1 / page,
            10,
          ),
        };
      });
    }
    return rawData5.map((item) => {
      return {
        ...item,
        实际人效: Math.max(
          toFixedNumber(item.实际人效 * Math.random()) - 1 / page,
          10,
        ),
        目标人效: Math.max(
          toFixedNumber(item.目标人效 * Math.random()) - 1 / page,
          10,
        ),
      };
    });
  }, [page, currentTopWorkshopLabel, pageSize]);

  if (detailPage === 'workshop') {
    return (
      <div key="workshop">
        <HeadTitle>{headTitle}</HeadTitle>
        <Card
          headerStyle={{ borderBottom: 'none' }}
          title="班组人效"
          extra={
            <>
              <div style={{ float: 'right', color: '#4774E7' }}>
                <div
                  style={{ float: 'right', color: '#4774E7' }}
                  onClick={() => {
                    setTopWorkshopPickerVisible(true);
                  }}
                >
                  {currentTopWorkshopLabel}
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

              <Picker
                columns={topWorkshopColumns}
                visible={topWorkshopPickerVisible}
                onClose={() => {
                  setTopWorkshopPickerVisible(false);
                }}
                value={currentTopWorkshop}
                onConfirm={(val) => {
                  setTopWorkshopPickerVisible(false);
                  setCurrentTopWorkshop(val);
                  setPage(1);
                }}
              />
            </>
          }
        >
          <div style={{ marginTop: '-26px' }}>
            <Chart1 data={data3} currentUnit={currentUnit} />
          </div>

          <div style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Pagination current={page} onChange={setPage} total={total} />
          </div>

          <div>
            <div style={{ fontSize: '14px', color: '#000' }}>近12月趋势</div>
            <Chart2 data={rawData2} currentUnit={currentUnit} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div key="default">
      <HeadTitle>{headTitle}</HeadTitle>
      <Card headerStyle={{ borderBottom: 'none' }} title="车间人效">
        <div style={{ marginTop: '-26px' }}>
          <Chart1
            data={rawData3}
            currentUnit={currentUnit}
            onClickTooltip={onClickChart1Tooltip}
          />
        </div>
        <MoreBtn
          click={(e) => {
            console.log(e, 123);
            setIsFold(e);
          }}
        />
        {isFold && (
          <div>
            <div style={{ fontSize: '14px', color: '#000' }}>近12月趋势</div>
            <Chart2 data={rawData2} currentUnit={currentUnit} />
          </div>
        )}
      </Card>
      <Card
        headerStyle={{ borderBottom: 'none', marginTop: '10px' }}
        title="产品人效"
      >
        <div style={{ marginTop: '-26px' }}>
          <Chart1 data={rawData4} currentUnit={currentUnit} />
        </div>
        <MoreBtn
          click={(e) => {
            setIsFold2(e);
          }}
        />
        {isFold2 && (
          <div>
            <div style={{ fontSize: '14px', color: '#000' }}>近12月趋势</div>
            <Chart2 data={rawData2} currentUnit={currentUnit} />
          </div>
        )}
      </Card>
    </div>
  );
}

export default DetailMode;
