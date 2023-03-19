import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import { req } from '@/utils/request';

// export const getRepo = p => req.noTipsGet(`https://api.github.com/search/users?q=zuniversal`, p);
export const testVersion = p => req.noTipsGet(`/sys/annountCement/lastVersionUpdateBulletFrame`, p, {});
export const getRepo = p => req.noTipsGet(`https://api.github.com/search/users`, p, {});
export const postRepo = p => req.post(`https://api.github.com/search/users`, p, {});
export const optionRepo = p => {
  console.log(' optionRepo p ： ', p,  )// 
  return req.post(`https://api.github.com/search/users`, p, {
    // defaultParams: [{type: 'good',  }],  
    manual: true
  }) 
};

const test = async (params, rest) => {
  console.log(' 数据请求方法 Test ： ', params, rest )
  const res = await []
  console.log(' 数据请求方法 await的结果： ： ',  )
  
}
export const getTest2 = p => {
  const { data, error, loading } = useRequest(test);
  console.log(' 数据 data, error, loading ： ', data, error, loading,  )// 
  return { data, error, loading }
};

export const getTest = p => useRequest(test, {
  defaultParams: p
})

// export const getTest = p => {
//   console.log(' getTest 请求 p ： ', p,  )// 
//   return useRequest(test, {
//     // defaultParams: p
//     defaultParams: [111, 222]
//   }) 
// }
// export const getTest = p => () => useRequest(test, {
//   // defaultParams: p
// })

export const getTest4 = p => useCallback(() => useRequest(test, {
  defaultParams: p
}), [])