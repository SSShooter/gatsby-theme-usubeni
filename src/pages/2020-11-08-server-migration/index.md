---
path: '/server-migration'
date: '2020-11-08T15:03:31.601Z'
title: '双十一的数据迁移'
tags: ['diary']
---

上年双十一在腾讯云薅的 88 块 1c2g1m 小玩具过期了，当时打算买来玩玩，到期就随它去，结果现在还是有点东西需要迁移，为了避免明年的麻烦，今年直接买了 288 三年。

此次迁移顺便复习了一下几个月没碰过的 docker。迁移涉及到两个 docker 镜像，其中一个就只是一些运行在 node 的函数，数据都在 MongoDB 的 Atlas 里，所以轻松转移。

另一个是 dokuwiki，遇到的问题就比较多了。首先是权限，旧服务器迁移来的**文件权限**不对，折腾了一下。然后是镜像版本升级了，**新旧版本不兼容**导致直接迁移导致无法运行，结果最后还是用回旧镜像，反正也不需要什么新功能。

这时我顿时反思，这维基根本没什么用，明明 dokuwiki 可以直接用手机更新，结果还是写博客的多（要在电脑提交到 github 更新）。甚至在需要短短几句话记事的时候，即使用有道云笔记也不用自己的维基，可能是因为那个维基样式始终不太合眼吧 😂 有空再改一改吧……

```yml:title=docker-compose.yml
version: '2'
services:
  dokuwiki:
    image: 'docker.io/bitnami/dokuwiki:20180422'
    ports:
      - '80:8080'
      - '442:8443'
    volumes:
      - 'dokuwiki_data:/bitnami/dokuwiki'
volumes:
  dokuwiki_data:
    driver: local
```

最后是把 nginx 的配置和 HTTPS 证书搬过来，这个过程比较顺利。

其中常用指令有：

```bash
nginx
nginx -t
nginx -s reload
```

至于 https 的 nginx 配置，忘了当时在哪抄来的，不过挺好用的：

```conf:title=nginx.conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
# pid /var/run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        #SSL 访问端口号为 443
        listen 443 ssl;
        #填写绑定证书的域名
        server_name server.name;
        #证书文件名称
        ssl_certificate 1_server.name_bundle.crt;
        #私钥文件名称
        ssl_certificate_key 2_server.name.key;
        ssl_session_timeout 5m;
        #请按照这个协议配置
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        #请按照这个套件配置，配置加密套件，写法遵循 openssl 标准。
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
        location / {
            #防止ip地址记录错误
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Real-Port $remote_port;
            proxy_set_header X-Forwarded-For $remote_addr;
            #网站主页路径。此路径仅供参考，具体请您按照实际目录操作。
            proxy_pass http://127.0.0.1;
        }
    }
}
```

（证书放在 conf 文件同级目录）
