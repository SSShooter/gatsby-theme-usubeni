---
path: '/docker-data-management'
date: '2020-02-22T18:29:34.249Z'
title: '初识 docker volume'
tags: ['coding', 'docker']
---

第一次看到 volumes 这个参数是在一个[维基镜像](https://hub.docker.com/r/bitnami/dokuwiki)的 `docker-compose.yml` 文件：

```yaml
version: '2'
services:
  dokuwiki:
    image: 'bitnami/dokuwiki:0'
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - 'dokuwiki_data:/bitnami'
volumes:
  dokuwiki_data:
    driver: local
```

（前置知识 yaml 语法，详细解释可以看一下阮一峰的 [YAML 语言教程](http://www.ruanyifeng.com/blog/2016/07/yaml.html)，TLDR 其实主要两个重点：1 是缩进代表层级结构，2 是同级的 `-` 代表数组结构。）

据文档所讲 volumes 用于**数据持久化**，但是第一次看这个配置是完全不懂什么意思，于是我对自己提出了一些问题：

- dokuwiki_data:/bitnami 是什么意思？
- 外面一层的 volumes 又是什么？
- volume 的文件在哪？
- volume 挂载后两边的数据怎么同步？

为了回答这几个问题，当然是要去翻官方文档了，主要内容在这两个页面：[Manage data in Docker](https://docs.docker.com/storage/) 和 [Use volumes](https://docs.docker.com/storage/volumes/)。

## docker volume 命令

这是 docker 本身的 volume 命令：

```bash
docker volume create dokuwiki_data
```

对应上面 `docker-compose.yml` 的外层 volumes，这就回答了第二个问题。

外面的 volumes 用于创建一个名为 dokuwiki_data 的 volume。

## docker run 的 -v 参数

```bash
docker run -d \
  --name devtest \
  -v myvol2:/app \
  nginx:latest
```

拓展阅读：[docker run 文档](https://docs.docker.com/engine/reference/run/#volume-shared-filesystems)

`docker run` 是运行镜像的指令（等于 `docker container run`），在使用 `-v` 参数后指定了 volume 相关设置。

```
-v, --volume=[host-src:]container-dest[:<options>]: Bind mount a volume.
The comma-delimited `options` are [rw|ro], [z|Z],
[[r]shared|[r]slave|[r]private], and [nocopy].
The 'host-src' is an absolute path or a name value.

If neither 'rw' or 'ro' is specified then the volume is mounted in
read-write mode.

The `nocopy` mode is used to disable automatically copying the requested volume
path in the container to the volume storage location.
For named volumes, `copy` is the default mode. Copy modes are not supported
for bind-mounted volumes.

--volumes-from="": Mount all volumes from the given container(s)
```

上面例子中的 `myvol2:/app` 是把一个**名为** myvol2（这是一个 volume 名称，你也可以在这里使用绝对地址）的 volume 挂载（mount）到容器的 `/app` 目录。

现在回答最上面的第一个问题，`docker-compose.yml` 中 dokuwiki 下的 volume 的值 `'dokuwiki_data:/bitnami'` 就是直接代入 `-v` 的，那么答案就很明确了：

把 `dokuwiki_data` 这个 volume 挂载到容器中的地址 `/bitnami`。

## volume 所在

volume 在哪这个问题在没看文档之前很是迷惑。一开始以为 `/root/xxx:/app` 这么写的话文件就在根目录的 xxx 里，结果当然是怎么找不到。

然而实际上 volume 是处于 docker 管理下的 volumes 目录（差不多是这样的 `/var/lib/docker/volumes/`）。这么做其实可以有效保护你的主机中的机密文件，毕竟挂载到容器的话，数据就可以全盘读取了。如果上面挂载的时候使用的是绝对地址，就可能存在重要系统重要数据被读取的问题。

`docker volume ls` 字面意思就是列出你所有的 volume，如果你实在不知道 volume 的准确位置，你可以使用 `volume inspect`，`Mountpoint` 就是某个 volume 的准确位置：

```
$ docker volume inspect my-vol
[
    {
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my-vol/_data",
        "Name": "my-vol",
        "Options": {},
        "Scope": "local"
    }
]
```

于是回答第三个问题：数据一般储存在 `/var/lib/docker/volumes/`，如果找不到这个目录，可以使用 `volume inspect` 查询具体位置。

## volume 怎么运作

这个也是初见 volume 的大疑惑，不过在阅读文档后就很清晰了：

- 如果你挂载了一个**空的 volume** 到某个容器目录，而那个容器目录里又存在文件，那么，**会先把容器目录里的文件先自动复制（propagate）到 volume 目录**，这样就把容器里面本来应有的文件填充到了主机的 volume。而如果容器中不存在那个目录，会自动创建。
- 如果你挂载了一个**非空 volume**，那么容器目录里原有的文件会被遮蔽（obscured） 。关于这个遮蔽，也就是把 volume 挂载到容器目录之后，目录本来的内容不会被删除或修改，但是你在访问那个目录的时候等于直接访问挂载目标。（个人理解，另外官网使用了 Linux 系统的 `/mnt` 目录作例子）

根据这两条信息，回答第四个问题：**一旦使用 volume，那数据就以 volume 内容为准**，volume 在开始为空的情况下容器内容会被先复制到 volume，保证初始内容正确，然后程序运行也会直接改变 volume 数据。在实际使用上，把这个修改完的 volume 直接搬运到其他环境再挂载进去就完全没有问题了。

## 不止如此

当然 volume 不止这么点功能，例如他还能被设置为只读、设置远程 volume 还有备份和恢复等等。而且数据持久化也不止 volume 一个方法，例如 Bind mount 和 `tmpfs` mount。知识总是学不完的，如果以后用到，再另作总结吧。

![](https://docs.docker.com/storage/images/types-of-mounts-volume.png)
