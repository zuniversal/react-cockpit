# 构建和部署

## 构建

构建方式主要根据app的加载方式不同分为两种。

### 1. 基于微前端加载的构建

首先需要设置环境变量`APP_LOADER_MODE=micro`，可以直接修改`.env`文件，也可以用`export`。

此时构建命令为`npm run build`或`npm run build -- --apps=main,home`。前者会构建完整的项目，
后者只会构建`--apps`参数后带的app，除了`main`之外，其他的都对应着`src/apps`目录下的一个目录名称。
多个apps用逗号`,`分隔。

`main`应用的构建结果在`dist/public`, 其他的则在`dist/public/apps`下。

### 2. 基于单应用的构建

首先需要设置环境变量`APP_LOADER_MODE=singleton`，可以直接修改`.env`文件，也可以用`export`。

此时构建命令为`npm run build -- --apps=main --force`。 

此时构建结果只有`dist/public`

## 部署

目前临时的部署方式为文件上传。在服务端启动部署服务后（部署服务器源码在`src/server`），本地可以直接将
构建文件打包和上传。

打包命令为`npm run bundle`。（需要nodejs>=18)

上传命令为`npm run deploy -- --origin=http://datafront.calb-tech.com:8090`。`origin`参数是部署环境
的域。

之后需要将部署流程迁移到CI/CD平台。