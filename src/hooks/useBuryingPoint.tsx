import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'umi';
import useRouteMatch from './useRouteMatch';

// 页面埋点钩子
const useBuryingPoint = () => {
  // const { user, indicator } = params
  // const { chooseDate, dateType } = user
  // const requestStart = useRequest('/datapageaccesslog/dataPageAccessLog/addLog')
  // const requestEnd = useRequest(
  //   '/datapageaccesslog/dataPageAccessLog/updateEndTime'
  // )
  // const indicatorUpdateTime = indicator?.updateTime
  // const formattedChooseDate = useMemo(() => {
  //   let date = chooseDate
  //   if (indicatorUpdateTime) {
  //     const indicatorUpdateDate = new Date(indicatorUpdateTime)

  //     if (`${indicatorUpdateDate}` !== 'Invalid Date') {
  //       if (date.getTime() > indicatorUpdateDate.getTime()) {
  //         date = indicatorUpdateDate
  //       }
  //     }
  //   }
  //   const y = date.getFullYear()
  //   const m = date.getMonth() + 1
  //   const d = date.getDate()
  //   return `${y}-${m}-${d}`
  // }, [chooseDate, indicatorUpdateTime])

  // useEffect(() => {
  //   console.log('进入详情页页面')
  //   const response = requestStart({
  //     pageName: deliveryType ? deliveryType : '详情',
  //     requestParam: JSON.stringify({
  //       chooseDate: formattedChooseDate,
  //       dateType,
  //       orderBy,
  //       sort,
  //       applicationArea,
  //       chooseNameType,
  //       chooseName,
  //       deliveryType,
  //     }),
  //     accessDepth: 'level3',
  //     platform: 'ckpt',
  //     requestUrlReal: window.location.pathname,
  //     requestUrl: '/marginalAmount/selectMarginalAmountDetailsForm',
  //   })
  //   let id
  //   response.then((data) => {
  //     id = data
  //   })
  //   return () => {
  //     requestEnd({
  //       ID: id,
  //     })
  //     console.log('退出详情页页面')
  //   }
  // }, [])
  const { pathname } = useLocation();
  const { route } = useRouteMatch();
  useEffect(() => {
    console.log(' useBuryingPoint 页面加载 ： ', route);
    return () => {
      console.log(' useBuryingPoint 页面卸载 ： ');
    };
  }, [pathname]);
};

export default useBuryingPoint;
