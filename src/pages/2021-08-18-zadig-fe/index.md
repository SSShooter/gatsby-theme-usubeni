---
path: '/zadig-fe'
date: '2021-08-18T09:23:38.383Z'
title: 'Zadig 前端调研'
tags: ['coding', 'zadig']
---

> Zadig 是 KodeRover 公司基于 Kubernetes 自主设计、研发的开源分布式持续交付 (Continuous Delivery) 产品，为开发者提供云原生运行环境，支持开发者本地联调、微服务并行构建和部署、集成测试等。Zadig 内置了面向 Kubernetes、Helm、云主机/物理机、大体量微服务等复杂业务场景的最佳实践，为工程师一键生成自动化工作流 (workflow)。Zadig 不改变现有习惯和流程，几乎兼容所有软件架构，无缝集成 GitHub/GitLab、Jenkins、多家云厂商等，运维成本极低。

![Zadig-Business-Architecture](/blog-image/Zadig-Business-Architecture.png)

## 本地启动 zadig 前端项目流程

### 前端开发环境

- git
- node.js
- yarn
- vscode（ESlint 插件）
- vue.js DevTools（方便理解新项目组件结构）

### 获取线上测试环境

- 在 https://os.koderover.com 使用 GitHub OAuth 登录
- 在系统中 Fork Zadig 项目
- 点击 zadig 选项，将其中的 `endpoint.FQDN` 中的 `githubid` 改成你的 GitHub ID
- 等待 Fork 完成后，得到测试环境

### 前端项目启动

```sh
cd zadig-portal
yarn install
yarn run dev
```

clone zadig 前端项目仓库 [zadig-portal](https://github.com/koderover/zadig-portal)，使用 yarn 安装依赖。

在运行前先把 `zadig-portal/config/index.js` 中的 `backEndAddr` 改为之前得到的测试环境地址（`xxx.ko.coderover.cn`）。

### 其他准备

本地登录系统前先进入线上测试环境 `xxx.ko.coderover.cn` 初始化账号才能登陆。

使用 GitHub 代码需要先新建 GitHub OAuth 应用程序，在 `xxx.ko.coderover.cn` 登录后再继续在本地使用，具体参考 https://docs.koderover.com/settings/codehost/github/

## zadig-portal 的代码结构

项目基本情况：

- UI 库：桌面端使用 [element-ui](https://element.eleme.io/)，移动端使用 [Vant](https://youzan.github.io/vant/)
- 构建工具：webpack ^3.6.0
- 代码编辑组件：vue2-ace-editor
- 代码展示组件：vue-codemirror
- 新手引导功能：vue-introjs
- 命令行模拟库：xterm

### 根目录

```
zadig-portal
├── amd64.Dockerfile
├── arm64.Dockerfile
├── build ：webpack 打包流程默认配置
├── config ：环境配置与 webpack 自定义配置
├── index.html
├── LICENSE
├── package.json
├── publish.sh
├── README.md
├── src
├── static ：favicon 等静态资源
└── zadig-nginx.conf
```

### src 文件夹

```
src
├── api ：构建 ajax 请求对象，export 请求方法 *1
├── App.vue ：Vue 界面入口文件
├── assets ：css、图标等静态资源
├── common ：通用组件 *2
├── components ：前端页面
├── main.js ：前端打包入口文件
├── mobile ：移动端专用页面 *3
├── router ：前端路由文件 *4
├── store ：Vuex 配置
└── utilities ：功能函数
```

- \*1：包含鉴权、错误提示
- \*2：common 中的通用组件在 `src\utilities\traversal.js` 中注入
- \*3：暂无自动重定向，访问需要手动输入移动端地址
- \*4：二级路由空页面用于重定向

### components 文件夹

包含所有前端页面，文件夹内有页面专用组件。

```
components
├── common ：PC 端通用组件，需手动引入
├── enterprise_mgr ：用户管理页面
├── entry ：登录页、主页、404 页等
├── profile ：用户设置页
├── projects ：基本所有重要功能都在这里（重点）
├── quality_manage ：测试管理页面
├── setting ：系统设置下的所有页面
└── setup ：仅在系统初始化时使用
```

## zadig 的使用流程

以官网[典型微服务案例(Python + Redis + Node.js)](https://docs.koderover.com/zadig/examples/voting/)为例。

### 新建项目

设置项目名称与主键。

### 创建服务与服务构建

> Zadig 中的**服务**可以是一组 Kubernetes 资源，一个基本的服务配置可能包括 Ingress、Service、Deployment/Statefulset、ConfigMap 等、可以是一个完整的 Helm Chart 或者是云主机/物理机服务，成功部署后可对外提供服务能力。

输入 K8s 配置生成服务，可以通过 GitHub 拉取配置，但需要先配置好 OAuth 应用程序并授权。

因为原来的项目在 [Zadig](https://github.com/koderover/zadig) 的 [examples](https://github.com/koderover/Zadig/tree/main/examples/voting-app/freestyle-k8s-specifications) 里，为了方便操作，直接提交一份到这个仓库 [voting-app](https://github.com/ssshooter/voting-app)，使用时直接 fork 即可。

![](/blog-image/20210818184207.png)

**此处需熟悉 K8s 配置**

配置服务构建：选择服务 -> 点击`添加构建` -> 填写构建脚本

![](/blog-image/zadig-build.png)

### 加入运行环境

创建好服务后，Zadig 会**自动**生成以下资源：

2 套测试环境

- dev
- qa

3 条工作流

- voting-app-workflow-dev
- voting-app-workflow-qa
- voting-app-workflow-ops

### 开发环境设置更新条件

配置 Webhook 触发器，在 push 和 PR 时触发更新。

## 疑问

- 工作流和环境的关系
- ops 工作流如何使用
- Zadig 和 K8s 的关系
- 如何在 vscode 使用 zadig 的缩进风格

## 优化

- 搜索代码库名称时筛选无效
- 存在冗余依赖（如 vue-resource）

## 参考文档

- [Zadig 文档](https://docs.koderover.com/zadig/quick-start/introduction/#%E4%B8%9A%E5%8A%A1%E6%9E%B6%E6%9E%84)
- [Zadig 贡献指南](https://github.com/koderover/zadig/blob/main/CONTRIBUTING-zh-CN.md)
- [Zadig 开发流程](https://github.com/koderover/zadig/blob/main/community/dev/contributor-workflow.md)
- [典型微服务案例(Python + Redis + Node.js)](https://docs.koderover.com/zadig/examples/voting/)
