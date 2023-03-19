import { req } from '../utils/request'

export const removeMertic = (p) =>
  req.get(`/sysUserFlowIndicator/deleteFlowIndicator`, p)
export const updateSort = (p) => req.noTipsGet(`/sysUserFlowIndicator/sort`, p)
