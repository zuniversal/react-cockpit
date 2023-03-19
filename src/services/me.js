import { req } from '@/utils/request';

export const getRankingUserList = (p) =>
  req.noTipsGet(`/datapageaccesslog/dataPageAccessLog/rankingUserList`, p);
export const getRankingUser = (p) =>
  req.noTipsGet(`/datapageaccesslog/dataPageAccessLog/rankingUser`, p);
export const addLog = (p) =>
  req.noTipsPost(`/datapageaccesslog/dataPageAccessLog/addLog`, p);
export const updateEndTime = (p) =>
  req.noTipsGet(`/datapageaccesslog/dataPageAccessLog/updateEndTime`, p);
export const getCurrentVersion = (p) =>
  req.noTipsGet(`/sys/version/getSysPortalVersion`, p);
export const getLastestVersion = (p) =>
  req.noTipsPost(`/sys/annountCement/lastVersionUpdateBulletFrame`, p);
export const getVersionList = (p) =>
  req.noTipsGet(`/sys/version/getSysPortalOldVersion`, p);
export const getVersionIntroList = (p) =>
  req.noTipsGet(`/sys/version/function/getVersionFunctionByVersionId`, p);
export const getAllNotice = (p) =>
  req.noTipsGet(`/sys/sysAnnouncementSend/getMyAnnouncementSend`, p);
export const getProblemList = (p) =>
  req.noTipsGet(`/commonproblem/commonProblem/appList`, p);
export const getProblem = (p) =>
  req.noTipsGet(`/commonproblem/commonProblem/queryById`, p);
export const getNotifyList = (p) =>
  req.noTipsGet(`/feedback/feedbackProblem/getMyAnnouncementSend`, p);
export const getFeedbackList = (p) =>
  req.noTipsGet(`/feedback/feedbackProblem/feedbackapplist`, p);
export const addFeedback = (p) =>
  req.noTipsGet(`/feedback/feedbackProblem/addUserFeedBack`, p);
export const getIssueList = (p) =>
  req.noTipsGet(`/researchIssues/getIssuesAnswer`, p);
export const getFeedback = (p) =>
  req.noTipsGet(`/feedback/feedbackProblem/getUserFeedBackDetail`, p);
