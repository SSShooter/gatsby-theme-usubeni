---
path: '/game-console-networks'
date: '2020-04-27T13:38:09.408Z'
title: 'console 联网之谜'
tags: ['coding']
released: false
---

家里的网太菜，逼迫我学习老本行，毕竟，我也是网络工程毕业生啊...

## NAT

> NAT（Network Address Translation，网络地址转换）是 1994 年提出的。当在专用网内部的一些主机本来已经分配到了本地 IP 地址（即仅在本专用网内使用的专用地址），但现在又想和因特网上的主机通信（并不需要加密）时，可使用 NAT 方法。

当你访问正常服务器的时候，只要知道 ip 就可以了，因为服务器又不会跑，ip 就这个了。

但是 p2p 连接就不同，一般来说一个用户不会拥有外网 ip。

不用独立的外网 ip 就能访问外网的方法便是 NAT 技术。

发出的请求会在路由器做映射，最后由一个统一的外网 ip 发出。

例如你的 ip 是 192.168.2.2，端口 2333 发出请求，到路由器会给你作出映射 123.123.123.123:123

结果是 192.168.2.2:2333 -> 123.123.123.123:123

到另一边是 23.23.23.23:23

假如我是对称型 NAT

两个客户端交流就要穿透 NAT

http://zyearn.github.io/blog/2014/07/19/how-p2p-in-symmetric-nat/

NAT 穿透失败恐怕不少 switch 玩家见过

nat 详解
https://www.bilibili.com/read/cv359009/

nat3 每一个来自相同内部 IP 与 port 的请求到一个特定目的地的 IP 地址和端口，映射到一个独特的外部来源的 IP 地址和端口。

nat3 是你可以主动找别人，但是别人找不到你，那么问题来了，为什么 nat1 可以和 nat3 连呢？

原因 p2p

NAT 类型 https://blog.csdn.net/mycloudpeak/article/details/53550405
https://www.zhihu.com/question/308717206

最惨的情况 运营商甚至都没有公网 ip

### UDP 打洞！

https://www.zhihu.com/question/20436734

### 热点？

热点反而是我最稳定的联机手段，因为每次开关数据连接都会分配不同线路，自测荣耀战魂 nat3 在尝试几次之后可以拿到 nat1 的线路

## DMZ

## UPnP

## MTU

## DNS

## VPN
