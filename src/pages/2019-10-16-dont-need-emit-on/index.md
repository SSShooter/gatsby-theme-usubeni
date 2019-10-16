---
path: '/dont-need-emit-on'
date: '2019-10-16T13:36:10.706Z'
title: '[Vue] 有时候你不需要 $emit & $on'
tags: ['coding', 'Vue']
---

在此之前，子组件到父组件的传递事件我一般还是使用 `$emit` 和 `$on`，因为这个操作理解起来并不难，代码一般也挺清晰。

不过今天遇到这么个情况 ——

```html
<div class="button-group">
  <button @click="item.reply = !item.reply">
    {{item.reply?'取消回复':'回复'}}
  </button>
  <button @click="item.editing = !item.editing">
    {{item.editing?'取消修改':'修改'}}
  </button>
  <button @click="removeComment(item.id)">删除</button>
</div>
<CommentInput
  v-if="item.reply"
  @submit="item.reply = false"
  :lxid="lxid"
  :parentId="item.id"
/>
```

这是一个评论组件的一部分，`button-group` 是回复、修改、删除 3 个按钮，点击回复的话下面的 `CommentInput` 组件会显示。本来想着在那里操作就在哪里取消，但是写完了，产品大人一看，表示不行，按钮不能在上面，应该统一放在评论内容和输入框的下方，不妥协。

心想又要加 `$emit` 和 `$on` 虽然麻烦，但不是难事，不过 `CommentInput` 本来还会复用到其他地方，只有这里需要“取消回复”功能，这又要做一层判断，为了代码简洁这个实现还要好好想想。结果灵感就来了 —— **使用 `slot`**。

```html
<div class="button-group">
  <button @click="replyToggle(item)">回复</button>
  <button
    v-if="loginInfo.operatorname === item.authorName"
    @click="editToggle(item)"
  >
    {{item.editing?'取消修改':'修改'}}
  </button>
  <button
    v-if="loginInfo.operatorname === item.authorName"
    @click="removeComment(item.id)"
  >
    删除
  </button>
</div>
<CommentInput
  v-if="item.reply"
  @submit="item.reply = false"
  :lxid="lxid"
  :parentId="parentId||item.id"
>
  <div class="button-group">
    <button @click="replyToggle(item)">取消回复</button>
  </div>
</CommentInput>
```

`slot` 本身还是很常用的，只是第一次主动意识到使用 `slot` 可以显著解决事件传递问题。直接把取消回复按钮用 `slot` 嵌入 `CommentInput`，直接使用父组件的 `replyToggle` 方法，免去重新写 `$emit` 和 `$on` 的麻烦，顺便还解决了其他地方不需要“取消回复”的问题，十分有效！

**其实感觉 slot 就像一个闭包，带上了父组件的一切，栖身于子组件。**

希望这个分享能给大家一点灵感

PS: 突然想起我坑了一万年的博客评论组件现在依然还坑着……
