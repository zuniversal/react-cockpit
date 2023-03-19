import { useLocation } from 'umi';
import routes from '@/routes';

export const DEF_TITLE = '经营驾驶舱'; //

const useRouteMatch = () => {
  const { pathname } = useLocation();
  console.log(' useRouteMatch ： ', pathname);
  return routes.find((v) => v.path === pathname) ?? DEF_TITLE;
};

export default useRouteMatch;
