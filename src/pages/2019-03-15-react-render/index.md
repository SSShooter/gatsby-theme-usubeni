---
path: '/react-render'
date: '2019-03-16T10:15:50.342Z'
title: 'React 渲染优化：diff 与 shouldComponentUpdate'
tags: ['coding', 'react']
---

我曾经对 shouldComponentUpdate 的用途不解。react 的卖点之一，是通过 diff 虚拟节点树，减少对真实节点的操作，所以我以前以为既然 diff 了，那就自然知道节点有没有更新了，diff 是根据 setState 的内容进行的，那 shouldComponentUpdate 有什么用呢？

然而我以前的理解是完全错误的，造成这个疑问的原因便是对 React 渲染流程的不熟悉。从头说起。

## setState

你修改了数据，需要 React 重新渲染页面，让你的新数据展示在页面上，需要借助 `setState` 方法。

**`setState` 调用后，组件的 `render` 方法也会自动调用**，这就是为什么你能在页面看到新数据。但是无论你 `setState` 修改的是什么，哪怕是页面里没有的一个数据，`render` 都会被触发，并且父组件渲染中会嵌套渲染自组件。

```javascript
class Nest extends React.Component {
  render() {
    console.log('inner')
    return <div>Nest</div>
  }
}

class App extends React.Component {
  render() {
    console.log('outer')
    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              anything: 1,
            })
          }}
        >
          setState
        </button>
        <Nest />
      </div>
    )
  }
}
```

所以在这个例子中，点击按钮，即使修改的 anything 根本没有出现，甚至没有定义，render 函数还是如期运行。每次点击按钮，上面的代码会先输出 outer，然后输出 inner。

## render

render 生成的是什么呢？一般来说大家都是写 jsx，所以视觉上是一个“dom”，但是实际上，官网也在显眼的位置告诉你，这其实是一个函数。

```javascript
// jsx
const element = <h1 className="greeting">Hello, world!</h1>
// babel 转换为浏览器能运行的函数
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
)
```

而因为 React 的组件层层嵌套，render 函数会生成一棵描述应用结构的节点树，并保存在内存中。在下一次渲染时，新的树会被生成，接着就是对比两棵树。

## diff

官方一点的定义应该称为 **reconciliation**，也就是 React 用来比较两棵节点树的算法，它确定树中的哪些部分需要被更新。

在确定两棵树的区别后，会根据不同的地方对实际节点进行操作，这样你看到的界面终于在这一步得到了改变。当年 React 也就因为这个高效的 dom 操作方法得到追捧。

## shouldComponentUpdate

终于说到 `shouldComponentUpdate`，他是一个组件的方法，**用于拦截组件渲染**。让我们用例子解释所谓“拦截渲染”。

```javascript
class Nest extends React.Component {
  shouldComponentUpdate = () => {
    // <---- 注意这里
    return false
  }
  render() {
    console.log('inner')
    return <div>Nest</div>
  }
}

class App extends React.Component {
  render() {
    console.log('outer')
    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              anything: 1,
            })
          }}
        >
          setState
        </button>
        <Nest />
      </div>
    )
  }
}
```

跟之前的例子差不多，不过当我们在子组件添加 `shouldComponentUpdate` 后，再点击按钮，结果是 ————

没错，子组件的渲染函数并没有调用，借助 `shouldComponentUpdate` 返回 `false`，成功拦截了子组件的渲染。

当然一般不会这么做，因为永远返回 false 的话这个组件（当然因为渲染函数没有运行，所以包括其所有子组件都是不会更新的）就永远不会更新了。

常用操作是，在 `shouldComponentUpdate` 判定该组件的 props 和 state 是否有变化，就像这样：

```javascript
class Nest extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    )
  }
  render() {
    console.log('inner')
    return <div>Nest</div>
  }
}
```

这样可以**浅比较** props 和 state 是否有变化，至于为什么不深比较？因为那样效率可能会比直接全都运行 render 还低...

因为上面的操作太常见，React 直接为我们提供了 PureComponent：

```javascript
class Nest extends React.PureComponent {
  render() {
    console.log('inner')
    return <div>Nest</div>
  }
}
```

使用 PureComponent 的效果就与上面浅比较一样，并且省掉了 shouldComponentUpdate。

## 什么时候用？

~~PureComponent 能提高性能！所以直接用 PureComponent 代替所有 Component！~~

这当然是错的。

对于明知道**不**需要修改的组件，肯定直接返回 false。而可能你没想到，对于明知道**需要修改**的组件，也请不要使用 PureComponent。

因为正如上面所说，PureComponent 需要进行两次浅比较，而浅比较也是要时间的，若是你明知道这个组件百分百要修改，何必浪费时间去对比呢？

所以 PureComponent 请用在**较少进行修改**的组件上。

## 总结

还是对实际情况模糊的话可以来这里玩玩：[playground](https://codesandbox.io/s/react-playground-forked-woj5t?file=/index.js)

总结一下以上内容，整个流程基本如下：

- setState 尝试触发视图更新
- 如果有 shouldComponentUpdate 就判断是否需要再 render，返回 true 运行 render，返回 false 就跳过该组件更新
- 运行 render 函数中，遍历所有子组件，针对每个子组件回到上一步
- 用 render 生成的虚拟节点树与原来的虚拟节点树比较（diff）
- patch 修改的节点

（在子组件返回 `false` 时，对虚拟节点树的处理方法我不太确定，是做一个不需要 diff 的标志？还是直接复制原来的节点树？）

本文部分存在个人理解，如果文中有不严谨的地方，请在评论区指出，谢谢大家的阅读。

PS. 在函数式组件中，你可以使用 [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) 产生 `shouldComponentUpdate` 的效果。

## 参考

- https://reactjs.org/docs/faq-internals.html
- https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action
- https://github.com/xitu/gold-miner/blob/master/TODO1/react-inline-functions-and-performance.md
- https://cdb.reacttraining.com/react-inline-functions-and-performance-bdff784f5578
