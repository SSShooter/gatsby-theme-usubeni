---
path: '/how-does-vue-work-4'
date: '2021-07-20T13:33:52.561Z'
title: 'how-does-vue-work-4'
tags: ['tag']
released: false
---

整体流程

hydrate

When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive. (This process is called hydration.) -- from Learn | Next.js

initMixin(Vue$3); // 链入 _init
stateMixin(Vue$3); // $set, $watch 等
eventsMixin(Vue$3); // $on, $once 等
lifecycleMixin(Vue$3); // _update, forceUpdate 等
renderMixin(Vue$3); // _render 等

// expose real self
vm._self = vm;
initLifecycle(vm);
initEvents(vm);
initRender(vm); // 整好 slot 和 createElement 函数
callHook(vm, 'beforeCreate');
initInjections(vm); // resolve injections before data/props
initState(vm); // 处理 props data computed watch
initProvide(vm); // resolve provide after data/props
callHook(vm, 'created');

https://www.zhihu.com/question/66068748