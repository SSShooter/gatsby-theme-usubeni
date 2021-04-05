---
path: '/readable-code'
date: '2021-04-05T11:11:16.159Z'
title: '可读代码的艺术'
tags: ['coding', '读书笔记']
---

**本文为 The Art of Readable Code by Dustin Boswell and Trevor Foucher 的读书笔记**

## 可读性的标准

能看懂的意思是能够改功能、加功能、debug，看懂所需时间越短越好。这甚至不一定是为了别人，如果你自己写出来的东西自己半年后都看不懂了，那就真的该反思一下了。

代码并不是越短越好，要衡量好可读性和简约的平衡。在需要使用忍者代码提高性能的时候，必须在注释写清除其含义。所以基本不用担心什么性能问题、结构问题，大多数时候都有兼顾可读性和良好性能和结构的办法。而最难的是：你要时刻注意这你写的代码到底好不好读。

## 变量名就是信息

- 更精准地描述一个动作，例如从服务器获取的内容，动词 Get 可以换成 Fetch 或 Download

```
send deliver, dispatch, announce, distribute, route
find search, extract, locate, recover
start launch, create, begin, open
make create, set up, build, generate, compose, add, new
```

- 不要用 `tmp` 和 `retval` 这样的通用词，尽管这确实可以让你知道这是“暂存值”和“返回值”，但是你本质上还是不知道这是啥啊！所以变量名不要流于表面，好好描述它真正的内容（除非你真的有更好的理由就是要用通用词）
- for 循环你可以用 `ijk` 表达多个循环，但是或许有理解成本更低的方法

`if (clubs[i].members[j] == users[k])` => `(clubs[ci].members[mi] == users[ui]`，这样更不容易取错值。

- 有时候需要更精准地描述一个名词

```
delay → delay_secs
password → plaintext_password
```

- 匈牙利命名法（PS.现在不多见了）
- 适度缩写，判断能不能用缩写最简单的办法就是问没看过这个项目的人第一眼懂不懂，例如大家都明白 FormatStr 是格式化字符串，但是不明白 BEManager 是个什么鬼 Manager
- 具体的名字（`CanListenOnPort()`）比抽象宽泛（`ServerCanStart()`）好
- 不同命名形式代表不同的变量“类别”，例如 const 全大写，类用帕斯卡，普通变量用驼峰

## 减少误解

作者的三个例子：

- filter 可以理解成“过滤掉 xxx”或“过滤得到 xxx”，建议改为 select 或 exclude（PS. filter 在前端领域感觉没什么异议）
- Clip(text, length) 可以理解成“剪掉后面 length 个字符”或“剪成 length 个字符的长度”，建议改为 Truncate
- limit 是否包含边界值容易引起误解，建议使用 max，同理还有 min

**在你决定使用一个名称时，要考虑它的二义性**

- 表示范围包含时可以使用 max、min
- 表示范围包含不边界时使用 begin、end
- 表示布尔值尽量使用 is、has，不要使用反直觉的否定词，如 disable_ssl
- 特定语言有特定含义的的方法需要注意，如 get()、size()

## 代码美学

- 代码格式化
- 同一类代码保持相同的“外形”

