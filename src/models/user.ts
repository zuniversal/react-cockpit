import { useCallback, useEffect, useMemo, useState } from 'react';
import { useReq } from '@/hooks/useReq';
import { getUserInfo, getAppList } from '@/services/user';
import moment from 'moment';
import { pushLog } from '@/utils';
import { iconMap, defIcon } from '@/configs/icons';
import { useNavigate } from 'umi';

const apiEndpoint = process.env.API_ENDPOINT || window.location.origin + '/api';
const storeKey = 'datafrontcalb/error/wx-login-fail-times';

export const formatUserInfo = (userInfo) => {
  const userId = userInfo.userInfo.id;
  const { realname, username } = userInfo.userInfo;
  // 添加水印名称
  userInfo.userInfo.waterMark = `${realname} ${username.substring(
    username.length - 4,
    username.length,
  )}`;
};

export const formatMetric = (item) => {
  if (!item.frontComponent) {
    return item;
  }
  const { frontComponent, indicatorName: title, indicatorDesc: desc } = item;
  const metricId = frontComponent.slice('/metrics/'.length);
  const icon = iconMap[metricId] || defIcon;

  return {
    ...item,
    title,
    icon,
    metricId,
    appName: metricId,
    desc,
  };
};

export default () => {
  const [chooseDate, setChooseDate] = useState(new Date());
  /**
   * 默认月维度
   */
  const [dateType, setDateType] = useState<DateType>('b');
  const [currentMetricGroup, setCurrentMetricGroup] = useState<string>();
  const [materialPriceEndDate, setMaterialPriceEndDate] = useState<string>();
  const [userInit, setUserInit] = useState(false);
  const [userInfo, setUserInfo] = useState<null | any>(null);

  const kLineTypes = useMemo<any[]>(() => {
    return [
      { type: 'a', title: '日' },
      { type: 'b', title: '月' },
      { type: 'c', title: '年' },
    ];
  }, []);

  /**
   * @deprecated 已经改成从接口获取
   *
   * 关注的指标，会改成从接口获取
   *
   * 第一迭代交付指标：1交付、2生产、3销售额、4毛利额、5边际额、6库存、7原材料价格
   */
  const [following] = useState([]);

  const [appList, setAppList] = useState([]);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );
  const getUserInfoAsync = useCallback(async () => {
    try {
      const res = await getUserInfo();
      console.log(' getUserInfoAsync ： ', res);
      // if (res.status === 401) {
      //   setToken(null);
      //   return;
      // }
      const userInfo = res;
      const userId = userInfo.userInfo.id;

      // 对用户信息进行处理 添加水印名称等
      formatUserInfo(userInfo);
      /*
       * 获取所有指标列表
       */
      const res1 = await getAppList({ userId });
      if (res1.status === 401) {
        setToken(null);
        return;
      }
      const appList = res1.map(formatMetric);

      setUserInfo(userInfo);
      setAppList(appList);
      let current = appList.find((item) => item.title === '集团');
      if (!current) {
        current = appList[0];
      }
      setCurrentMetricGroup(current.id);
      setUserInit(true);
      window.localStorage.removeItem(storeKey);
    } catch (e) {
      let failTimes = Number(window.localStorage.getItem(storeKey));

      if (!failTimes) {
        window.localStorage.setItem(storeKey, '1');
      } else {
        failTimes = Number(failTimes) + 1;
        window.localStorage.setItem(storeKey, '' + failTimes);
      }

      /**
       * 服务器网络似乎有问题，偶尔会无法连接
       * 此处如果报错统一当作登录失败处理，重新走登录流程
       */
      pushLog('error', e.message);
      setToken(null);
      setUserInfo(null);
      setUserInit(true);
    }
  }, [token]);

  const updateToken = useCallback((token: string | null) => {
    if (!token) {
      localStorage.removeItem('token');
      setUserInfo(null);
      setUserInit(true);
      setToken(null);
    } else {
      const storedToken = localStorage.getItem('token');
      if (token !== storedToken) {
        setToken(token);
        localStorage.setItem('token', token);
        setUserInit(false);
      }
    }
  }, []);

  const followList = useMemo(() => {
    if (!userInfo || !appList) {
      return [];
    }
    return userInfo.flowIndicatorList.map(formatMetric);
  }, [userInfo, appList]);

  /**
   * 更新flowIndicatorList
   */
  const updateFollowList = useCallback((flowIndicatorList: any[]) => {
    setUserInfo((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, flowIndicatorList };
    });
  }, []);

  const getFailTimes = useCallback(() => {
    const failTimes = Number(window.localStorage.getItem(storeKey));
    if (!failTimes) {
      return 1;
    }
    return failTimes;
  }, []);

  const currentOriginFollowList = useMemo(() => {
    if (currentMetricGroup === '' || !currentMetricGroup || !appList) {
      return [];
    }

    const currentParent = appList.find(
      (item) => item.id === currentMetricGroup,
    );

    return followList.filter((item) => {
      return item.parentId === currentParent.id;
    });
  }, [appList, followList, currentMetricGroup]);
  const currentName = useMemo(() => {
    if (currentMetricGroup === '' || !currentMetricGroup || !appList) {
      return '';
    }
    const [currentParent] = appList.filter(
      (item) => item.id === currentMetricGroup,
    );
    return currentParent ? currentParent.title : '';
  }, [appList, followList, currentMetricGroup]);

  const isHistoryDate = useMemo(() => {
    if (dateType === 'a') {
      return (
        moment(new Date()).format('YYYY-MM-DD') !==
        moment(chooseDate).format('YYYY-MM-DD')
      );
    }
    if (dateType === 'b' || dateType === 'c') {
      return (
        moment(new Date()).format('YYYY-MM') !==
        moment(chooseDate).format('YYYY-MM')
      );
    }
  }, [dateType, chooseDate]);

  useEffect(() => {
    if (!userInit) {
      if (!token) {
        setUserInfo(null);
        setUserInit(true);
      } else {
        getUserInfoAsync();
      }
    }
  }, [userInit, getUserInfoAsync, token]);

  //  ------------ Hack 实现 context 传递的东西 ------------

  const [extraProps, setExtraProps] = useState({});

  const storeExtraProps = useCallback((nextState) => {
    setExtraProps((prevState) => ({
      ...prevState,
      ...nextState,
    }));
  }, []);

  const user = {
    apiEndpoint,
    kLineTypes,
    token,
    chooseDate,
    isHistoryDate,
    currentOriginFollowList,
    currentName,
    dateType,
    userInfo,
    appList,
    followList,
    userInit,
    currentMetricGroup,
    setToken: updateToken,
    setChooseDate,
    setDateType,
    updateFollowList,
    updateUserInfo: getUserInfoAsync,
    setCurrentMetricGroup,
    getFailTimes,
    materialPriceEndDate,
    setMaterialPriceEndDate,
    // 扩展对象，挂载额外属性方法
    ...extraProps,
    setExtraProps: storeExtraProps,
  };

  // ------------ 其它 context 传递的东西 ------------

  const [cache, setCache] = useState({});
  const updateCache = useCallback((next) => {
    setCache((prev) => ({
      ...prev,
      ...next,
    }));
  }, []);

  return {
    // 原数据接口
    user,
    // 新添加到 model 最外层的便捷访问数据内容
    getUserInfoAsync,
    userInfo,

    cache,
    setCache: updateCache,
    // navigateToDetail,
    setLoading: () => {},
    // 扩展对象，挂载额外属性方法
    ...extraProps,
    setExtraProps: storeExtraProps,
  };
};
