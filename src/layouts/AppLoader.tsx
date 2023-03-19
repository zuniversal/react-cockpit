import { Button, ErrorBlock } from 'antd-mobile';
import { lazy, Suspense, useCallback, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Home from '../../apps/home/index';
import { Loading } from '../../components/loading/Loading';
import { MicroAppProps } from '../../types/types';
// import { useUser } from '../user'
import NotFound from './NotFound';
import { dynamicImportModule } from './dynamicImport';
import styles from './styles.module.less';

const useUser = {};
declare const __DEV__: any;

const dynamicImportApps = (process.env.DYNAMIC_IMPORT_APPS || '')
  .split(',')
  .filter((item) => !!item);

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className={styles.container}>
      <ErrorBlock status="default" description={error.message} />
      <Button onClick={resetErrorBoundary}>重试</Button>
    </div>
  );
}

export function AppLoader(props: MicroAppProps) {
  const ctxUser = useUser();
  const ctxApps = useUser();
  const { appName, user = ctxUser, apps = ctxApps } = props;

  const dynamicImport = useCallback(async (appName: string) => {
    let moduleUrl = `http://localhost:8090/apps/${appName}/${appName}.js`;
    /**
     * 单应用模式下不使用module federation，不考虑白名单，全都dynamic import
     */
    if (process.env.APP_LOADER_MODE === 'singleton') {
      return await import(`../../apps/${appName}/index.tsx`);
    } else if (__DEV__) {
      if (!dynamicImportApps.includes(appName)) {
        return await import(`../../apps/${appName}/index.tsx`);
      }
    } else {
      const stats = await (
        await fetch(`${window.location.origin}/stats.json`, {
          cache: 'no-store',
        })
      ).json();
      const { entrypoints } = stats;
      for (const entrypoint of entrypoints) {
        if (entrypoint.name === appName) {
          moduleUrl = `${window.location.origin}/${entrypoint.dirname}/${entrypoint.filename}`;
          break;
        }
      }
    }
    return await dynamicImportModule({
      moduleName: appName,
      moduleUrl,
      exposeKey: `./App`,
    });
  }, []);

  const RemoteApp = useMemo(() => {
    if (!appName) {
      return NotFound;
    }
    return lazy(() => dynamicImport(appName));
  }, [dynamicImport, appName]);

  if (appName === 'home') {
    if (!localStorage.getItem('isRefresh')) {
      localStorage.setItem('isRefresh', true);
      window.location.reload(true);
    }
    return <Home {...props} apps={apps} user={user} />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <Suspense fallback={<Loading />}>
        <RemoteApp {...props} apps={apps} user={user} />
      </Suspense>
    </ErrorBoundary>
  );
}
