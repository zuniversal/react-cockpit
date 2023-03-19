import { req } from '@/utils/request';

export const getNewsList = p => req.noTipsGet(`/news`, p);
export const getNews = p => req.noTipsGet(`/news/${p.id}`, p);
export const addNews = p => req.post(`/news`, p);
export const editNews = p => req.put(`/news/${p.id}`, p);
export const removeNews = p => req.remove(`/news`, p);

export const login = p => req.post(`/sys/login`, p);