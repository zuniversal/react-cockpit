import { Button, Divider, Picker } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import moment from 'moment';
import { useMemo, useState } from 'react';

import { DatePicker } from '@/components/datePicker';
// import { useCurrentApp } from '@/contexts/apps/CurrentAppContext'
import { useCurrentApp, useRequest } from '@/tamp';
import { sendBuriedPoint } from '@/utils/index';
import styles from './index.module.less';
import calendarIcon from '@/assets/icons/calendar.svg';
import { useModel } from 'umi';
/**
 * 顶栏的选择器，选择集团/销售额/年月日
 */
export function HeaderPicker() {
  const [visible1, setVisible1] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  // const { user } = useCurrentApp()
  const { user } = useModel('user');
  const {
    chooseDate,
    dateType,
    currentMetricGroup,
    userInfo,
    kLineTypes,
    setChooseDate,
    setDateType,
    setCurrentMetricGroup,
    token,
  } = user;

  const appList = userInfo.indicatorPermissionList;
  if (appList.length > 0 && appList.length === 1) {
    setCurrentMetricGroup(appList[0].id);
  }
  const basicColumns = useMemo(() => {
    if (!appList) {
      return [[]];
    }

    return [
      appList.map((item) => {
        return {
          label: item.indicatorName,
          value: item.id,
        };
      }),
    ];
  }, [appList]);
  const currentMetricGroupTitle = useMemo(() => {
    console.log('currentMetricGroup', currentMetricGroup);
    const current = appList.find((item) => item.id === currentMetricGroup);
    if (current) {
      return current.indicatorName;
    }
    return '';
  }, [appList, currentMetricGroup]);

  function getMonthFinalDay(year, month) {
    let day;
    if (year == null || year == undefined || year == '') {
      year = new Date().getFullYear();
    }
    if (month == null || month == undefined || month == '') {
      month = new Date().getMonth() + 1;
    }
    day = new Date(new Date(year, month).setDate(0)).getDate();
    return year + '-' + month + '-' + day;
  }

  const filterDate = (val) => {
    let paramasDate;
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMoth = currentDate.getMonth() + 1;
    const currentDates = currentDate.getDate();

    const year = val.getFullYear();
    const moth = val.getMonth() + 1;
    const day = val.getDate();
    if (`${currentYear} - ${currentMoth}` === `${year} - ${moth}`) {
      paramasDate = currentDate;
    } else {
      paramasDate = new Date(getMonthFinalDay(year, moth));
    }
    if (dateType === 'a') {
      paramasDate = new Date(year + '-' + moth + '-' + day);
    }
    if (dateType === 'c') {
      // 年维度的时候，
      // 如果选择当月，传当日
      // 如果用户选了历史某月，传那个月的最后一天
      if (year === currentYear && moth === currentMoth) {
        paramasDate = new Date(year + '-' + currentMoth + '-' + currentDates);
      } else {
        const yearMoment = moment(val);
        paramasDate = new Date(yearMoment.endOf('month').format('YYYY-MM-DD'));
      }
    }
    setChooseDate(paramasDate);
  };
  const chooseDateMemo = useMemo(() => {
    return chooseDate;
  }, [chooseDate]);
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.header__left}>
          <Button
            style={{
              '--border-color': 'transparent',
              '--text-color': 'rgba(9, 17, 26, 0.6)',
              '--background-color': 'transparent',
            }}
            onClick={() => {
              setVisible1(true);
            }}
          >
            {currentMetricGroupTitle}
            <DownOutline fontSize={12} color="rgba(9, 17, 26, 0.6)" />
          </Button>
        </div>
        <div className={styles.header__right}>
          <div className={styles.header__right__buttonGroup}>
            {kLineTypes.map((item) => {
              return (
                <Button
                  key={item.type}
                  onClick={() => {
                    setDateType(item.type);
                    setChooseDate(new Date());
                    let date = '';
                    if (item.title === '日') {
                      date = moment(chooseDate).format('YYYY-MM-DD');
                    } else if (item.title === '月') {
                      date = moment(chooseDate).format('YYYY-MM');
                    } else {
                      date = moment(chooseDate).format('YYYY');
                    }
                    // 事件埋点
                    sendBuriedPoint(
                      '关注',
                      '/home',
                      item.title,
                      moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                      date,
                    );
                  }}
                  className={dateType === item.type ? styles.active : null}
                >
                  {item.title}
                </Button>
              );
            })}
          </div>
          <Divider style={{ width: 4 }} />
          <Button
            style={{
              '--border-color': 'rgba(222, 222, 222, 1)',
              '--background-color': 'transparent',
              height: 36,
              width: 36,
              padding: 0,
            }}
            onClick={() => {
              setDatePickerVisible(true);
            }}
          >
            <img src={calendarIcon} alt="calendar" />
          </Button>
        </div>
      </div>

      <Picker
        columns={basicColumns}
        visible={visible1}
        onClose={() => {
          setVisible1(false);
        }}
        value={[currentMetricGroup]}
        onConfirm={(v) => {
          setCurrentMetricGroup(v[0]);
          setChooseDate(new Date());

          sendBuriedPoint(
            '关注',
            '/home',
            '业务域切换',
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            basicColumns[0].find((item) => item.value === v[0]).label,
          );
        }}
      />
      <DatePicker
        visible={datePickerVisible}
        value={chooseDateMemo}
        dateType={dateType}
        onClose={(val) => {
          setDatePickerVisible(val);
        }}
        onChange={(val) => {
          let date = '';
          if (dateType === 'a') {
            date = moment(val).format('YYYY-MM-DD');
          } else if (dateType === 'b') {
            date = moment(val).format('YYYY-MM');
          } else {
            date = moment(val).format('YYYY');
          }
          filterDate(val);
          // 事件埋点
          sendBuriedPoint(
            '关注',
            '/home',
            `${
              (dateType === 'a' && '日') ||
              (dateType === 'b' && '月') ||
              (dateType === 'c' && '年')
            }`,
            moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            date,
          );
        }}
      />
    </div>
  );
}
