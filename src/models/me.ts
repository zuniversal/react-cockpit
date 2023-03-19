import { useReq } from '@/hooks/useReq';
import {
  addLog,
  getAllNotice,
  getCurrentVersion,
  getLastestVersion,
  getRankingUser,
  getRankingUserList,
  updateEndTime,
  getVersionList,
  getVersionIntroList,
  getProblemList,
  getProblem,
  getNotifyList,
  getFeedbackList,
  addFeedback,
  getIssueList,
  getFeedback,
} from '@/services/me';

export default () => {
  const {
    data: currentData,
    error,
    loading,
    run: getRankingUserListAsync,
  } = useReq(getRankingUserList);

  const { data: currentDataTop, run: getRankingUserAsync } =
    useReq(getRankingUser);
  const { run: addLogAsync } = useReq(addLog);

  const { run: updateEndTimeAsync } = useReq(updateEndTime);

  const { data: versionInfo, run: getCurrentVersionAsync } =
    useReq(getCurrentVersion);
  const version = versionInfo?.releaseVersion;

  const { run: getLastestVersionAsync } = useReq(getLastestVersion);

  const { data: allNoticeList, run: getAllNoticeAsync } = useReq(getAllNotice);

  const { data: versionList = [], run: getVersionListAsync } =
    useReq(getVersionList);

  const { data: versionIntroList = [], run: getVersionIntroListAsync } =
    useReq(getVersionIntroList);

  const { data: problemListData = [], run: getProblemListAsync } =
    useReq(getProblemList);
  const problemList = problemListData.records;

  const { data: problem = {}, run: getProblemAsync } = useReq(getProblem);

  const { data: notifyListData = [], run: getNotifyListAsync } =
    useReq(getNotifyList);
  const notifyList = notifyListData.records;
  const { data: feedbackListData = [], run: getFeedbackListAsync } =
    useReq(getFeedbackList);
  const feedbackList = feedbackListData.records;
  const { run: addFeedbackAsync } = useReq(addFeedback);
  const { data: feedback = {}, run: getFeedbackAsync } = useReq(getFeedback);
  console.log(' feedback ： ', feedback);
  const { data: issueList = [], run: getIssueListAsync } = useReq(getIssueList);

  const modelData = {
    currentData,
    getRankingUserListAsync,
    currentDataTop,
    getRankingUserAsync,
    addLogAsync,
    updateEndTimeAsync,
    getCurrentVersionAsync,
    version,
    versionInfo,
    getLastestVersionAsync,
    allNoticeList,
    getAllNoticeAsync,
    versionList,
    getVersionListAsync,
    versionIntroList,
    getVersionIntroListAsync,
    problemList,
    getProblemListAsync,
    problem,
    getProblemAsync,
    notifyList,
    getNotifyListAsync,
    feedbackList,
    getFeedbackListAsync,
    addFeedbackAsync,
    issueList,
    getIssueListAsync,
    feedback: {
      ...feedback,
      imgUrl: feedback?.imgUrl?.split(','),
    },
    getFeedbackAsync,
  };
  console.log(' modelData ： ', modelData); //
  return modelData;
};
