---
path: '/devops'
date: '2021-08-17T11:32:13.152Z'
title: 'devops'
tags: ['tag']
released: false
---

devops 的产生：瀑布 => 敏捷 => devops

瀑布把各个步骤分开各部相关；敏捷组合了测试和开发，可以快速迭代；devops 代表开发和运维的组合，使整个流程更流畅；甚至有 BizDevOps 加上业务的实践。

DevOps 的 3 个支柱，也就是人、流程和平台，这 3 个支柱缺一不可。只有通过人、流程和平台的有机结合，在文化、工具和人员培训赋能领域共同推进，才能实现 DevOps 的真正落地实施。

要说清楚 VSM，首先就要说清楚什么是价值。简单来说，价值就是那些带给企业生存发展的核心资源，比如生产力、盈利能力、市场份额、用户满意度等。
VSM 是 Value Stream Mapping 的缩写，也就是我们常说的价值流图。它起源于传统制造业的精益思想，用于分析和管理一个产品交付给用户所经历的业务流、信息流，以及各个阶段的移交过程。

一切皆代码，一切纳入版本控制

分支策略：

- 主干开发，分支发布
- 分支开发，主干发布
- 主干开发，主干发布

基础设施即代码就是用一种描述性的语言，通过文本管理环境配置，并且自动化完成环境配置的方式。典型的就是以 CAPS 为代表的自动化环境配置管理工具，也就是 Chef、Ansible、Puppet 和 Saltstacks 四个开源工具的首字母缩写。

微服务的必要性：单个巨型应用随着功能扩展，耦合的代码加大维护困难，同时如果想要修改一些小功能要发布整个巨型应用，必要不大。拆分为微服务存在解耦的可能，也可以分开发布各个应用，同时，拆分为微服务可以使用不同的技术栈，可以作为尝试新技术的第一步。当然，微服务的发展也是得益于计算速度和网络建设的发展，时代在进步呀。

容器技术的代表 docker

在 docker 大量使用后，协调它们之间的关系变得不容易，于是有了 docker compose。

在容器化大潮下大公司的发布成本也拉高了，大家就需要 Kubernetes 了。

K8s 提供了大规模部署，负载均衡，滚动更新等很多功能。要使用这些功能不需要熟悉被部署的程序本身，而是专注于配置 K8s。

主节点和工作节点构成了 K8s 集群

> kubelet 是在每个 Node 节点上运行的主要 “节点代理”。它可以使用以下之一向 apiserver 注册： 主机名（hostname）；覆盖主机名的参数；某云驱动的特定逻辑。

要与 Kubernetes 进⾏交互，还需要 kubectl CLI 客户端。

你或许在想，是否有⼀个列表显⽰所有正在运⾏的容器，可以通
过类似于 kuberctl get containers 的命令获取。这并不是 Kubernetes 的⼯
作，它不直接处理单个容器。相反，它使⽤多个共存容器的理念。这
组容器就叫作 pod。

每个 pod 就像⼀个独⽴的逻辑
机器，拥有⾃⼰的 IP、主机名、进程等，运⾏⼀个独⽴的应⽤程序。

当运⾏ kubectl 命令时，它通过向 Kubernetes API 服务器发送⼀个
REST HTTP 请求，在集群中创建⼀个新的 ReplicationController 对象。
然后，ReplicationController 创建了⼀个新的 pod，调度器将其调度到⼀
个⼯作节点上。Kubelet 看到 pod 被调度到节点上，就告知 Docker 从镜像
中⼼中拉取指定的镜像，因为本地没有该镜像。下载镜像后，Docker
创建并运⾏容器。

