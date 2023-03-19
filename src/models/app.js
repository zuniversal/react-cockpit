import { useReq } from '@/hooks/useReq';
import { getUserInfo } from '@/services/app';
import { getToken } from '@/utils/tool';

export default () => {
  const { data: userInfo = {}, run: getUserInfoAsync } = useReq(getUserInfo, {
    // manual: false,
  });
  console.log(' userInfo ： ', userInfo); //

  return {
    userInfo: {
      ...userInfo,
      userInfo,
      token: getToken(),
    },
    getUserInfoAsync,
  };
};
