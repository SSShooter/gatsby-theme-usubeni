---
path: '/cancel-ajax'
date: '2022-06-23T16:09:46.189Z'
title: 'Ajax 怎么取消？要不要取消？'
tags: ['coding', 'Ajax']
description: '一起了解一下如何利用 AbortController 取消 Ajax 请求，但是，cancel 请求真的有用吗？取消还是不取消，这是个问题。'
---

## Ajax cancel

假如你熟悉 `xhr`，会知道 Ajax 其实可以前端主动取消，使用的是 `XMLHttpRequest.abort()`。当然现在也不是刀耕火种的时代，除了面试，可能基本不会手写 `xhr`，在无人不知的 `axios` 中有两种取消方法：

首先是老式 cancelToken：

```javascript
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios
  .get('/user/12345', {
    cancelToken: source.token,
  })
  .catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message)
    } else {
      // handle error
    }
  })

axios.post(
  '/user/12345',
  {
    name: 'new name',
  },
  {
    cancelToken: source.token,
  }
)

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.')
```

然后是新玩意（其实也不新）AbortController：

```javascript
const controller = new AbortController()

axios
  .get('/foo/bar', {
    signal: controller.signal,
  })
  .then(function (response) {
    //...
  })
// cancel the request
controller.abort()
```

cancelToken 和 signal 传到 axios 之后，都会以某种机制调用 `XMLHttpRequest.abort()`。

```javascript
onCanceled = (cancel) => {
  if (!request) {
    return
  }
  reject(
    !cancel || cancel.type ? new CanceledError(null, config, request) : cancel
  )
  request.abort()
  request = null
}

config.cancelToken && config.cancelToken.subscribe(onCanceled)
if (config.signal) {
  config.signal.aborted
    ? onCanceled()
    : config.signal.addEventListener('abort', onCanceled)
}
```

cancelToken 是利用发布订阅模式通知 axios 取消请求，虽然这部分是 axios 自己实现的，但是源自于一个 tc39 提案 [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises)，不过这个提案被废弃了。

而 AbortController 是已经可以在浏览器使用的接口，顾名思义，这就是一个专门用于中止行为的控制器。[mdn](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 的举例用的也是 Ajax 请求，不过是至潮至 in 的 fetch，从中可见 axios 跟 fetch 的实践是一致的：

```javascript
function fetchVideo() {
  controller = new AbortController() // 新建一个 controller
  const signal = controller.signal
  fetch(url, { signal }) // 在 fetch 方法传入 signal
    .then(function (response) {
      console.log('Download complete', response)
    })
    .catch(function (e) {
      console.log('Download error: ' + e.message)
    })
}

abortBtn.addEventListener('click', function () {
  if (controller) controller.abort() // 调用 controller.abort 取消 fetch
  console.log('Download aborted')
})
```

## AbortController 的其他用途

当然 AbortController 不只有中止 Ajax 一个功能，通过查看 [dom 规范文档](https://dom.spec.whatwg.org/)还能看到两个使用示例：

一个比较实用的例子是用 AbortController 取消事件监听：

```
dictionary AddEventListenerOptions : EventListenerOptions {
  boolean passive = false;
  boolean once = false;
  AbortSignal signal;
};
```

通过向 `AddEventListener` 传入 `signal`，运行 `abort()` 即可**取消事件监听**，这个方法对**匿名**回调函数尤其有用。

另一个例子是用于**中止 promise**。这是一个比较简洁且自文档的方法……不过其实实现这个功能也不是非要 AbortController 才能做到，只要想办法拿到 promise 的 `reject` 就好了。我觉得这个例子的重点偏向于学会使用 signal 的 onabort：

```javascript
const controller = new AbortController();
const signal = controller.signal;

startSpinner();

doAmazingness({ ..., signal })
  .then(result => ...)
  .catch(err => {
    if (err.name == 'AbortError') return;
    showUserErrorMessage();
  })
  .then(() => stopSpinner());

// …

controller.abort();

function doAmazingness({signal}) {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();

    // Begin doing amazingness, and call resolve(result) when done.
    // But also, watch for signals:
    signal.addEventListener('abort', () => {
      // Stop doing amazingness, and:
      reject(signal.reason);
    });
  });
}
```

总之，signal 就是个简易发信器，而且功能偏向于取消某操作。如果在某种情况下不想自己实现一个 pubsub 对象的话，用这个就完事了。

AbortController 的介绍就到此为止吧，不知道大家有没有逐渐忘记标题……最后是想讨论一下，取消 Ajax 到底有没有用？

## 取消还是不取消，这是个问题

事实上，这个 Ajax 取消只是前端自说自话，后端并不知道要中止，发过去的请求还是要执行的，后端没有特殊处理的话 10s 的请求你取消了后端也仍然在费劲地跑。

那么在一些文章中看到的“优化”，所谓“取消请求，只保留最后一个”是否真的有意义呢？

分情况讨论，对于 POST 等修改数据的请求，每次发送即使返回慢，服务器也已经在处理了，取消上一个 POST 再重复发一个无疑是弱智行为。

对于 GET，且仅针对某些极限操作，或许有一点效果，例如：获取一个超长 table，结果没拿到，然后用户就用搜索快速返回少量数据并且渲染了，等到超长 table 真正返回就会覆盖掉搜索的数据，这个情况 cancel 是真的有效的。另外还有下载上传的取消，不过估计也很少会用到。

最后再说一个有道理但是事实上也是没什么用的好处：cancel 之后能**省一个请求位置**，毕竟浏览器一个域名的同时请求数量是有限制的，更多情况下，比 cancel 更常见的 timeout 更实用。嗯……除非同时排着五六个超慢请求，否则轮转还是比较快的……

个人建议是，说到底这个所谓“取消”都是极特殊情况的特殊处理，知道这回事就好了，没有必要没事就在拦截器里整个取消操作。

## 参考

- [dom spec](https://dom.spec.whatwg.org/)
- [GitHub axios](https://github.com/axios/axios)
- [mdn AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)