import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBlock, Button, WaterMark } from 'antd-mobile';
import { Suspense } from 'react';
import { Outlet, useModel, useLocation } from 'umi';
import { Loading } from '@/components/loading/Loading';
import AppHelmet from '@/common/AppHelmet';
import useBuryingPoint from '@/hooks/useBuryingPoint';
import Websocket from '@/hooks/webSocket';
import styles from './styles.module.less';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.log(
    ' 报错啊 error, resetErrorBoundary  ： ',
    error,
    resetErrorBoundary,
  );
  return (
    <div className={styles.container}>
      <ErrorBlock status="default" description={error.message} />
      <Button onClick={resetErrorBoundary}>重试</Button>
    </div>
  );
};

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

const onReset = () => {
  window.location.reload();
};

const LayoutWrapper = (props) => {
  const { pathname } = useLocation();
  useBuryingPoint();
  console.log(' LayoutWrapper ： ', props);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
      <Suspense fallback={<Loading />}>
        <Websocket>
          <AppHelmet></AppHelmet>
          {props.children}
        </Websocket>
        {/* <AppWaterMark></AppWaterMark> */}
      </Suspense>
    </ErrorBoundary>
  );
};

export default LayoutWrapper;
