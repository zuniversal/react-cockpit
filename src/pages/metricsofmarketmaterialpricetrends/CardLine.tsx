import { Line } from '@ant-design/plots';

// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';

export const MarketLine = (props) => {
  // const { user } = useCurrentApp()
  const { user } = useModel('user');
  const height = 0.55 * document.body.clientWidth;
  // 接收数据
  const lineData = props.lineData;
  const colorArr = props.colorArry; // 颜色配置
  const CardName = props.CardName;

  const compare = (prop, align) => {
    return function (a, b) {
      const value1 = a[prop];
      const value2 = b[prop];
      if (align === 'positive') {
        // 正序
        return new Date(value1) - new Date(value2);
      } else if (align === 'inverted') {
        // 倒序
        return new Date(value2) - new Date(value1);
      }
    };
  };

  const tempData = JSON.parse(JSON.stringify(lineData));
  const flagDate = tempData.sort(compare('date', 'inverted'));

  const getDate = (type) => {
    if (type.date === flagDate[0].date) {
      return {
        r: 3.5,
      };
    } else {
      return {
        r: 0,
      };
    }
  };

  const config = {
    data: lineData,
    seriesField: 'category',
    xField: 'date',
    yField: 'value',
    smooth: true,
    height,
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
      grid: {
        line: {
          style: {
            lineDash: [3, 3],
          },
        },
      },
    },
    xAxis: {
      label: {
        // 只显示两位日期
        formatter: (v) => {
          if (user.dateType === 'a') {
            return v.slice(-5);
          } else {
            return v.slice(-2);
          }
        },
      },
      tickLine: {
        style: {
          lineDash: [3, 3],
        },
      },
    },
    color: [
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
    ],
    tooltip: {},
    legend: false,
    lineStyle: (item) => {
      if (CardName == '') {
        return {
          opacity: 1,
        };
      } else {
        if (item.category == CardName) {
          return {
            opacity: 1,
          };
        } else {
          return {
            opacity: 0.3,
          };
        }
      }
    },
    // legend: {
    //   position: 'bottom',
    //   flipPage: false,
    //   itemWidth: 150,
    //   marker: {
    //     spacing: 5,
    //   },
    // },
    autoFit: true,
    point: {
      shape: 'circle',
      style: (type) => getDate(type),
    },
  };
  // @ts-ignore
  return (
    <div style={{ position: 'relative', zIndex: 103 }}>
      <Line {...config} />
    </div>
  );
};
