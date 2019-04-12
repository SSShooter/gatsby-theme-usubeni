---
path: '/日记'
date: '2019-04-08T21:38:57.575Z'
title: '日记'
tags: ['diary']
---

## 一些心情

第一季度总结的 deadline 都来了，才回过神来 9102 又已经过了四分之一。

<div class="box27 inline-block">
    <span class="box-title">薄荷</span>
    <pre>神様がくれた時間は零れる
あとどれくらいかな</pre>
</div>

可以的话，请真的过得慢一点吧😭

最近因为部门预算问题转移了部门，拖了一星期没分配任务

闲得陷入了一个不可名状的漩涡，总感觉被时间追赶着

玩游戏的时候不自在，出去玩的时候不自在

唯独学习能给我一丝温暖...这不是开玩笑的

感觉这已经是病态了，但是再不学就更学不动了

每到这个时候都好后悔

看着各位刚上大学技术就超强的大佬，一种无力感往心里涌

我该不会才 25 岁就提前进中年恐惧症了吧😂

## 博客系统

博客开起来才发现静态评论不怎么行，互动性太低了，每次评论都要重新 deploy，然后没有回复提醒，并且当时连回复评论这个功能也都没有做。

不是很想魔改 staticman 了，用 egg.js 框架自己搞一个也不难，差不多也该动手了。

在 mongodb 评论表的结构上想了挺久，一开始构想的是无限嵌套的评论（一层一层地回复），总觉得即使可以实现也慢得不要不要的，一定有什么地方不对。

接着上新浪微博看了一下，表面上评论也就分“评论”和“子评伦”两种，

那我不管实际上新浪怎么做了，我的思路已经有了：

创建的时候没有传入父评论，那么这就是一个“评论”，他有一个“回复”属性，是一个子评论数组；

如果传入父评论 id，那么这就是一个“子评论”，传入父评论 id 同时还要传入回复对象的名字，那按时间顺序排下来自然就知道回复的是哪句话了，基本消除了歧义。

至于什么时候实现...再看看吧🐷

## 游戏

尽管我周围（各种群组）充满了碧蓝幻想，但是我发现很少开博客的骑空士，我哭了😥

最近蚕食我时间的游戏除了碧蓝幻想就是 P5 了（是的我现在才玩😂），是游戏流程太长，还是我太浮躁（