import { Picker } from 'antd-mobile';
import { useState, useEffect, useMemo, useCallback } from 'react';

// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { toFixedNumber } from '../../utils';
import { Chart1 } from './Components/Chart1';
import { Chart2 } from './Components/Chart2';
import { MoreBtn } from './Components/MoreBtn';
import { Tabs } from './Components/Tabs';
import {
  dataTransformCoefficientMap1,
  dataTransformCoefficientMap2,
  rawData1,
  rawData2,
} from './Components/data';

export const CardMode = () => {
  const [visible, setVisible] = useState(false);
  const [trendPickerVisible, setTrendPickerVisible] = useState(false);
  const [currentMetricGroup, setCurrentMetricGroup] = useState(['Kwh/h']);
  const [currentStageGroup, setCurrentTrendGroup] = useState(['XMA1']);
  const [isFold, setIsFold] = useState(false);
  // const { setDataMode } = useCurrentApp()
  // const { navigateToDetail, setEndDate, user, setLoading } = useCurrentApp();
  const { navigateToDetail, setEndDate, user, setLoading, setDataMode } =
    useModel('user');
  const { dateType } = user;
  const basicColumns = [
    [
      { label: 'Kwh/h', value: 'Kwh/h' },
      { label: 'Kwh/人', value: 'Kwh/人' },
      { label: '元/Kwh', value: '元/Kwh' },
      { label: '人/Gwh', value: '人/Gwh' },
    ],
  ];

  const trendColumns = [
    [
      { label: 'XMA1', value: 'XMA1' },
      { label: 'XMA2', value: 'XMA2' },
      { label: 'XMA3', value: 'XMA3' },
      { label: 'XMA4', value: 'XMA4' },
      { label: 'XMA5', value: 'XMA5' },
    ],
  ];

  useEffect(() => {
    setLoading();
    setDataMode && setDataMode('mock');
  }, [setDataMode]);

  const currentUnit = basicColumns[0].find(
    (item) => item.value === currentMetricGroup[0],
  ).label;

  const currentStage = trendColumns[0].find(
    (item) => item.value === currentStageGroup[0],
  ).label;

  const data1 = useMemo(() => {
    return rawData1.map((item) => {
      return {
        ...item,
        实际人效: toFixedNumber(
          item.实际人效 * dataTransformCoefficientMap1[currentUnit],
        ),
        目标人效: toFixedNumber(
          item.目标人效 * dataTransformCoefficientMap1[currentUnit],
        ),
      };
    });
  }, [currentUnit]);

  const data2 = useMemo(() => {
    return rawData2.map((item) => {
      return {
        ...item,
        实际人效: toFixedNumber(
          item.实际人效 * dataTransformCoefficientMap2[currentStage],
        ),
        目标人效: toFixedNumber(
          item.目标人效 * dataTransformCoefficientMap2[currentStage],
        ),
      };
    });
  }, [currentStage]);

  const data3 = useMemo(() => {
    return [
      {
        实际人效: toFixedNumber(30 * dataTransformCoefficientMap1[currentUnit]),
        目标人效: toFixedNumber(50 * dataTransformCoefficientMap1[currentUnit]),
      },
    ];
  }, [currentUnit]);

  const onClickChart1Tooltip = useCallback(
    (item) => {
      const [series1] = item;
      navigateToDetail({ factoryStage: series1.name, currentUnit });
    },
    [navigateToDetail, currentUnit],
  );

  useEffect(() => {
    if (setEndDate) {
      setTimeout(() => {
        if (dateType === 'b') {
          setEndDate('2022.12');
        } else if (dateType === 'c') {
          setEndDate('截至2022.12');
        }
      }, 0);
    }
  }, [setEndDate, dateType]);

  return (
    <>
      <div style={{ marginTop: '-10px', position: 'relative', zIndex: '10' }}>
        <div
          onClick={() => {
            setVisible(true);
          }}
          style={{
            display: 'inline-block',
            lineHeight: '24px',
            background: '#F4F6F9',
            color: '##383B46',
            padding: '5px 10px',
            borderRadius: '30px',
            marginBottom: '12px',
          }}
        >
          {currentUnit}
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              border: '1px solid #0D1C2E',
              borderWidth: '0 1px 1px 0',
              transform: 'rotate(45deg)',
              margin: '0 0 0 5px',
              position: 'relative',
              top: '-2px',
            }}
          />
        </div>
        <Picker
          columns={basicColumns}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          value={currentMetricGroup}
          onConfirm={(v) => {
            setVisible(false);
            setCurrentMetricGroup(v);
          }}
        />
        <Tabs currentUnit={currentUnit} data={data3} />
        <div
          style={{
            marginTop: '10px',
            justifyContent: 'flex-start',
          }}
        >
          <Chart1
            currentUnit={currentUnit}
            data={data1}
            /**
             * 选中x轴后再次点击可下钻
             */
            onClickDataIndex={(dataIndex) => {
              navigateToDetail({
                factoryStage: data1[dataIndex].name,
                currentUnit,
              })();
            }}
            onClickTooltip={onClickChart1Tooltip}
          />
          <MoreBtn
            click={(e) => {
              setIsFold(e);
            }}
          />
        </div>
        {isFold && (
          <div>
            <div style={{ fontSize: '14px', color: '#000' }}>
              近12月趋势
              <div style={{ float: 'right', color: '#4774E7' }}>
                <div
                  style={{ float: 'right', color: '#4774E7' }}
                  onClick={() => {
                    setTrendPickerVisible(true);
                  }}
                >
                  {currentStage}
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
            </div>
            <Chart2
              currentUnit={currentUnit}
              currentStage={currentStage}
              data={data2}
            />
          </div>
        )}
      </div>
      <Picker
        columns={trendColumns}
        visible={trendPickerVisible}
        onClose={() => {
          setTrendPickerVisible(false);
        }}
        value={currentStageGroup}
        onConfirm={(val) => {
          setTrendPickerVisible(false);
          setCurrentTrendGroup(val);
        }}
      />
    </>
  );
};

export default CardMode;
