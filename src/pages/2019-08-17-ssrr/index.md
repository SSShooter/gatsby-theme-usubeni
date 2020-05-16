---
path: '/ssrr'
date: '2019-08-17T13:21:22.282Z'
title: '关键字 GCP SSRR'
tags: ['coding']
---

之前一直在用（大概是原生的）[SS 科学上网](/2017-07-26-aws-ss/)没有什么大问题，但不知道为什么最近发现 4g 流量科学上网有点卡，偶尔接触到 SSRR，发现速度快了不少呢，于是就把 gcp 上的 ss 换成 ssrr 了，感觉不错。

现在一看，其实 ss 也去世也很久了，甚至连 ssr 都去世了，使用后继项目也是有必要的，可能加入了一些新的加密混淆方式可以让阻挡难度提高吧...

至于怎么用上 ssrr，也有十分简单的方法，跑个 .sh 就完事了。

```
wget --no-check-certificate https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocksR.sh
chmod +x shadowsocksR.sh
./shadowsocksR.sh 2>&1 | tee shadowsocksR.log
```

启动：`/etc/init.d/shadowsocks start`

停止：`/etc/init.d/shadowsocks stop`

重启：`/etc/init.d/shadowsocks restart`

状态：`/etc/init.d/shadowsocks status`

配置文件路径：`/etc/shadowsocks.json`

日志文件路径：`/var/log/shadowsocks.log`

代码安装目录：`/usr/local/shadowsocks`

其他细节可以看[这里](https://github.com/iMeiji/shadowsocks_install/wiki/shadowsocksR-%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85)。

当然你还要注意把防火墙相应端口开了（这里默认你们都知道怎么开啦）

不过这段代码的作者似乎也放弃再搞这方面的事情...不过一位大佬倒下，还有...

PS 顺便也提一下很久之前用过的 [streisand](https://github.com/StreisandEffect/streisand)。名字来源于史翠珊效应，功能也是跑脚本给你啪啦啪啦装一大堆工具，然后你就能用各种各样的方式科学上网...emmmm 好处就是一个服务崩了可以用另一个服务，但是感觉还是太重了点，没什么必要。

PPS 最重要的放在后面，GFW 不妨碍这么一个事实，我爱中国 😘
