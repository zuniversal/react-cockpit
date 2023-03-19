# umi project

## Getting Started

Install dependencies,

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

## umijs4.0 官方文档 https://umijs.org/docs/introduce/introduce

## ahooks 官方文档 https://ahooks.js.org/zh-CN/hooks/use-request/index

## 参考目录结构

```
├─common - 通用型公共组件
  └─SmartTable
├─components - 基础组件
  - 主要包括各页面的基本 表格 表单 等组件 及 其它的Widgets小部件 目录
    命名方式： 页面 + 功能（如 搜索型 Search ）+ Form/Table   SearchForm UserInfo 等
├─configs - 项目里用到的公共配置位置，如： 通用枚举值等
├─constants - 项目通用常量位置，如： URL 地址、WS_PREFIX 等
├─format - 格式化form表单要提交的数据 接口详情数据等
├─layouts - 布局入口容器相关组件
├─hooks - 钩子目录
├─locales - 国际化
├─models - 状态管理
├─routes - 路由配置
├─pages - 页面容器 - 处理管控页面逻辑 公共数据 组装页面组件入口
  ├─Home （推荐组件目录结构形式）
    ├─index.jsx
    ├─index.modules.less/index.less

    ├─format.js - 格式化请求提交前/数据返回后数据等的统一处理文件
    ├─config.js - 页面/组件内用到的配置文件
    ├─components - 子组件
├─services - 项目请求方法服务
  ├─user.js
├─static/assets - 静态资源
└─utils - 通用工具方法
```

## 开发

- 没有特殊需求时，所有的异步请求都用状态管理来实现，不要直接在组件内编写请求代码
- 表单必须有符合规则的校验，并给出明确的错误提示
- 表单提交做好防止短时间内重复提交的限制
- 页面数据加载做好 loading 效果和错误的兜底处理
- 非必要场景尽量不要直接操作 DOM，若有写明注释
- 开发前会给到接口文档，可以根据需要进行接口的 mock 方便开发

## 联调