```java
// 外形不同
public class PerformanceTester {
 public static final TcpConnectionSimulator wifi = new TcpConnectionSimulator(
 500, /* Kbps */
 80, /* millisecs latency */
 200, /* jitter */
 1 /* packet loss % */);
 public static final TcpConnectionSimulator t3_fiber =
 new TcpConnectionSimulator(
 45000, /* Kbps */
 10, /* millisecs latency */
 0, /* jitter */
 0 /* packet loss % */);
 public static final TcpConnectionSimulator cell = new TcpConnectionSimulator(
 100, /* Kbps */
 400, /* millisecs latency */
 250, /* jitter */
 5 /* packet loss % */);
}

// 外形相同
public class PerformanceTester {
 public static final TcpConnectionSimulator wifi =
 new TcpConnectionSimulator(
 500, /* Kbps */
 80, /* millisecs latency */
 200, /* jitter */
 1 /* packet loss % */);
 public static final TcpConnectionSimulator t3_fiber =
 new TcpConnectionSimulator(
 45000, /* Kbps */
 10, /* millisecs latency */
 0, /* jitter */
 0 /* packet loss % */);
 public static final TcpConnectionSimulator cell =
 new TcpConnectionSimulator(
 100, /* Kbps */
 400, /* millisecs latency */
 250, /* jitter */
 5 /* packet loss % */);
}

// 另一种注释方法
public class PerformanceTester {
 // TcpConnectionSimulator(throughput, latency, jitter, packet_loss)
 // [Kbps] [ms] [ms] [percent]
 public static final TcpConnectionSimulator wifi =
 new TcpConnectionSimulator(500, 80, 200, 1);
 public static final TcpConnectionSimulator t3_fiber =
 new TcpConnectionSimulator(45000, 10, 0, 0);
 public static final TcpConnectionSimulator cell =
 new TcpConnectionSimulator(100, 400, 250, 5);
}
```

