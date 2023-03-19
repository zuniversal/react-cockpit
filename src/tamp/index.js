import { getToken } from "@/utils/tool"

export const useCurrentApp = () => {
  return {
    user: {
      userInfo: {
        userInfo: {
          realname: 'realname', username: 'username', avatar: 'avatar', post: 'post',
        },
        indicatorPermissionList: [],
      },
      token: getToken(),
      currentOriginFollowList: [],
      kLineTypes: [],
      chooseDate: new Date(),
      dateType: 'b',
    },
  } 
}

export const useRequest = () => {
  return () => new Promise((resolve, reject) => {
    // console.log('  Promise ： ',  )
    
  })
}

export const useUser = () => {
  return {
    setToken: (token) => {
      localStorage.setItem('token', token)
    },
    getFailTimes: () => 1,
  }
}

export const useFollow = () => {
  return {
    unfollow: () => 1, 
    unAllFollow: () => 1,
  }
}