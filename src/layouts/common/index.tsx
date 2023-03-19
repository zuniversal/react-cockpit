import { ErrorBoundary } from 'react-error-boundary';
import { SafeArea, ErrorBlock, Button, WaterMark } from 'antd-mobile';
import { Suspense } from 'react';
import { Outlet, useModel, useLocation } from 'umi';
import { BottomTabbar } from '@/components/layouts/BottomTabbar';
import { Loading } from '@/components/loading/Loading';
import AppHelmet from '@/common/AppHelmet';
import { showTabbarConfig } from '@/constants';
import useBuryingPoint from '@/hooks/useBuryingPoint';
import Websocket from '@/hooks/webSocket';
import LayoutWrapper from './LayoutWrapper';
import styles from './styles.module.less';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className={styles.container}>
      <ErrorBlock status="default" description={error.message} />
      <Button onClick={resetErrorBoundary}>重试</Button>
    </div>
  );
}

const AppWaterMark = (props) => {
  const { userInfo } = useModel('user');
  const textProps = {
    content: userInfo.userInfo.waterMark,
    gapX: 100,
    gapY: 100,
    fontSize: 12,
    fontColor: 'rgba(220, 221, 225, .6)',
    rotate: 0,
  };
  return <WaterMark {...textProps} />;
};

const WithTabbarLayout = (
  <div className={styles.app}>
    <Outlet />
    <div>
      <div style={{ height: 49 }} />
      <SafeArea position="bottom" />
    </div>
    {
      <div className={styles.bottom}>
        <BottomTabbar />
      </div>
    }
  </div>
);

const NoTabbarLayout = <Outlet />;

const onReset = () => {
  window.location.reload();
};

const CommonLayout = () => {
  const { pathname } = useLocation();
  useBuryingPoint();

  const tabbarLayout = showTabbarConfig.some((path) => path === pathname)
    ? WithTabbarLayout
    : NoTabbarLayout;

  return <LayoutWrapper>{tabbarLayout}</LayoutWrapper>;
  // return (
  //   <ErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
  //     <Suspense fallback={<Loading />}>
  //       <AppHelmet></AppHelmet>
  //       {/* <Websocket>{tabbarLayout}</Websocket> */}
  //       {tabbarLayout}
  //       <AppWaterMark></AppWaterMark>
  //     </Suspense>
  //   </ErrorBoundary>
  // );
};

export default CommonLayout;
