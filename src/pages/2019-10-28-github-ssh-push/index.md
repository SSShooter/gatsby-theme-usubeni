---
path: '/github-ssh-push'
date: '2019-10-28T18:35:23.354Z'
title: '水·系列 让 GitHub 命令行操作免密'
tags: ['coding', '技术水']
---

苦于每次 push、pull 都输密码，真的太烦，虽然文题写是 GitHub，其实所以 git 系统都应该是通用的，看网上不少教程步骤好像挺多的，自己试了一下，似乎三步就达成目标了，顺便记下来，下次就懒得百度筛选信息了。

## 生成密钥

```
ssh-keygen -t rsa -C email@host.com
```

## 复制公钥到 GitHub

公钥在这里 ⬇️

```
~/.ssh/id_rsa.pub
```

复制到 GitHub 配置里的 SSH keys -> new SSH key 里

## 远端改用 ssh 协议

clone 的时候可以选择使用 ssh 协议，clone 地址大概是这样的 ⬇️

```
git@github.com:node-modules/parameter.git
```

如果你本来是以 https clone 的话要改成 ssh，只需要在本地仓库运行 `git remote set-url origin git@github.com:xxx/yyy.git` 即可。

完事可以用 `git remote -v` 检查一下，接着就能免密操作了
