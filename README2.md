# frontend


该项目采用微前端架构，支持菜单级别热部署，项目早期使用react作为主要框架。

## 开发工具
* nodejs >=16: 运行时，需要安装 
  * bundle命令需要nodejs >=18
* npm >=8: 包管理工具，nodejs内置，不需要安装
* vscode: 代码编辑器，依赖插件prettier, eslint，需要安装
  * prettier <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>
  * eslint <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>
* webpack: 构建工具，依赖插件dotenv, module federation,html，已集成在依赖项，不需要安装

## 开发文档

启动开发环境
```
npm run dev
```

详情见 [开发文档](./docs/README.md)

## 相关链接
* 前端架构文档：https://docs.qq.com/doc/DVk1GdFFub2dBVmlG
* 前端todo事项：https://docs.qq.com/doc/DWHR5eVFucEJZZlpu
* 原型地址: https://rp.mockplus.cn/run/Rfi5TOFYmaLq/ghH6l3jcj3Oh/WDycFTCWgeR2?nav=1&cps=expand&rps=expand&ha=0&la=0&fc=0&dt=iphoneX&out=0&rt=1&
* UI地址： https://www.figma.com/file/BIaqjOc3cPV6pKpGPlQ8aO/中航创新?node-id=0%3A1
* git提交规范说明： https://www.conventionalcommits.org/zh-hans/v1.0.0/ 
* 生产环境访问地址：http://datafront.calb-tech.com:8090
* 开发环境访问地址：http://datafront.calb-tech.com:8091
* UAT环境访问地址：http://datafront.calb-tech.com:8092
* 服务端接口文档访问地址：http://databack.calb-tech.com:8099/
* 业务相关中英文对照表: https://docs.qq.com/sheet/DVklKTldQSVZWZGZl?tab=BB08J2
* 问题清单：https://docs.qq.com/sheet/DWHptbE1CRUlvSWVs?tab=BB08J3