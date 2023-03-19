import { Loading } from '@/components/loading/Loading';
import { useEffect } from 'react';
import useAuthIntercept from '@/hooks/useAuthIntercept';
import {
  useLocation,
  Outlet,
  history,
  useModel,
  useAppData,
  useOutletContext,
} from 'umi';
import CommonLayout from './common';
import Login from '@/pages/Login';
// import './vconsole';
console.log(' process ： ', process, process.env);

const Layout = () => {
  const { user } = useModel('user');
  const { userInfo } = user;

  useAuthIntercept();

  console.log(' Layout ： ', useModel('user'), user, userInfo, useAppData());

  if (userInfo == null) {
    return <Login></Login>;
  }

  return userInfo ? <CommonLayout /> : <Loading></Loading>;
};

export default Layout;
