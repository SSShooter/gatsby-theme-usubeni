---
path: '/site-build'
date: '2019-11-04T17:10:55.863Z'
title: '建站相关问题'
tags: ['建站']
---

## 备案

### 备案的必要

> 如果网站域名没有办理备案就解析到腾讯云的服务器上，将被腾讯云阻断并跳转到固定页面，提醒您尽快完成备案。若需要搭建网站，请先完成网站备案再开通网站。 --腾讯云备案概述

所以如果你**使用国内的主机**，就必须备案，这跟域名提供商没有关系。在国内买域名绑香港和国外机器都不用备案。

### 备案注意点

- 你的网站**通过域名**正式提供对外访问前才需要备案

这里引出两个问题，1.你用 IP 访问还是可以的，2.不用 80 和 443 端口访问也是可以的

- 只需要备案顶级域名
- 更换接入商（主机提供商）需要在新平台备案
- 不做经营性备案时 IP 变更不需要重新备案

所以到底备案是给地址备案还是给机备案呢？

我的个人理解是，一个备案操作同时备案地址和主机，域名换了一定要重新备案，主机换了如果不涉及经营性质可以不重新备案。

> 备案成功后，通信管理局会分配主体备案号给备案主体（个人或单位均可称为主体），同时也会给此次备案的网站分配网站备案号。
> 主体备案号格式为：省简称 ICP 备 主体序列号
> 网站备案号格式为：省简称 ICP 备 主体序列号-网站序列号

参考链接：

[腾讯云文档](https://cloud.tencent.com/document/product/243/19630)

## https

### 证书

基本几个云平台都可以申请免费证书。

### 配置

- DNS 解释域名到主机 IP（A）
- 安装 nginx
- 配置 nginx

**提示不安全**：证书的域名要包含子域名，否则域名和证书对不上就会提示不安全。

[Nginx 配置 HTTPS 服务器](https://aotu.io/notes/2016/08/16/nginx-https/index.html)

[腾讯云文档](https://cloud.tencent.com/document/product/400/35244)