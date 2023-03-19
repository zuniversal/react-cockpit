import metric from './metric';
import me from './me';
import news from './news';

export default [
  {
    path: '/login',
    component: 'Login',
    title: '登录页',
    layout: false,
  },
  { path: '/', component: 'Home', title: '关注' },
  { path: '/search', component: 'Search/Search', title: '搜索页' },
  {
    path: '/news',
    component: 'News',
    title: '资讯',
  },
  { path: '/radar', component: 'Radar', title: '雷达' },
  { path: '/me', component: 'Me', title: '我的' },
  { path: '/*', component: 'NotFound', title: '404', layout: false },
  {
    path: '/metrics',
    component: 'DetailView',
    title: '指标页',
    routes: metric,
  },
  ...news,
  ...me,
];