简单地说，Kubelet 就是负责所有运⾏在⼯作节点上内容的组件。
它第⼀个任务就是在 API 服务器中创建⼀个 Node 资源来注册该节点。然
后需要持续监控 API 服务器是否把该节点分配给 pod，然后启动 pod 容
器。具体实现⽅式是告知配置好的容器运⾏时（Docker、CoreOS 的
Rkt，或者其他⼀些东西）来从特定容器镜像运⾏容器。Kubelet 随后持
续监控运⾏的容器，向 API 服务器报告它们的状态、事件和资源消耗。

kubectl 通过接口控制主节点，生成对象

服务作为负载均衡挡在多个 pod 前⾯。

当⼀个 pod 包含多个容器时，这些容器总是运⾏于同⼀
个⼯作节点上——⼀个 pod 绝不会跨越多个⼯作节点

如果前端和后端都在同⼀个容器中，那么两者将始终在同⼀台计
算机上运⾏。如果你有⼀个双节点 Kubernetes 集群，⽽只有⼀个单独的
pod，那么你将始终只会⽤⼀个⼯作节点，⽽不会充分利⽤第⼆个节点
上的计算资源（CPU 和内存）。因此更合理的做法是将 pod 拆分到两个
⼯作节点上，允许 Kubernetes 将前端安排到⼀个节点，将后端安排到另
⼀个节点，从⽽提⾼基础架构的利⽤率。

还有扩容问题

我们将使⽤带有-o yaml 选项的 kubectl
get 命令来获取 pod 的整个 YAML 定义

使⽤ kubectl explain 来发现可能的 API 对象字段

label！！标签是⼀种简单却功能强⼤的 Kubernetes 特性，不仅可以组织
pod，也可以组织所有其他的 Kubernetes 资源。

pod 并不是唯⼀可以附加标签的 Kubernetes 资源。标签
可以附加到任何 Kubernetes 对象上，包括节点。.

当你想将对象分割成完全独⽴且不重叠的组时，又该如何
呢？命名空间！

存活探针（liveness probe）

你将创建⼀个包含 HTTP GET 存活探针的新 pod

ReplicationController 是⼀种 Kubernetes 资源，可确保它的 pod 始终保
持运⾏状态。如果 pod 因任何原因消失（例如节点从集群中消失或由于
该 pod 已从节点中逐出），则 ReplicationController 会注意到缺少了 pod 并
创建替代 pod。

最初，ReplicationController 是⽤于复制和在异常时重新调度节点的
唯⼀ Kubernetes 组件，后来又引⼊了⼀个名为 ReplicaSet 的类似资源。它
是 新 ⼀ 代 的 ReplicationController ， 并 且 将 其 完 全 替 换 掉
（ReplicationController 最终将被弃⽤）。

Kubernetes 服务是⼀种为⼀组功能相同的 pod 提供单⼀不变的接⼊
点的资源。当服务存在时，它的 IP 地址和端⼜不会改变。客户端通过 IP
地址和端⼜号建⽴连接，这些连接会被路由到提供该服务的任意⼀个
pod 上。通过这种⽅式，客户端不需要知道每个单独的提供服务的 pod
的地址，这样这些 pod 就可以在集群中随时被创建或移除。

Kubernetes 通过定义存储卷来满⾜这个需求，它们不像 pod 这样的
顶级资源，⽽是被定义为 pod 的⼀部分，并和 pod 共享相同的⽣命周
期。这意味着在 pod 启动时创建卷，并在删除 pod 时销毁卷。因此，在
容器重新启动期间，卷的内容将保持不变，在重新启动容器之后，新
容器可以识别前⼀个容器写⼊卷的所有⽂件。另外，如果⼀个 pod 包含
多个容器，那这个卷可以同时被所有的容器使⽤。

先配一个 vol，再用一个 vol

当运⾏在⼀个 pod 中的应⽤程序需要将数据保存到磁盘上，并且即
使该 pod 重新调度到另⼀个节点时也要求具有相同的数据可⽤。这就不
能使⽤到⽬前为⽌我们提到的任何卷类型，由于这些数据需要可以从
任何集群节点访问，因此必须将其存储在某种类型的⽹络存储
（NAS）中。

