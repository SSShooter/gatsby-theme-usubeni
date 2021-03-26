---
path: '/vue-optimization'
date: '2021-03-23T09:53:29.360Z'
title: 'vue-optimization'
tags: ['coding']
released: false
---

## 拆分子组件

我也曾以为，拆分子组件是用于抽象，但实践告诉我，拆分子组件是提升性能的一种方式（特定情况）。

在我的实际工作中遇到这么个问题，有一个很大的表格，里面有多个新增条目的对话框，当数据很多的时候，填写新增数据都会变卡。

原因就是，在一个组件里，修改值会造成整个组件的数据检查和 diff。但是明知道大表单什么都没改，我还要浪费时间检查个啥呢？

为了解决这个问题，把对话框单独抽出来就成了十分有效的优化方法。

在子组件更新时，默认是不会触发父组件更新的，除非子组件改变了父组件的数据。

我就以 element UI 的 dialog 举例吧：

[打开此链接](https://codesandbox.io/s/child-component-optimization-q8m1c?file=/src/components/HelloWorld.vue)直接打开可运行事例

写一个页面，里面包含两个 dialog，一个是直接写到页面中，另一个抽象为组件。

```html
<template>
  <div>
    <el-button type="text" @click="dialogVisible = true"
      >点击打开 Dialog</el-button
    >
    <el-button type="text" @click="dialogData.visible = true"
      >点击打开 Dialog2</el-button
    >
    <div>{{ renderAfter() }}</div>
    <el-dialog
      :append-to-body="true"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-input v-model="xxx" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <my-dialog :dialogData="dialogData" />
  </div>
</template>

<script>
import MyDialog from "./Dialog";
export default {
  components: { MyDialog },
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      xxx: "",
      dialogVisible: false,
      dialogData: {
        visible: false,
      },
    };
  },
  methods: {
    renderAfter() {
      if (!window.renderCountTech) window.renderCountTech = 1;
      else window.renderCountTech++;
      console.log(
        "%c渲染函数检测",
        "color:#fff;background:red",
        window.renderCountTech
      );
    },
  },
};
</script>
```

以下是 dialog 组件的内容：

```html
<template>
  <el-dialog
    :append-to-body="true"
    title="提示"
    :visible.sync="dialogData.visible"
    width="30%"
  >
    <el-input v-model="xxx" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogData.visible = false">取 消</el-button>
      <el-button type="primary" @click="dialogData.visible = false"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["dialogData"],
  data() {
    return {
      xxx: "",
    };
  },
};
</script>
```

实践可知，在 dialog 的输入框修改数据时，会触发整个组件的渲染函数，而在 dialog2 输入时则不会。在对话框所在组件的数据量少的话确实差别不大，但是量大的时候在对话框输入的时候会有可感知的卡顿。

而且即使这个组件不复用，也可以把对话框用到的方法分离到单独文件，不用和主页面的方法混到一起。

不过缺点当然也有：

首先，数据交互有点不方便，不过总能活用 `$parent` 和 Vuex 等方式解决。

第二个问题是修改 `dialogData.visible` 时会报错 `Unexpected mutation of "dialogData" prop. (vue/no-mutating-props)`。

作为 Vue 的最佳实践，父给子的 prop 不得由子直接修改。我的观点是如果你知道自己在做什么，而且副作用不强的话……这样做大概也无妨，不知道大家的意见如何呢？

如果坚持最佳实践，有两个方案：

### sync

可以使用 `sync`，多些几句代码：

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

这么写等于：

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

然后再在子组件通过 `this.$emit('update:title', newTitle)` 更新父组件。

### 用引用操作值

也就是 visible 直接就不由父传入了，而是让子直接管理 visible 变量，然后父直接修改子的数据：

```javascript
this.$refs.child.visible = true
```

反过来呢？你也可以在子里修改父（这就不算是修改 prop 了，奇技淫巧）

```javascript
this.$parent.visible = true
```

## 造自己的轮子

造轮子听得多，但是对我来说，我不愿意做一个大家都适用的轮子。

因为，每个人的需求都是不同的，如果要做一个满足所有人的要求的轮子，这个轮子就会变得很重，我个人不太愿意看到……

所以我希望做的“轮子”是一个轻量化的，满足最小功能要求的“框架”，这样大家修改也方便，同时也不必担心随着不断更新越来越重。

例如 v-vld


## 单向绑定甚至完全不绑定

[MDN Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)



https://juejin.cn/post/6922641008106668045
