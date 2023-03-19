import { useRequest } from 'ahooks';

export const useReq = (fn, params = {}) => useRequest(fn, {
  manual: true,
  ...params
});
