---
path: '/docker-tutorial'
date: '2020-01-10T10:08:00.022Z'
title: 'docker 简单入门'
tags: ['coding', 'docker']
---

## docker

简单来说，docker 可以给你的应用创造一个“容器”，之后你带着这个容器就可以在其他主机、甚至其他系统轻松以原来的配置运行你的应用。使用 docker 会比直接使用虚拟机所需的性能需求要少很多，因此你可以在主机运行多个容器并保证性能。

### 架构

![docker 架构](https://docs.docker.com/engine/images/architecture.svg)

所以进行下面操作的基础是安装 docker。

Docker registry 是 docker 官方镜像储存中心

### 镜像

#### 生成镜像

使用 Dockerfile 通过 `docker image build` 构建镜像。

以 web 前端工程为例，以下是 ant design pro 的 Dockerfile：

```
FROM circleci/node:latest-browsers

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN yarn

COPY ./ ./

RUN npm run test:all

RUN npm run fetch:blocks

CMD ["npm", "run", "build"]
```

[dockerfile 文档](https://docs.docker.com/engine/reference/builder/)

### 容器

上面提到的容器，就是**镜像的一个可运行实例**。用过运行镜像 `docker container run` 可以生成容器。

## docker compose

使用 compose，你可以在容器的基础上相互搭配其他容器。

[docker compose 文档](https://docs.docker.com/compose/reference/overview/)
