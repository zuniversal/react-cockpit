import AddPermission from '../apps/news/addPermission'
import NewsDetail from '../apps/news/newsDetail'
import Permission from '../apps/news/permission'
import SearchNews from '../apps/news/searchNews'
import DetailRadar from '../apps/radar/detailRadar'
export const routes = [
  {
    id: 'home',
    name: 'home',
    path: '/',
  },
  {
    id: 'news',
    name: 'news',
    path: '/news',
    // childred: [
    //   {
    //     id: 'newsDetail',
    //     name: 'newsDetail',
    //     path: '/news/newsDetail',
    //     element: <NewsDetail />,
    //   },
    // ],
  },
  {
    id: 'newsDetail',
    name: 'newsDetail',
    path: '/news/newsDetail',
    element: <NewsDetail />,
  },
  {
    id: 'permission',
    name: 'permission',
    path: '/news/permission',
    element: <Permission />,
  },
  {
    id: 'addPermission',
    name: 'addPermission',
    path: '/news/addPermission',
    element: <AddPermission />,
  },
  {
    id: 'searchNews',
    name: 'searchNews',
    path: '/news/searchNews',
    element: <SearchNews />,
  },
  {
    id: 'radar',
    name: 'radar',
    path: '/radar',
  },
  {
    id: 'detailRadar',
    name: 'detailRadar',
    path: '/radar/detailRadar',
    element: <DetailRadar />,
  },
  {
    id: 'me',
    name: 'me',
    path: '/me',
  },
  {
    id: 'search',
    name: 'search',
    path: '/search',
  },
  {
    id: 'detail',
    name: 'detail',
    path: '/metrics/:metricId/detail',
  },
  {
    id: 'card',
    name: 'card',
    path: '/metrics/:metricId/card',
  },
  {
    id: 'login',
    name: 'login',
    path: '/login/:loginType',
  },
  {
    id: 'dev',
    name: 'dev',
    path: '/dev',
  },
  {
    id: 'error',
    name: 'error',
    path: '/error',
  },
  {
    id: 'notify',
    name: 'notify',
    path: '/notify',
  },
  {
    id: 'version',
    name: 'version',
    path: '/version',
  },
  {
    id: 'pcTips',
    name: 'pcTips',
    path: '/pcTips',
  },
  {
    id: 'versionList',
    name: 'versionList',
    path: '/versionList',
  },
  {
    id: 'introduce',
    name: 'introduce',
    path: '/introduce',
  },
  {
    id: 'skinCenter',
    name: 'skinCenter',
    path: '/skinCenter',
  },
  {
    id: 'power',
    name: 'power',
    path: '/power',
  },
  {
    id: 'help',
    name: 'help',
    path: '/help',
  },
  {
    id: 'helpDetail',
    name: 'helpDetail',
    path: '/helpDetail',
  },
  {
    id: 'feedback',
    name: 'feedback',
    path: '/feedback',
  },
  {
    id: 'feedbackDetail',
    name: 'feedbackDetail',
    path: '/feedbackDetail',
  },
  {
    id: 'problemFeedback',
    name: 'problemFeedback',
    path: '/problemFeedback',
  },
  {
    id: 'versionDetail',
    name: 'versionDetail',
    path: '/versionDetail',
  },
  {
    id: 'specificScenarios',
    name: 'specificScenarios',
    path: '/specificScenarios',
  },
  {
    id: 'quit',
    name: 'quit',
    path: '/quit',
  },
  {
    id: 'userExperienceSurvey',
    name: 'userExperienceSurvey',
    path: '/userExperienceSurvey',
  },
]
