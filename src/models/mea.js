import { init } from '@/utils/createAction';
import * as services from '@/services/me';

const namespace = 'mea';
const { createAction, createDispatch } = init(namespace);

const model = {
  namespace,

  state: {
    currentData: null,  
    version: null,  
    list: [],  
  },

  reducers: {
    getList(state, { payload, res }) {
      console.log(' getList ： ', payload, res);
      return {
        ...state,
        dataList: res.data,
        count: res.total,
        isShowModal: false,
        searchInfo: payload,
      };
    },
    getCurrentData(state, { payload, }) {
      console.log(' getCurrentData ： ', payload);
      return {
        ...state,
      };
    },
    addLog(state, { payload, }) {
      console.log(' addLog ： ', payload);
      return {
        ...state,
      };
    },

    addItem(state, { payload, }) {
      return {
        ...state,
        dataList: [payload.bean, ...state.dataList],
        isShowModal: false,
        count: state.count + 1,
      };
    },
    editItem(state, { payload, }) {
      return {
        ...state,
        dataList: state.dataList.map(v => ({
          ...(v.id !== payload.payload.d_id ? payload : v),
        })),
        isShowModal: false,
      };
    },
    removeItem(state, { payload, }) {
      const removeList = payload.payload.filter(v => v.id);
      return {
        ...state,
        dataList: state.dataList.filter(v =>
          removeList.some(item => v.id === item),
        ),
      };
    },
  },

  effects: {
    // *getCurrentVersionAsync({ payload, }, { call, put }) {
    //   const res = yield call(services.getCurrentVersion, payload);
    //   // yield put({
    //   //   res,
    //   //   type: `getCurrentVersion`,
    //   //   payload,
    //   // });
    // },
    // *getCurrentDataAsync({ payload, }, { call, put }) {
    //   const res = yield call(services.getCurrentData, payload);
    //   // yield put({
    //   //   res,
    //   //   type: `getCurrentData`,
    //   //   payload,
    //   // });
    // },
    // *addLogAsync({ payload, }, { call, put }) {
    //   const res = yield call(services.addLog, payload);
    //   yield put({
    //     type: 'addLog',
    //   });
    // },
    // *getAllNoticeAsync({ payload, }, { call, put }) {
    //   const res = yield call(services.getAllNotice, payload);
    //   yield put({
    //     type: 'getAllNotice',
    //   });
    // },

    // *getListAsync({ payload, }, { call, put, select }) {
    //   const { searchInfo } = yield select(state => state[namespace]);
    //   const params = {
    //     ...searchInfo,
    //     ...payload,
    //   };
    //   const res = yield call(services.getPaperList, params);
    //   console.log(' getListAsync res ： ', res, payload, searchInfo, params); //
    //   yield put({
    //     res,
    //     type: `getList`,
    //     payload: params,
    //   });
    // },
    // *editItemAsync({ payload, }, { call, put }) {
    //   const res = yield call(services.editItem, payload);
    //   yield put({
    //     res,
    //     type: `editItem`,
    //     payload,
    //   });
    // },
    // *removeItemAsync({ payload, }, { call, put }) {
    //   const res = yield call(services.removePaper, payload);
    //   yield put({
    //     res,
    //     type: `removeItem`,
    //     payload,
    //   });
    // },
  },
};

export const actions = createAction(model);
export const mapStateToProps = state => state[namespace];
export const mapDispatchToProps = createDispatch(model);

export default model;
