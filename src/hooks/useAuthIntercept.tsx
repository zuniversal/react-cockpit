import { useEffect } from 'react';
import { getUserInfo } from '@/services/user';
import { getToken } from '@/utils/tool';

// 检测用户是否登录、有权限
const useAuthIntercept = () => {
  console.log(' useAuthIntercept   ,   ： ');
  useEffect(() => {
    const tokenRes = getToken();
    if (tokenRes) {
      getUserInfo();
    }
    return () => {};
  }, []);
};

export default useAuthIntercept;
