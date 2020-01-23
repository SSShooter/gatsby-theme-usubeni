---
path: '/docker-tutorial'
date: '2020-01-11T10:08:00.022Z'
title: 'docker 简单入门'
tags: ['coding', 'docker']
released: false
---

简单来说，docker 可以给你的应用创造一个“镜像”，之后你带着这个镜像就可以在其他主机、甚至其他系统轻松以原来的配置运行你的应用。使用 docker 会比直接使用虚拟机所需的性能需求要少很多，因此你可以在主机运行多个容器并保证性能。

## docker 架构

![docker 架构](architecture.svg)

Docker registry 是 docker 官方镜像储存中心

## 镜像

就像以前的虚拟光驱，打开 iso 镜像就能还原光盘里的所有文件，docker 的镜像也是如此。

### 生成镜像

使用 Dockerfile 通过 `docker image build` 构建镜像。当然如果你本机没有安装 docker，可以上传工程到 docker registry 进行构建。

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

- FROM 的意思是以指定镜像为基础生成新镜像，跟类差不多，一个继承一个，一层一层地抽象下去
- WORKDIR 指定容器目录
- COPY A B 表示从 dockerfile 目录的 A 复制到容器目录 B
- RUN 执行在容器创建前，也就是 RUN 产生的结果包含在镜像中
- CMD 执行在容器创建后，一般用于启动服务。只能存在一句 CMD 命令

[dockerfile 文档](https://docs.docker.com/engine/reference/builder/)

一句话总结：**工程 + dockerfile = 镜像**

### 获取已有镜像

镜像分享是 docker 重要的一环，你可以在 docker hub 上找到很多实用的现成镜像。

运行 `docker image pull` 加上 username/imagename 就能把镜像拉取到本地，例如：

```
docker image pull library/hello-world
```

### 其他常用操作

```
docker image ls
docker image rm
```

## 容器

上面提到的容器（container），就是**镜像的一个可运行实例**。通过运行镜像可以生成容器，例如：

```
docker container run hello-world
```

**镜像 -运行-> 容器**

### 其他常用操作

```
docker container ls
docker container rm
```

## docker compose

使用 compose，你可以在容器的基础上相互搭配其他容器。

运行 `docker-compose up` 会直接下载当前文件夹 docker-compose.yaml 中用到的所有镜像，下载完毕后一起运行。

[docker compose 文档](https://docs.docker.com/compose/reference/overview/)
