import { Toast } from 'antd-mobile';
import { useMemo } from 'react';

// import { useCurrentApp } from '../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { FollowItem } from '../contexts/user/UserContext';
import { useRequest } from './useRequest';

export function useFollow() {
  // const { user } = useCurrentApp();
  const { user } = useModel('user');
  const { updateUserInfo } = user;
  const userId = user.userInfo.userInfo.id;
  const updateFollowList = user.updateFollowList;
  const followList = user.followList;
  const unfollow = useRequest('/sysUserFlowIndicator/deleteFlowIndicator');
  const follow = useRequest('/sysUserFlowIndicator/addFlowIndicator');
  const unAllFollow = useRequest('/sysUserFlowIndicator/deleteFlowIndicator');

  return useMemo(() => {
    return {
      follow: async (params: FollowItem) => {
        try {
          Toast.show({ duration: 0, content: '正在关注' });

          await follow(
            { userId, parentId: params.parentId, indicatorId: params.id },
            { method: 'GET' },
          );

          await updateUserInfo();

          Toast.clear();
        } catch (e) {
          console.log(e);
          Toast.show({ content: '关注失败' });
        }
      },
      unfollow: async (params: FollowItem) => {
        try {
          Toast.show({ duration: 0, content: '正在取消关注' });
          await unfollow(
            { userId, indicatorIds: params.id },
            { method: 'GET' },
          );

          Toast.clear();
          updateFollowList(followList.filter((item) => item.id !== params.id));
        } catch (e) {
          console.log(e);
          Toast.show({ content: '取消关注失败' });
        }
      },
      unAllFollow: async (params: FollowItem) => {
        try {
          Toast.show({ duration: 0, content: '正在取消关注' });
          await unAllFollow(
            { userId, indicatorIds: params.ids },
            { method: 'GET' },
          );
          Toast.clear();
          updateFollowList(
            followList.filter(
              (item) => !params.ids.split(',').some((id, i) => id === item.id),
            ),
          );
        } catch (e) {
          console.log(e);
          Toast.show({ content: '取消关注失败' });
        }
      },
    };
  }, [follow, unfollow, unAllFollow, userId, followList, updateFollowList]);
}
