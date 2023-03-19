import { useWindowWidth } from '@react-hook/window-size';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { Chart1 } from './Components/Chart1';
import { MoreBtn } from './Components/MoreBtn';
import { Tabs } from './Components/Tabs';
import style from './Components/styles.module.less';
export const CardMode = () => {
  const [isFold, setIsFold] = useState(false);
  // const { setDataMode, user, setEndDate, setLoading } = useCurrentApp()
  const { setEndDate, user, setLoading, setDataMode } = useModel('user');
  const { dateType } = user;

  useEffect(() => {
    setDataMode && setDataMode('mock');
  }, [setDataMode]);

  useEffect(() => {
    setLoading();
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
    <div>
      <Tabs />
      <div
        style={{
          marginTop: '10px',
          justifyContent: 'flex-start',
        }}
      >
        <Chart1 />
        <MoreBtn
          click={(e) => {
            setIsFold(e);
          }}
        />
        {isFold && (
          <div
            style={{
              width: '100%',
              marginTop: '-10px',
              overflowY: 'auto',
              paddingBottom: '10px',
            }}
          >
            <table className={style.table}>
              <tbody>
                <tr>
                  <th>集团/基地</th>
                  <th>产能（KWH）</th>
                  <th>总人数</th>
                  <th>一线人数</th>
                  <th>总人力成本（万元）</th>
                  <th>产能/总人数</th>
                  <th>产能/一线人数</th>
                  <th>总人数/产能</th>
                  <th>一线人数/产能</th>
                  <th>总人力成本/产能</th>
                </tr>
                <tr>
                  <td>常州</td>
                  <td>767,641.03</td>
                  <td>2964</td>
                  <td>2587</td>
                  <td>5,695.39</td>
                  <td>258.98</td>
                  <td>296.77</td>
                  <td>0.0039</td>
                  <td>0.0034</td>
                  <td>74.19</td>
                </tr>
                <tr>
                  <td>厦门</td>
                  <td>98,681.71</td>
                  <td>1248</td>
                  <td>1167</td>
                  <td>1,746.96</td>
                  <td>79.09</td>
                  <td>85.48</td>
                  <td>0.0126</td>
                  <td>0.0118</td>
                  <td>177.03</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardMode;
