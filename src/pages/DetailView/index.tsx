import { SafeArea, Toast } from 'antd-mobile';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { sendBuriedPoint } from '../../utils/index';
// import { useUser } from '../user';
// import { AppLoader } from './AppLoader';
// import { useApps } from './AppsContext';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import styles from './DetailView.module.less';
import { Outlet } from 'umi';

export function DetailView(props) {
  console.log(' DetailView ： ', useCurrentApp(), props);
  const params = useParams();
  // const user = useUser();
  const { user } = useCurrentApp();
  // const apps = useApps();
  const scrollRef = useRef();
  const toastHandler = useRef<ToastHandler>();
  const { followList, currentName } = user;
  const showMetricTip = useCallback((metricId: string, tip: string) => {
    const timer = setTimeout(() => {
      const tipKey = `datafrontcalb/tooltip/${metricId}`;
      if (localStorage.getItem(tipKey) !== 'off') {
        toastHandler.current = Toast.show({
          maskStyle: {
            // width: 440,
          },
          content: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                {tip}
              </div>
              <div style={{ width: 10 }}> </div>
              <div
                onClick={() => {
                  toastHandler.current.close();
                  localStorage.setItem(tipKey, 'off');
                }}
                style={{ fontSize: 8, whiteSpace: 'nowrap', color: '#aaa' }}
              >
                不再提示
              </div>
            </div>
          ),
          duration: 3000,
          position: 'top',
          maskClassName: styles.toaster,
        });
      }
    }, 1000);
    return () => {
      toastHandler.current?.close();
      clearTimeout(timer);
    };
  }, []);

  const metricId = params.metricId;
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const metricTips = [
      { metricId: 'metricsofyieldanalysis', tip: '点击各产线可显示对应工段' },
      {
        metricId: 'metricsofmarworkorderanalysis',
        tip: '点击各工厂可对应显示月份',
      },
      {
        metricId: 'metricsofmarfaultanalysis',
        tip: '点击各车间可对应显示排名',
      },
      {
        metricId: 'metricsoflaborcost',
        tip: '点击柱状图联动下图趋势分析',
      },
    ];

    for (const metricTip of metricTips) {
      if (metricId === metricTip.metricId) {
        return showMetricTip(metricTip.metricId, metricTip.tip);
      }
    }

    // 没匹配上的用通用提示
    return showMetricTip('clickcolumn', '点击柱状图可展示明细');
  }, [showMetricTip, metricId]);

  const indicator = useMemo(() => {
    return followList.find(
      (item) => item.frontComponent === `/metrics/${metricId}`,
    );
  }, [followList, metricId]);
  const navigate = useNavigate();
  interface Params {
    nextName?: string;
    level3?: string;
    eventTitle?: string;
    parentName?: string;
  }
  const navigateToDetail = useCallback(
    (params: Params, options = {}) => {
      console.log('navigateToDetail-DetailView', params, options);
      const {
        nextName = '',
        level3 = '',
        eventTitle = '',
        parentName = '',
      } = params;
      sendBuriedPoint({
        pageName: eventTitle,
        pageAddress: `/metrics/${metricId}/detail`,
        level1: `${currentName}-关注页-${parentName}`,
        level2: `${currentName}-关注页-${parentName}-${eventTitle}`,
        level3: level3
          ? `${currentName}-关注页-${parentName}-${eventTitle}-${level3}`
          : undefined,
        eventName: '页面跳转',
        pageAfterName: `${nextName}详情页`,
        pageAfterClick: `/metrics/${metricId}/detail`,
        eventType: 'page_jump',
        interfaceParam: '页面跳转',
      });
      const url = new URL(location.origin);
      url.pathname = `/metrics/${metricId}/detail`;
      for (const key in params) {
        url.searchParams.set(key, params[key]);
      }
      navigate(url.toString().slice(location.origin.length), {
        preventScrollReset: false,
        ...options,
      });
    },
    [navigate, metricId],
  );

  return (
    <div ref={scrollRef} className={styles.DetailView}>
      <div className={styles.Bg} />
      <div className={styles.BannerBg} />
      <Outlet />
      <SafeArea position="bottom" />
    </div>
  );
}

export default DetailView;