通过 ConfigMap 配置应⽤程序
通过 Secret 传递敏感配置信息

Deployment 是⼀种更⾼阶资源，⽤于部署应⽤程序并以声明的⽅
式升级应⽤，⽽不是通过 ReplicationController 或 ReplicaSet 进⾏部署，
它们都被认为是更底层的概念。

minReadySeconds 属性指定新创建的 pod ⾄少要成功运⾏多久之
后，才能将其视为可⽤。在 pod 可⽤之前，滚动升级的过程不会继续
（还记得 maxUnavailable 属性吗？）。当所有容器的就绪探针返回成功
时，pod 就被标记为就绪状态。如果⼀个新的 pod 运⾏出错，就绪探针
返回失败，如果⼀个新的 pod 运⾏出错，并且在 minReadySeconds 时间
内它的就绪探针出现了失败，那么新版本的滚动升级将被阻⽌。

如何使⽤ Statefulset 来部署有状态应⽤

## paas

paas 的核心能力是沙盒，也就是容器

事实上，Docker 项目确实与 Cloud Foundry 的容器在大部分功能和实现原理上都是一样的，可偏偏就是这剩下的一小部分不一样的功能，成了 Docker 项目接下来“呼风唤雨”的不二法宝。

这个功能，就是 Docker 镜像。

Docker 镜像解决的，恰恰就是打包这个根本性的问题。 所谓 Docker 镜像，其实就是一个压缩包。但是这个压缩包里的内容，比 PaaS 的应用可执行文件 + 启停脚本的组合就要丰富多了。实际上，大多数 Docker 镜像是直接由一个完整操作系统的所有文件和目录构成的，所以这个压缩包里的内容跟你本地开发和测试环境用的操作系统是完全一样的。

## Docker Swarm

集群管理

在 2016 年，Docker 公司宣布了一个震惊所有人的计划：放弃现有的 Swarm 项目，将容器编排和集群管理功能全部内置到 Docker 项目当中。

显然，Docker 公司意识到了 Swarm 项目目前唯一的竞争优势，就是跟 Docker 项目的无缝集成。那么，如何让这种优势最大化呢？那就是把 Swarm 内置到 Docker 项目当中。

## 容器编排

前身 fig，现在是 docker compose

## 词汇表

### docker

### k8s

在常规环境下，这些应用往往会被直接部署在同一台机器上，通过 Localhost 通信，通过本地磁盘目录交换文件。而在 Kubernetes 项目中，这些容器则会被划分为一个“Pod”，Pod 里的容器共享同一个 Network Namespace、同一组数据卷，从而达到高效率交换信息的目的。

Pod 是 Kubernetes 项目中最基础的一个对象，源自于 Google Borg 论文中一个名叫 Alloc 的设计。在后续的章节中，我们会对 Pod 做更进一步地阐述。

Pod 就是 Kubernetes 世界里的“应用”；而一个应用，可以由多个容器组成。

Kubenetes 是一款由 Google 开发的开源的容器编排工具，在 Google 已经使用超过 15 年。作为容器领域事实的标准，Kubernetes 可以极大的简化应用的管理和部署复杂度。

这样的每一个 API 对象都有一个叫作 Metadata 的字段，这个字段就是 API 对象的“标识”，即元数据，它也是我们从 Kubernetes 里找到这个对象的主要依据。这其中最主要使用到的字段是 Labels。

顾名思义，Labels 就是一组 key-value 格式的标签。而像 Deployment 这样的控制器对象，就可以通过这个 Labels 字段从 Kubernetes 中过滤出它所关心的被控制对象。

比如，在上面这个 YAML 文件中，Deployment 会把所有正在运行的、携带“app: nginx”标签的 Pod 识别为被管理的对象，并确保这些 Pod 的总数严格等于两个。

凡是调度、网络、存储，以及安全相关的属性，基本上是 Pod 级别的。

