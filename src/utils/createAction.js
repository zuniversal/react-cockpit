// import { createAction,  } from 'redux-actions'//
// export const action = (prefix, ) => {
//   return (type) => createAction(prefix + '/' + type)
// }

// export const action = (prefix, ) => (types) => {
//   const type = prefix + '/' + types
//   console.log(' actiontype ： ', type,  )//
//   return (payload) => ({
//     type,
//     payload,
//   })
// }

// export const action = (prefix, ) => (types) => (payload) => ({
//   type: prefix + '/' + types,
//   payload: {
//     ...payload,
//     addInfo: 'zyb',
//   },
// })

// export const action = (payload) => ({
//   type,
//   payload,
// })

// export const action = (types) => (payload) => ({
//   type: types.split('Async')[0],
//   payload,
// })

// export const init = prefix => ({
//   createCRUD,
//   createAction: types => payload => ({
//     type: prefix + '/' + types,
//     payload,
//     action: action(types.split(suffix)[0]),
//   })
// })

import { history } from 'umi';

const suffix = 'Async';

export const action = type => payload => ({
  type,
  payload,
});

export const crudConfigs = [
  'getListAsync',
  'getItemAsync',
  'addItemAsync',
  'editItemAsync',
  'removeItemAsync',
  'removeItemsAsync',
];

export const commonConfigs = ['setSearchInfo', 'showFormModal', 'onCancel'];

// export const createCRUD = (config = []) => {
//   const actions = {}
//   return [...crudConfigs, ...config, ]
//   .forEach((type) => {
//     actions.[type] = payload => ({
//       type: prefix + '/' + types,
//       payload,
//       action: action(types.split(suffix)[0]),
//     })
//   })
// }

// 根据相应 models 命名 初始化 相应的带该model前缀的 action 方法
// 1. 函数显示调用 简化 action 调用方法的编写   副作用的  effects 里 可直接调用传入的 修改相应的同名 reducer 的方法
// 2. 可选择性使用 自动创建项目通用的 增删改查 相关 aciton

// export const init = prefix => {
//   return {
//     names: 'zyb',
//     createAction: (types = '',  ) => payload => ({
//       type: prefix + '/' + types,
//       payload,
//       action: action(types.split(suffix)[0]),
//     }),
//     createCRUD: (config = []) => {
//       console.log(' createCRUD this ： ', this,  )//
//       const actions = {}
//       const typeArr = [...crudConfigs, ...config, ]
//       typeArr.forEach(types => {
//           console.log(' createCRUD this22 ： ', this,  )//
//           actions[types] = payload => ({
//             type: prefix + '/' + types,
//             payload,
//             action: action(types.split(suffix)[0]),
//           })
//         });
//       return actions
//     },
//   }
// }
// console.log(' history ： ', history,  )//
export const isLoading = props => {
  const {
    config = [],
    extraLoading = [],
    path = '',
    actions = {},
    defConfig = [],
  } = props;
  // console.log(' get 取属 isShowLoading config, path, actions,  ： ', config, path, actions,  )//
  const configs =
    config.length > 0 ? config : [...crudConfigs, ...extraLoading];
  // console.log(' isLoading  configs ：', configs, path,  )//
  return configs.some(asyncSuffix => {
    // console.log(' action === `${path}/${asyncSuffix}` ： ', config, actions, `${path}/${asyncSuffix}`,  actions[`${path}/${asyncSuffix}`], )//
    return actions[`${path}/${asyncSuffix}`];
    // return actions.some(action => {
    //   console.log(' action === `${path}/${asyncSuffix}` ： ', config, actions, action, `${path}/${asyncSuffix}`,  )//
    //   return action === `${path}/${asyncSuffix}`
    // })
  });
};

export const init = (prefix, noDefault) => {
  const isCrudArr = noDefault ? [] : crudConfigs;
  const turnAction = (types = '') => payload => ({
    type: prefix + '/' + types,
    payload,
    action: action(types),
  });
  const createAction = (types = '') => payload => ({
    type: prefix + '/' + types,
    payload,
    action: action(types.split(suffix)[0]),
    // action: action(['addItemAsync', 'editItemAsync', 'removeItemAsync', 'removeItemsAsync', ].includes(types) ? 'getListAsync' : types.split(suffix)[0]),
  });
  const transferActions = (config = []) => {
    const actions = {};
    config.forEach(types => (actions[types] = createAction(types)));
    console.log(' actionsactions ： ', actions);
    return actions;
  };
  const createCRUD = (config = []) => {
    const actions = {};
    config.forEach(types => (actions[types] = createAction(types)));
    return actions;
  };
  const batchTurn = (config = []) => {
    const actions = {};
    config.forEach(types => (actions[types] = turnAction(types)));
    return actions;
  };
  // const customActions = (actionMap = {}, ) => {
  //   console.log(' actionMap ： ', actionMap,  )//
  //   const actions = {};
  //   Object.keys(actionMap).forEach(types => (actions[types] = action(actionMap[types])));
  //   return actions
  // };

  const createDispatch = model => dispatch => {
    const actions = Object.keys(model.reducers);
    const asyncActions = Object.keys(model.effects);
    const dispatchActions = {};
    [...actions, ...asyncActions].forEach(
      types =>
        (dispatchActions[types] = data =>
          dispatch({ type: `${prefix}/${types}`, payload: data })),
    );
    console.log(' dispatchActions ： ', actions, asyncActions, dispatchActions); //
    return dispatchActions;
  };

  return {
    names: 'zyb',
    // customActions,
    // createAction,
    transferActions: (config = []) => transferActions(config),
    createCRUD: (config = []) => createCRUD([...isCrudArr, ...config]),
    turnAction,
    batchTurn: (config = []) => batchTurn([...commonConfigs, ...config]),
    createActions: (asyncConfig = [], config = []) => ({
      ...createCRUD([...isCrudArr, ...asyncConfig]),
      ...batchTurn([...commonConfigs, ...config, 'reset']),
    }),
    createAction: model => {
      const actions = Object.keys(model.reducers);
      const asyncActions = Object.keys(model.effects);
      return {
        ...batchTurn(actions),
        ...createCRUD(asyncActions),
      };
    },
    createDispatch,
  };
};
