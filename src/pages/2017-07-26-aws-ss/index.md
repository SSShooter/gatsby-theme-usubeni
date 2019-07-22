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

### 先来一个一句命令搞定的方法！不行再接着看！

有可能需要先 `apt-get update`

**`sudo yum install python-pip -y && sudo pip install shadowsocks && sudo /usr/local/bin/ssserver -p 8388 -k password123 -m rc4-md5 --user nobody -d start`**

**`sudo apt-get update && sudo apt-get install python-pip -y && sudo pip install shadowsocks && sudo /usr/local/bin/ssserver -p 9001 -k password123 -m rc4-md5 --user nobody -d start`**

#### 不行就接着看下面

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
例如我这边是  
`sudo /usr/local/bin/ssserver -p 8388 -k password123 -m rc4-md5 --user nobody -d start`

## 第四步 在 aws 后台添加端口

顺序
安全组 → 操作 → 添加入站规则
端口 8388 来源任何

## 第五步 客户端连接

## 第六步 去爽

## PS

### 停止操作 

sudo ssserver -d stop

### 转换为 http 代理

```bash
# macos 就是 brew 了
apt-get install polipo
service polipo stop
polipo socksParentProxy=localhost:1080

export http_proxy="http://localhost:8123"
export https_proxy="http://localhost:8123"
```

http 代理端口默认是 **8123**。