- 保持固定的顺序（PS. Vue 的[官方 option 顺序](https://vuejs.org/v2/style-guide/#Component-instance-options-order-recommended)）
- 用回车和注释将代码划分成块

PS.一个项目使用固定的代码风格很重要，JavaScript 基本是 eslint + prettier，最近学了 go 觉得官方直接给你定风格挺香的，也不用纠结配置

## 注释

注释是要让读者知道代码**在干什么**

### 注释雷区

如果变量名、方法命就能看明白那是什么，再加注释就是反效果。

如果你的变量名真的没有讲清楚他是干嘛的，那你应该优先考虑修改变量名而不是加注释。（更加说明变量名的重要性）

这是一个需要用到注释的例子：

```python
# remove everything after the second '*'
name = '*'.join(line.split('*')[:2])
```

不要为了注释而注释：

```c
// Find the Node in the given subtree, with the given name, using the given depth.
Node* FindNodeInSubtree(Node* subtree, string name, int depth);
```

尝试写添加实现细节：

```c
// Find a Node with the given 'name' or return NULL.
// If depth <= 0, only 'subtree' is inspected.
// If depth == N, only 'subtree' and N levels below are inspected.
Node* FindNodeInSubtree(Node* subtree, string name, int depth);
```

PS.go 语言就是强迫你为 export 的函数写注释，千万不要为了写而写呀，可以参考下标准库的注释：https://golang.org/pkg/#stdlib

### 记录你的想法

导演解说型，例如：

```
// Surprisingly, a binary tree was 40% faster than a hash table for this data.
// The cost of computing a hash was more than the left/right comparisons.
```

有些地方看似可以优化，但是自己已经实践得出并不能优化的结论，那就加上注释避免别人浪费时间。

标注代码瑕疵：

```
// TODO(dustin): handle other image formats besides JPEG
```

还有这些类型：

```
TODO: Stuff I haven’t gotten around to yet
FIXME: Known-broken code here
HACK: Admittedly inelegant solution to a problem
XXX: Danger! major problem here
```

这些注释同样应该遵循统一风格，这样全局搜索就能轻易找到不同类型的问题。

解释一些常量的设定原因：

```c
// Impose a reasonable limit - no human can read that much anyway.
const int MAX_RSS_SUBSCRIPTIONS = 1000;
```

### 想象读者需要知道什么

- 想象读者需要知道什么
- 记录容易错误的地方（PS.与记录你的想法讲的类似）
- 全局注释，以文件甚至文件夹为单位的全局解释，想象你的项目要移交给别人写的时候你要如何交接工作
- 用回车和注释将代码划分成块（PS.与代码美学讲的重复了）

## 简洁精炼的注释

- 上下文有多个对象时，避免使用代词，容易指代不清
- 为函数注释带上适当的例子
- 在描述做什么之上，再描述“意图”
- 用专业共识压缩注释

```c
// This class contains a number of members that store the same information as in the
// database, but are stored here for speed. When this class is read from later, those
// members are checked first to see if they exist, and if so are returned; otherwise the
// database is read from and that data stored in those fields for next time.

// 其实就是 ↓

// This class acts as a caching layer to the database.
```

## 简化逻辑

简化逻辑可不只是好看，代码混乱、逻辑不清晰也会导致 bug 难以发现。

### if

大家很熟悉单个变量和值比较 `if (length >= 10)`，但是如果是变量和另一个变量（或常量）呢？

```javascript
while (bytes_received < bytes_expected)
```

作者推荐把变量放在左边，这样比较符合人类语言习惯，例如：接受长度小于某个特定的值，而不是某个特定的值大于等于接受长度。

（这部分提了一下过时的“尤达记法”，有兴趣可以自己查一下。）

### if else

优先**把肯定的情况放在前面** `if (url.HasQueryParameter("expand_all")) {} else {}` 而不是 `if (!url.HasQueryParameter("expand_all")) {} else {}`

特殊情况是错误处理：`if (!success) {} else {}`

用三元运算符代替条件和功能都简单的 if else：`(hour >= 12) ? "pm" : "am";`

如果很复杂的话：

```
exponent >= 0 ? mantissa * (1 << exponent) : mantissa / (1 << -exponent)
```

就**不要用**三元运算。

### 提早 return

```c++
public boolean Contains(String str, String substr) {
 if (str == null || substr == null) return false;
 if (substr.equals("")) return true;
 // ...
}
```

### 最小化嵌套

嵌套会**大大增加读者的思维负担**。

```javascript
if (user_result == SUCCESS) {
  if (permission_result != SUCCESS) {
    reply.WriteErrors('error reading permissions')
    reply.Done()
    return
  }
  reply.WriteErrors('')
} else {
  reply.WriteErrors(user_result)
}
reply.Done()
```

上面的代码很可能是分两次编写的，最初的需求只有判断 user_result，后来新增需求判断 permission_result。

其实这样的写法并不好理解，在处理新需求时，你可以尝试不要跟随以前的思路，从**新的角度**思考 if 条件怎么写：

```javascript
if (user_result != SUCCESS) {
  reply.WriteErrors(user_result)
  reply.Done()
  return
}
if (permission_result != SUCCESS) {
  reply.WriteErrors(permission_result)
  reply.Done()
  return
}
reply.WriteErrors('')
reply.Done()
```

## 拆分大型表达式

简单来说本章就两个重点：

- 抽离变量，把部分表达式赋值到变量再塞到原来的表达式，兼顾了变量名对内容的解释，又缩短了表达式的长度，减少视觉负担，一举两得
- 德摩根定律 `!(a||b)` 等于 `!a&&!b`，`!(a&&b)` 等于 `!a||!b`

## 变量与可读性

前面提到抽离变量，这一章讲的是如何删掉没用的变量

可以考虑删除的变量：

- 暂时变量，简单来说就是“tmp”
- 中间变量，简单来说就是“标志”，像下面的 `index_to_remove`

```javascript
var remove_one = function(array, value_to_remove) {
  var index_to_remove = null
  for (var i = 0; i < array.length; i += 1) {
    if (array[i] === value_to_remove) {
      index_to_remove = i
      break
    }
  }
  if (index_to_remove !== null) {
    array.splice(index_to_remove, 1)
  }
}
```

### 缩减作用域

```java
class LargeClass {
 string str_;
 void Method1() {
 str_ = ...;
 Method2();
 }
 void Method2() {
 // Uses str_
 }
 // Lots of other methods that don't use str_ ...
};
```

把 `str_` 提取到被需要的最小范围：

```java
class LargeClass {
 void Method1() {
 string str = ...;
 Method2(str);
 }
 void Method2(string str) {
 // Uses str
 }
 // Now other methods can't see str.
};
```

另外还提到了 C 的 if 作用域和 JavaScript 的 IIFE，都是控制作用域范围的方法。

### 用时再声明

在最接近使用位置声明变量

PS.不过我倒是觉得一开始就声明好一堆也不会觉得很难读呀，插在中间声明也不是很好看

### 用常量

减少变量赋值次数，甚至用 const、final

PS.就像 React 的 Immutable 原则

## 代码结构再组织

### 抽离子问题

## 每次做一件事

这和著名的“一个函数只做一件事”不完全一样，这是指一个函数**内**要做的事也是可以分为不同的“任务组”。(defragmenting)

```javascript
var vote_changed = function(old_vote, new_vote) {
  var score = get_score()
  if (new_vote !== old_vote) {
    if (new_vote === 'Up') {
      score += old_vote === 'Down' ? 2 : 1
    } else if (new_vote === 'Down') {
      score -= old_vote === 'Up' ? 2 : 1
    } else if (new_vote === '') {
      score += old_vote === 'Up' ? -1 : 1
    }
  }
  set_score(score)
}
```

```javascript
var vote_value = function(vote) {
  if (vote === 'Up') {
    return +1
  }
  if (vote === 'Down') {
    return -1
  }
  return 0
}
var vote_changed = function(old_vote, new_vote) {
  var score = get_score()
  score -= vote_value(old_vote) // remove the old vote
  score += vote_value(new_vote) // add the new vote
  set_score(score)
}
```

## 想法化为代码

> You do not really understand something unless you can explain it to your grandmother.
> —Albert Einstein

能用通俗易懂的语言向别人解释一些别人不知道的事情，是一种非常珍贵的能力。这样的能力用在代码上岂不美哉！

所以一个新的角度就是：像写大白话一样写代码。

```php
$is_admin = is_admin_request();
if ($document) {
 if (!$is_admin && ($document['username'] != $_SESSION['username'])) {
 return not_authorized();
 }
} else {
 if (!$is_admin) {
 return not_authorized();
 }
}
```

相信看了上面优化逻辑的话应该不会写出这样的代码了，在这章作者再解释了一次怎么修改这种代码：

**用人类语言描述这个过程**，也就是：

有两种通过权限校验的情况：你可能是 admin，或者你是当前文档的拥有者，其他情况都不通过。

把上面的白话写成代码其实就这么简单：

```php
if (is_admin_request()) {
 // authorized
} elseif ($document && ($document['username'] == $_SESSION['username'])) {
 // authorized
} else {
 return not_authorized();
}
// continue rendering the page ...
```

如果你发现很难描述你的问题或者代码……那可能你的代码逻辑存在一些问题，那更好了，再深度思考一下业务逻辑会不会有什么不对的地方吧。

这事情做起来和 rubber ducking（也就是“小黄鸭调试法”）差不多，不难做到，却十分有效，十分推荐大家尝试。

## Less Code

> The most readable code is no code at all

- 代码越少越好
- 去除无意义 feature
- 不要过度开发
- 了解你的语言有什么接口，接口能实现的事情就不要自己写了
- 寻找其他靠谱的开源库

## 其他

本书最后两章还给出了两个例子，用上面的知识重构两段代码，这里就略过了。

最后还有原书作者的拓展阅读推荐：

- Code Complete: A Practical Handbook of Software Construction, 2nd edition, by Steve McConnell(Microsoft Press, 2004)
- Refactoring: Improving the Design of Existing Code, by Martin Fowler et al. (Addison-Wesley Professional, 1999)
- The Practice of Programming, by Brian Kernighan and Rob Pike (Addison-Wesley Professional, 1999)
- The Pragmatic Programmer: From Journeyman to Master, by Andrew Hunt and David Thomas (Addison-Wesley Professional, 1999)
- Clean Code: A Handbook of Agile Software Craftsmanship, by Robert C. Martin (Prentice Hall, 2008)