这些属性的共同特征是，它们描述的是“机器”这个整体，而不是里面运行的“程序”。比如，配置这个“机器”的网卡（即：Pod 的网络定义），配置这个“机器”的磁盘（即：Pod 的存储定义），配置这个“机器”的防火墙（即：Pod 的安全定义）。更不用说，这台“机器”运行在哪个服务器之上（即：Pod 的调度）。

容器技术诞生后，大家很快发现，它用来封装“无状态应用”（Stateless Application），尤其是 Web 服务，非常好用。但是，一旦你想要用容器运行“有状态应用”，其困难程度就会直线上升。而且，这个问题解决起来，单纯依靠容器技术本身已经无能为力，这也就导致了很长一段时间内，“有状态应用”几乎成了容器技术圈子的“忌讳”，大家一听到这个词，就纷纷摇头。

不过，Kubernetes 项目还是成为了“第一个吃螃蟹的人”。

得益于“控制器模式”的设计思想，Kubernetes 项目很早就在 Deployment 的基础上，扩展出了对“有状态应用”的初步支持。这个编排功能，就是：StatefulSet。

在开始讲述 StatefulSet 的工作原理之前，我就必须先为你讲解一个 Kubernetes 项目中非常实用的概念：Headless Service。

一个 replica 一个 pod，pod 包含一组容器

service 是网络处理服务

Service 在 Kubernetes 集群内扮演了服务发现和负载均衡的作用。

外部访问入口（Ingress）

etcd 是持久储存

- pod 怎么部署到不同机？

- pod 和 worker node 到底是啥关系
  答案是节点调度 pod
  kubectl get nodes

Kubernetes 的核心组件主要由两部分组成：Master 组件和 Node 组件，其中 Matser 组件提供了集群层面的管理功能，它们负责响应用户请求并且对集群资源进行统一的调度和管理。Node 组件会运行在集群的所有节点上，它们负责管理和维护节点中运行的 Pod，为 Kubernetes 集群提供运行时环境。
Master 组件主要包括：
kube-apiserver：负责对外暴露 Kubernetes API；
etcd：用于存储 Kubernetes 集群的所有数据；
kube-scheduler: 负责为新创建的 Pod 选择可供其运行的节点；
kube-controller-manager： 包含 Node Controller，Deployment Controller，Endpoint Controller 等等，通过与 apiserver 交互使相应的资源达到预期状态。
Node 组件主要包括：
kubelet：负责维护和管理节点上 Pod 的运行状态；
kube-proxy：负责维护主机上的网络规则以及转发。
Container Runtime：如 Docker,rkt,runc 等提供容器运行时环境。

- replica 就是一个 pod？
  似乎是，根据 Pod Template 生成 replica 数量的 pod

- 优势 负载均衡 滚动升级

#### minikube

#### kubectl

### prometheus

exporter 顾名思义就是个输出者，例如 Node exporter，就是输出一个虚拟机节点的硬件情报。Kubernetes 会自己输出 prometheus 可监控的数据，不用另外安装 exporter

Grafana 另外的可视化项目，可以接入 prometheus

```yaml
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

配置 scrape_configs 可以采集 exporter 暴露的数据。job 任务，target 是 exporter 暴露的地址，一个订阅目标。

> 在 Prometheus 中，每一个暴露监控样本数据的 HTTP 服务称为一个实例。例如在当前主机上运行的 node exporter 可以被称为一个实例(Instance)。

### Helm

### 云原生

### Zadig

### pnpm

### HA

高可用性 H.A.（High Availability）

### Consul

Consul 是由 HashiCorp 开发的一个支持多数据中心的分布式服务发现和键值对存储服务的开源软件，被大量应用于基于微服务的软件架构当中。

### sidecar 容器

### cronJob

### FQDN

### NFS

### Ansible

### rancher

http://docs.rancher.cn/

https://www.katacoda.com/
