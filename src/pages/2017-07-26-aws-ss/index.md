---
path: '/aws-ss'
date: '2017-07-26T08:00:00.000Z'
title: '关键字 aws ss 科学上网'
tags: ['coding']
---

**这是一个穿越时空的补档**

## 第一步 获得一个新的 aws 账号

注意点

- 你要有一台手机
- 你要有一张信用卡
- aws 地址在[这里](https://aws.amazon.com)

## 第二步 新建一个 EC2

注意点

- 注意右上角选服务器位置
- 连接远程服务器官网有教程，照做，也很简单

## 第三步 安装 shadowsocks

### 安装 pip

`apt-get install python-pip`或者`sudo yum install python-pip`
(反正有权限问题就加 sudo 吧)

### 安装 ss

`sudo pip install shadowsocks`

### 启动 ss

`sudo ssserver -p 8388 -k password123 -m rc4-md5 --user nobody -d start`
详细参数可以参考 ssserver -h

### 注意

如果上面出现找不到 ssserver 或者 pip 的话，用`whereis ssserver`就能得到程序的位置，在查询得到的位置运行即可

## 第四步 在 aws 后台添加端口

顺序
安全组 → 操作 → 添加入站规则
端口 8388 来源任何

## 第五步 客户端连接

`sudo sslocal -s 你的ip -p 你的端口 -k 你的密码 -m 你的加密方式`

或使用图形客户端

## 第六步 去爽
