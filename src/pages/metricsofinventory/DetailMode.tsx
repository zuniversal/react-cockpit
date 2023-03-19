import { Pie } from '@ant-design/plots';
import { useWindowWidth } from '@react-hook/window-size';
import { Button, Card, ErrorBlock, WaterMark } from 'antd-mobile';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { HeadTitle } from '../../components/helmet';
import { Loading } from '../../components/loading/Loading';
import { Pagination } from '../../components/pagination';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useQuery } from '../../hooks/useQuery';
import { removeNegativeData } from '../../utils';
import { InventoryDualAxes } from './DetailDualAxes';
import { DetailTable } from './DetailTable';
import styles1 from './index.module.less';

const pieColors = ['#4E7BE7', '#EB5D60', '#F0BA48', '#59C3B9'];

function CustomPie({ data }: any) {
  const windowWidth = useWindowWidth();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      {(() => {
        const total = data.reduce((left, right) => {
          return left + right.value;
        }, 0);

        return (
          <>
            <div style={{ width: '20vw', marginRight: 20 }}>
              <Pie
                {...{
                  autoFit: true,
                  appendPadding: 0,
                  width: windowWidth * 0.2,
                  height: windowWidth * 0.2,
                  data,
                  angleField: 'value',
                  colorField: 'type',
                  color: pieColors,
                  padding: [0, 0, 0, 0],
                  radius: 0.9,
                  innerRadius: 0.6,
                  tooltip: false,
                  label: false,
                  statistic: false,
                  legend: false,
                }}
              />
            </div>
            <div>
              {Array.from({ length: data.length }, (v, key) => {
                const item = data[key];
                const color = pieColors[key % pieColors.length];
                let percent = (100 * item.value) / total;
                if (isNaN(percent)) {
                  percent = 0;
                }
                const percentString = percent.toFixed(0);
                return (
                  <div
                    key={key}
                    style={{
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 7,
                          marginRight: 10,
                          height: 7,
                          borderRadius: 7,
                          backgroundColor: color,
                        }}
                      />
                      <div style={{ width: '27vw' }}>{item.type}</div>
                      <div
                        style={{
                          width: '10vw',
                          fontWeight: 500,
                          color: '#9D9D9D',
                        }}
                      >
                        {percentString}%
                      </div>
                    </div>

                    <div
                      style={{
                        width: '20vw',
                        fontWeight: 500,
                        fontSize: 13,
                        textAlign: 'right',
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}
    </div>
  );
}

export function DetailMode() {
  const windowWidth = useWindowWidth();
  const [pageNo, setPageNo] = useState(1);

  const [tab, setTab] = useState<'Gwh' | '万支'>('Gwh');
  const [search] = useSearchParams();
  const classification = search.get('classification') ?? '';
  const [chooseName, setChooseName] = useState('');

  const { user } = useCurrentApp();
  const { userInfo } = user;
  const { realname, username } = userInfo.userInfo;
  const textProps = {
    content: `${realname} ${username.substring(
      username.length - 4,
      username.length,
    )}`,
    gapX: 100,
    gapY: 100,
    fontSize: 12,
    fontColor: 'rgba(220, 221, 225, .6)',
    rotate: 0,
  };

  const [props, setProps] = useState<{ [key: string]: any }>(textProps);

  const {
    data: data1,
    error: error1,
    query: query1,
  } = useQuery<{
    pageEntityList: {
      countId: null;
      current: number; // 1
      maxLimit: null;
      optimizeCountSql: boolean; // true
      orders: [];
      pages: number; // 1
      records: {
        amountActual: number; // 0
        amountStandard: number; //7.85
        entity: string; // '厦门'
        quantity: number; //3067
        quantityGwh: number; // 15
      }[];
      size: number; //6
      total: number; // 3
    };
  }>('/storageAge/selectStorageAgeDetails');
  const {
    data: data2,
    error: error2,
    query: query2,
  } = useQuery<{
    list: any[];
    totalAmountActual: 0;
    totalAmountStandard: 22.35;
    totalQuantity: 10214;
    totalQuantityGwh: 4.16;
  }>('/storageAge/selectStorageAgeTypeDetails');

  useEffect(() => {
    query1({
      classification,
      pageNo,
      chooseName,
    });
  }, [query1, pageNo, chooseName, classification]);

  useEffect(() => {
    query2({
      chooseName,
      classification,
    });
  }, [classification, chooseName, query2]);

  const [
    quantityGwhSummary,
    quantitySummary,
    amountStandardSummary,
    amountActualSummary,
  ] = useMemo(() => {
    if (data2) {
      return [
        data2.totalQuantityGwh,
        data2.totalQuantity,
        data2.totalAmountStandard,
        data2.totalAmountActual,
      ];
    }
    return [0, 0, 0, 0];
  }, [data2]);

  const columnData = useMemo(() => {
    const temp = [];
    if (data1) {
      try {
        data1.pageEntityList.records.map((item) => {
          temp.push({
            company: item.entity,
            value: tab === 'Gwh' ? item.quantityGwh : item.quantity,
            name: '库存量',
          });
          temp.push({
            company: item.entity,
            value: item.amountActual,
            name: '库存金额',
          });
        });
      } catch (error) {}
    }
    return temp;
  }, [data1, tab]);

  if (error1) {
    return <ErrorBlock description={error1.message} />;
  }

  if (error2) {
    return <ErrorBlock description={error2.message} />;
  }

  const isTableLoading = false;
  return (
    <div className={style.detailBox}>
      <HeadTitle>
        {classification === '' ? '库存' : `库存-${classification}`}
      </HeadTitle>
      <div>
        <Card
          headerStyle={{ borderBottom: 0 }}
          extra={
            <div style={{}}>
              <Button
                style={{
                  '--background-color': '#F4F6F9',
                  '--border-radius': '20px',
                  fontSize: '11px',
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
                onClick={() => setTab(tab === 'Gwh' ? '万支' : 'Gwh')}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <img
                    style={{ width: 12, height: 12, marginRight: 4 }}
                    src={require('../../assets/icons/switch.svg')}
                  />
                  {tab}
                </div>
              </Button>
            </div>
          }
        >
          {/* <SegmentedControls
            onChange={(key) => setTab(key as any)}
            activeKey={tab}
            tabs={[
              { key: 'Gwh', title: 'Gwh' },
              { key: '万支', title: '万支' },
            ]}
          /> */}
          <div className={styles1.unitFont}>
            <span>({tab})</span>
            <span style={{ float: 'right' }}>(百万元)</span>
          </div>
          <div style={{ height: '80vw' }}>
            {!data1 ? (
              <Loading style={{ height: '80vw' }} />
            ) : (
              <>
                <div style={{ height: '70vw' }}>
                  <InventoryDualAxes
                    tab={tab}
                    columnData={columnData}
                    chooseName={chooseName}
                    setChooseName={setChooseName}
                    lineData={data1.pageEntityList.records.map((item) => {
                      return {
                        company: item.entity,
                        value1: item.amountActual,
                        name: '库存金额',
                      };
                    })}
                  />
                </div>

                <Pagination
                  total={data1.pageEntityList.pages}
                  current={pageNo}
                  onChange={setPageNo}
                />
              </>
            )}
          </div>
        </Card>
        <div style={{ height: 10 }} />
        <Card
          title={
            chooseName +
            (classification
              ? `库存(${classification})总量(${tab})`
              : `库存总量(${tab})`)
          }
        >
          <div style={{ fontSize: 22, fontWeight: 400 }}>
            {tab === 'Gwh' ? quantityGwhSummary : quantitySummary}
          </div>

          <div>
            <div
              style={{
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: '29vw' }} />
                <div
                  style={{
                    width: 7,
                    marginRight: 10,
                    height: 7,
                    borderRadius: 7,
                  }}
                />
                <div style={{ width: '24vw', color: '#9D9D9D' }}>类别</div>
                <div
                  style={{
                    fontWeight: 500,
                    color: '#9D9D9D',
                    width: '10vw',
                  }}
                >
                  占比
                </div>
              </div>

              <div
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  textAlign: 'right',
                  color: '#9D9D9D',
                }}
              >
                库存量
              </div>
            </div>
          </div>

          <div
            style={{
              height: '30vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!data2 ? (
              <Loading style={{ height: '30vw' }} />
            ) : (
              <CustomPie
                data={removeNegativeData({
                  data: data2.list
                    .map((item) => {
                      return {
                        value: tab === 'Gwh' ? item.quantityGwh : item.quantity,
                        type: item.inventoryType1,
                      };
                    })
                    .sort((a, b) => (a.value < b.value ? 1 : -1)),
                  angleField: 'value',
                  colorField: 'type',
                })}
              />
            )}
          </div>
        </Card>
        <div
          style={{
            height: 10,
          }}
        />
        <Card
          title={
            chooseName +
            (classification
              ? `库存(${classification})总金额(百万元)`
              : `库存总金额(百万元)`)
          }
        >
          <div style={{ fontSize: 22, fontWeight: 400 }}>
            {amountActualSummary}
          </div>

          <div>
            <div
              style={{
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: '29vw' }} />
                <div
                  style={{
                    width: 7,
                    marginRight: 10,
                    height: 7,
                    borderRadius: 7,
                  }}
                />
                <div style={{ width: '24vw', color: '#9D9D9D' }}>类别</div>
                <div
                  style={{
                    fontWeight: 500,
                    color: '#9D9D9D',
                    width: '10vw',
                  }}
                >
                  占比
                </div>
              </div>

              <div
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  textAlign: 'right',
                  color: '#9D9D9D',
                }}
              >
                库存量
              </div>
            </div>
          </div>

          <div
            style={{
              height: '30vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!data2 ? (
              <Loading
                style={{
                  height: '30vw',
                }}
              />
            ) : (
              <CustomPie
                data={removeNegativeData({
                  data: data2.list.map((item) => {
                    return {
                      value: item.amountActual,
                      type: item.inventoryType1,
                    };
                  }),
                  angleField: 'value',
                  colorField: 'type',
                }).sort((a, b) => (a.value < b.value ? 1 : -1))}
              />
            )}
          </div>
        </Card>
        <div
          style={{
            height: 10,
          }}
        />
        {!isTableLoading && (
          <DetailTable
            tab={tab}
            chooseName={chooseName}
            title={
              chooseName +
              (classification === ''
                ? '库存总计'
                : `库存(${classification})总计`)
            }
          />
        )}
      </div>
      <WaterMark {...props} />
    </div>
  );
}

export default DetailMode;
