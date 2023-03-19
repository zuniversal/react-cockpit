import { useRequest } from 'ahooks';
import { useState, useCallback } from 'react';
import { getTest, getRepo, postRepo, optionRepo } from '@/services/test';

export default () => {
  const [counter, setCounter] = useState(0);
 
  const increment = useCallback(getRepo, []);
  // const decrement = useCallback(postRepo, []);
  const decrement = useCallback((params) => {
    console.log(' params ： ', params,  )// 
    return () => postRepo(params)
  }, []);
  const optionRepoAsync = optionRepo
  // const increment = useCallback((...params) => {
  //   console.log(' getTest model 文件 ： ', ...params,   )// 
  //   return getTest(...params)
  // }, []);
  // const increment = (parmas) => {
  //   useCallback(() => getTest(parmas), [])
  // };
  // const increment = (parmas) => useCallback(() => getTest(parmas), []);
  // const increment = (parmas) => getTest(parmas)
 
  // console.log(' 数据 user, loading ： ', user, loading,  )// 
 
  return {
    // user,
    // loading,
    increment,
    decrement,
    optionRepoAsync,
  };
};

// import { useRequest } from 'ahooks';
// import { useState, useCallback,  } from 'react';
// import { getRepo, getCurrentData } from '@/services/me';

// export default () => {
//   const [currentData, setCurrentData] = useState(0);
 
//   // const getRepoAsync = useCallback(async() => {
//   //   // const res = await getRepo()
//   //   // console.log(' getRepoAsync res ： ', res,  )// 
//   //   useRequest(getRepo);
//   // }, []);
//   // const getRepoAsync = () => useRequest(getRepo)
//   // const getRepoAsync = useRequest(getRepo)
//   const getRepoAsync = getRepo
//   const getCurrentDataAsync = useRequest(getCurrentData, {
//     defaultParams: [{type: 'good',  }],  
//     manual: true
//   })

//   const getCurrentDataAsync2 = useCallback(() => {
//     getCurrentData()
//   }, []);
 
//   return {
//     currentData,
//     setCurrentData,
//     getCurrentDataAsync,
//     getRepoAsync,
//   };
// };