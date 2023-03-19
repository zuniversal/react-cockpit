import { req } from '@/utils/request';

export const getUserInfo = p => req.noTipsGet(`/sys/user/getUserInfo`, p);
export const getAppList = p => req.noTipsGet(`/indexlibrary/indexLibrary/appList`, p);
