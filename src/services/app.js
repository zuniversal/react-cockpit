import { req } from '@/utils/request';
import { useRequest } from 'ahooks';

export const getUserInfo = p => req.noTipsGet(`/sys/user/getUserInfo`, p);
export const addLog = p => req.noTipsGet(`/datapageaccesslog/dataPageAccessLog/addLog`, p);
export const endLog = p => req.noTipsGet(`/datapageaccesslog/dataPageAccessLog/updateEndTime`, p);
