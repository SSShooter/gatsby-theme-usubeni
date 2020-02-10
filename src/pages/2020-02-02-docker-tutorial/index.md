---
path: '/docker-tutorial'
date: '2020-02-02T10:08:00.022Z'
title: 'docker 简单入门'
tags: ['coding', 'docker']
---

简单来说，docker 可以给你的应用创造一个**镜像**，之后你带着这个镜像就可以在其他主机、甚至其他系统轻松以原来的配置运行你的应用，这样的一个应用后面成为**容器**。使用 docker 会比直接使用虚拟机所需的性能需求要少很多，因此你可以在主机运行多个容器并保证性能。而且因为容器的相互分离，可以减少环境间的相互影响，避免一些难以 debug 的错误。

在学习 docker 之前必须知道，[docker 官方文档](https://docs.docker.com/)是我们的好老师，写得非常详细，文档庞大但是不会显得很混乱，迷茫时可以翻一翻。

## docker 架构

![docker 架构](architecture.svg)

[上图](https://docs.docker.com/engine/images/architecture.svg)来自[官方文档](https://docs.docker.com/engine/docker-overview/)。最左侧的客户端（client）是一个命令行客户端，可以通过 api 控制 docker 守护进程（daemon）。这个守护进程可以是本机的，也可以是其他服务器的，守护进程管理着属于他的镜像（image）和容器（container）。右侧指的是你可以在远程获取各式各样已经做好的镜像，站在巨人的肩膀上，让你的开发变得更轻松！这些获取镜像的源最常用的肯定是 Docker Hub，他是 docker 官方镜像储存中心。

下面的重点是镜像和容器。

## 镜像

就像以前的虚拟光驱，打开 iso 镜像就能还原光盘里的所有文件，docker 的镜像也是如此。

### 生成镜像

使用 Dockerfile 通过 `docker image build` 构建镜像。（你也可以上传工程到 docker hub 进行构建，但是没有必要，除非你的电脑真的装不下 docker 了 😂）

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

如果要对本地工程构建镜像，可以在 Dockerfile 所在文件夹运行 `docker image build .`。

一句话总结：**工程 + dockerfile = 镜像**

更多配置请参考 [dockerfile 文档](https://docs.docker.com/engine/reference/builder/)。

### 获取已有镜像

镜像分享是 docker 重要的一环，你可以在 docker hub 上找到很多实用的现成镜像。

运行 `docker image pull` 加上 username/imagename 就能把镜像拉取到本地，例如：

```
docker image pull library/hello-world
```

其他常用操作还有：

```
docker image ls
docker image rm
```

## 容器

容器（container）的概念比较简单，就是**镜像的一个运行实例**。通过运行镜像可以生成容器，例如：

```
docker container run hello-world
```

一句话总结：**运行镜像 → 容器**

其他常用操作还有：

```
docker container ls
docker container rm
```

## docker compose

顺便简单提一下 docker compose。

使用 compose，你可以在容器的基础上相互搭配其他容器。

运行 `docker-compose up` 会直接下载当前文件夹 `docker-compose.yaml` 中用到的所有镜像，下载完毕后一起运行。（在 linux 的话 docker-compose 应该要另外安装）

当然你也可能不方便每次都使用 `docker-compose.yaml` 这个文件名，例如需要通过文件名区分几个不同的工程，所以如果不使用默认文件名，可以使用 `-f` 参数运行 compose，后面跟上文件名即可：

`docker-compose -f docker-compose.projectName.yml up`

更多配置请参考 [compose-file 文档](https://docs.docker.com/compose/compose-file/)，确实，配置 `docker-compose.yaml` 也是一门学问。

另外，[docker compose 文档](https://docs.docker.com/compose/reference/overview/)有 `docker-compose` 命令相关的文档。
