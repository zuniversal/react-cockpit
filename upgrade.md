# 迁移升级文档

## 迁移升级原因（驾驶舱存在问题总结）：  
1.当前项目搭建的脚手架不好扩展升级.
2.开发环境无热更新功能
3.需要统一的 状态管理（过多context全局状态管理不方便，数据通信来源不清晰，依赖监听太多，不易理解修改，容易导致bug）
4.路由定义不清晰，Provider嵌套过多、跳转方式有(目前跳转方式不统一,很混乱,不方便管理)
5.没有封装好统一的请求(无法统一拦截管理请求出现的问题做统一处理、没有统一管理接口地址)
6.不必要的重复性代码太多（事件埋点、水印、请求、Helmet等）

优化方式
1.使用 阿里开源的企业级框架 umijs 
2.在配置文件统一修改应用各配置
3.使用统一内置状态管理组件
4.使用已封装的集成路由 对路由做模块化划分
5.封装统一请求方法
6.针对重复代码做统一封装处理,增加路由拦截,处理统一的埋点事件等

达到的效果
1.无需手动配置繁琐的 状态管理、路由 等一系列常见需求，开箱即用 开发人员直接使用编写即可。编写好迁移文档，最低限度的影响原代码，最少更改的的直接迁移各页面、组件代码
2.实现热更新,增加开发效率,不用改一次代码手动去刷新页面
3.统一个状态管理,全局都能取到需要的状态并且更加清晰明了易懂易用
4.统一路由跳转方式,清晰的路由,对应路由寻找
5.统一封装好的请求,可以很方便的统一管理请求出现的各种状态,使开发更高效
6.减少代码量,降低耦合性,提高代码的健壮性,可维护性。提高代码的可阅读性


### 已迁移: 除首页外页面，首页各指标组件主要需要迁移内容 (状态数据源、路由跳转、请求、路径引入)  （部分代码不是最新 后面没再修改页面后再继续修改）

### ------------------------------ 需要迁移/修改部分 ------------------------------

### 1.uesr 相关信息数据源 useCurrentApp 改为从 useModel 状态仓库里获取、替换统一的请求方式 useRequest （已统一添加请求 token、401 重定向、全局 loading、错误捕获 ）
如 
```
import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
const { user } = useCurrentApp()
改为
import { useModel } from 'umi';
const { user } = useModel('user')
```
``` model 文件定义使用
  const { data, error, loading } = useReq(getNewsList);
```

### 2.去除各组件、页面 原先的 context 数据传递管理形式，及去除 Helmet 相关设置（ 已统一在 layout 入口自动设置 ）

### 3.路由跳转方法等均引入改为从 umi 获取，umi里面已经全部集成。
如 
```
import { useNavigate } from 'react-router-dom' 
改为
import { useNavigate } from 'umi'
```

### 4.请求在 services 文件夹下定义好，可结合 ahooks 使用（ 已具备 data, error, loading 处理 ）
如 
``` news.js 接口文件定义
import { req } from '@/utils/request';
export const getNewsList = p => req.noTipsGet(`/news`, p);
export const getNews = p => req.noTipsGet(`/news/${p.id}`, p);

调用：
const res = await getNews()
```

```
``` 可以修改的话 可以结合 useRequest， hooks/useReq 请求默认配置是 manual: true, 调用 run 方法手动触发请求
const { data, error, loading, run } = useReq(getNewsList);
```

### 5.资源引用使用 @ 别名引入（现在各组件的目录结构基本是都直接按原目录迁移过来）
### 6.去除页面埋点相关代码 （统一在 layout 入口设置）
### 7.去除 commonjs 语法 require 图片， 用 import
### 8.各指标详情页在 routes 路由定义好，抽离成单独的页面




### ------------------------------ 项目增加内容 ------------------------------

#### hooks 增加： useReq、useRouteMatch、useBuryingPoint

#### 与原项目目录差异，增加如下功能目录

```
├─common - 通用型公共组件
├─configs - 项目里用到的公共配置位置，如： 通用枚举值等
├─constants - 项目通用常量位置，如： URL 地址、WS_PREFIX 等
├─format - 格式化form表单要提交的数据 接口详情数据等
├─layouts - 布局入口容器相关组件
├─models - 状态管理
├─routes - 路由配置
├─pages - 页面容器 - 处理管控页面逻辑 公共数据 组装页面组件入口
├─services - 项目请求方法服务
├─static/assets - 静态资源
```
