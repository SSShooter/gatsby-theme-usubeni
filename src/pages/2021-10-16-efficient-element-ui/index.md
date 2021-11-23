---
path: '/efficient-element-ui'
date: '2021-11-23T10:19:36.573Z'
title: '三个技巧高效写 Element UI（Vue）'
tags: ['coding']
---

## Tips

安装 [element-ui-helper](https://marketplace.visualstudio.com/items?itemName=oibit.element-ui-helper) 插件，可得到 element ui 悬停提示，不用每次都翻文档。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/element-ui-tips.png)

缺点也是有一点，tips 的显示框有点小了，不过跟插件本身也没关系，查了一下，vscode 暂时还没有提供可以修改 tips 大小的方法，只有[修改 vscode 全局 css 的 workaround](https://github.com/microsoft/vscode/issues/14165)。

如果还是有其他需要自己魔改的话，GitHub 仓库[在此](https://github.com/HULANG-BTB/element-ui-helper)，vscode API 文档看[这里](https://code.visualstudio.com/api/references/vscode-api)。

## Snippet

snippet 的意思就是“代码片段”，一般我们不会记住 ui 框架的细节，记住组件名字就差不多得了，但是只知道名字怎么用呢……

一般来说自然是在文档找关键字，然后 `ctrl+c/v`，但是借助 snippet，可以让 vscode 给你找组件代码。

虽然可以通过插件安装 snippet，但是更灵活的方法是用 ctrl+P 创建 snippet 文件。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/snippet.png)

snippet 文件的结构大概就这样：

```json
{
  "Basic: Layout el-row": {
    "prefix": "elrow",
    "body": [
      "<el-row :gutter=\"${1:20}\">",
      "\t<el-col :span=\"${2:12}\" :offset=\"${3:0}\">${4}</el-col>",
      "\t<el-col :span=\"${5:12}\" :offset=\"${6:0}\">${7}</el-col>",
      "</el-row>",
      "${8}"
    ],
    "description": "Element UI <el-row> with <el-col>"
  }
}
```

`"Basic: Layout el-row"` 是 snippet 的名称，对象是 snippet 的详细配置：`prefix` 指只需要输入 `elrow` 就会出现可选择的提示，`description` 是对这个 snippet 的描述，选择该 snippet 就能自动输入 body 的内容。

在 [Element-UI-Snippets 仓库](https://github.com/snowffer/Element-UI-Snippets-VSCode)中，找到 `snippets` 文件夹下的两个 json 文件，贴到你创建的 snippet 就可以了。

## Plop

[plop](https://plopjs.com/documentation) 就要比前面两项复杂许多，这是一个根据用户配置生成高度重复代码文件的工具。说到重复代码生成，很容易想到各种低代码解决方案，例如 [form-generator](https://github.com/JakHuang/form-generator)，确实可以比较方便地解决表单生成问题，但是对于有相同关联逻辑的多个页面，只生成一个表单也不太够。还有其他只需要 json 配置即可含逻辑的页面的工具，不过也有很大的局限性，毕竟生成的东西不一定好改，如果某些细节需要定制的话将会变得十分麻烦。

所以最后还是选择 plop 吧，自己写模板，至少自己的需求是可以完美满足的！

plop 大概由三个部分组成，其中关系后面会说到：

- plopfile
- Inquirer.js https://github.com/SBoudrias/Inquirer.js/
- handlebars https://github.com/handlebars-lang/handlebars.js

使用 plop 的第一步是写一个 `plopfile.js`，这个文件一般长这样：

```javascript
module.exports = function(plop) {
  plop.setHelper('equal', function(a, b) {
    return a === b
  })
  plop.setGenerator('table-view', tableViewGenerator)
}
```

其实就是写一个函数，plop 会给你注入 plop 对象，你就能调用各种方法实现你的代码生成需求，最常使用的函数就是 `setHelper` 和 `setGenerator`。

文档传送门：https://plopjs.com/documentation/#setgenerator

配置中最重要的是 `setGenerator`，在配置生成器时，有三个参数 `description`（非必填）、`prompts`、`actions`。

### prompts

配置 `prompts` 对用户的提问时使用了 Inquirer.js，所以要查怎么配提问还得到 Inquirer.js 的[文档](https://github.com/SBoudrias/Inquirer.js/#question)查询。

```javascript
const prompts = [
  {
    type: 'input',
    name: 'name',
    message: 'view name please',
    validate: notEmpty('name'),
  },
]
```

不过在我的工作场景中基本不怎么依赖 Inquirer.js，因为配置太复杂了，还不如直接写一份 json 来得快（但是……prompts 是必填项，所以只好象征性地留一个 name 使用 prompts 提问）。

另外，也可以通过 `plop.setPrompt` 配置可复用的 prompt。

### actions

接着是 `actions`，跟 prompt 一样，action 也有类似的配置方法 `setActionType`，但是一般我们只用两种内置 action：`add` 和 `addMany` 就可以了。

因为 add 比较简单感觉没什么需要特别注意，这里举例一个 addMany 的配置：

```javascript
const actions = [
  {
    type: 'add',
    templateFile: 'plop/table-view/api.js.hbs',
    path: `src/api/alert/${name}.js`,
  },
  {
    type: 'addMany',
    templateFiles: 'plop/table-view/**/*.vue.hbs',
    destination: `src/views/${name}`,
    base: 'plop/table-view',
    stripExtensions: ['hbs'],
  },
]
```

`add` 是一个模板对应一个结果文件，所以你可以很清晰地指定结果文件的位置和文件名，但是 `addMany` 是一组模板的生成，配置的东西自然多一点。

要生成多个文件甚至一个文件夹，最重要的是 `templateFiles` 字段，这是一个 `glob` 字符串，这 `glob` 和 `blob` 没啥关系，反而有点像正则表达式，中文叫通配符，就是用特定规则匹配一系列结果的小工具，下面是几条很简单的规则：

- \* 匹配 / 除外任何字符
- ? 匹配 / 除外任何 1 个字符
- \*\* 匹配包括 / 的任何字符
- {} 用逗号隔开可以产生“或”的效果
- ! 出现在开头表示取反

`'plop/table-view/**/*.hbs'` 的意思就是 `plop/table-view` 下的所有 `hbs` 文件（hbs 就是一个模板引擎，后面详细讲）。

`destination` 是生成文件的目标文件夹，`base` 是生成文件可能需要把外层文件夹去掉，可能说起来不太清楚，实践一下就很好理解了。

`stripExtensions` 用于处理“模板到结果”的文件名转换问题，因为 `addMany` 不像 `add` 可以指定目标文件名，那么整个文件夹搬过去不能改名字就出大问题了，直接一个 hbs 文件，怎么搞嘛，而这个字段就是用于删除多余的 hbs 后缀，模板文件可以这样命名：`example.vue.hbs`，生成的结果就是 `example.vue`。

有时候我们的需求不只是生成新的文件，还要往老文件新增一些代码，最典型的就是加一个页面的时候还需要在路由文件新增路由，这时候就可以使用 `append` action。

```javascript
const actions = [
  {
    type: 'append',
    path: 'src/router/index.js',
    pattern: '// insert new route',
    templateFile: 'plop/router/index.hbs',
  },
]
```

看配置不难理解，其实就是在 `path` 所在的文件夹中搜寻 `pattern`（可以是 RegExp），然后在找到的位置 append 一段模板。

### handlebars

plop 的目的是生成一份或一系列定制的代码文件，上面说了获取用户输入数据，借用了 Inquirer.js，而**模板语言**使用的正是 handlebars。

对于习惯写 Vue template 的用户来说，写 [handlebars](https://handlebarsjs.com/guide/) 模板需要一些思维转换（例如十分熟悉的 `{{ x || y }}` 的写法行不通，也没有直接 elseif 的方法），不过还好，官方提供了 [playground](http://tryhandlebarsjs.com/)，能让刚接触 hbs 的用户比较直观地尝试各种特性。

说到 helper 有没感觉前面看到过，没错，plop 的 `setHelper` 其实就是给 handlebars 设置 helper。

举个例子，要做到 Vue 模板 `{{ x || y }}` 的效果，需要自定义一个 helper：

```javascript
Handlebars.registerHelper('coalesce', function(a, b) {
  return a || b
})
```

上面是 handlebars 原生的 helper 注册，在 plop 中则是使用 `plop.setHelper`，传参都一样。在配置 helper 后，在模板里写 `coalesce x y` 就能达到 `{{ x || y }}` 的效果。

需要特别注意，**如果你在 handlebars 模板的 `{{}}` 里填写一个以上的关键字，就会自动变成调用 helper 了**。

另外还有一个常见小问题，就是 hbs 和 vue 模板的冲突，单行可以用 `\`，多行可以用 `{{{{raw}}}}` 直接输出 `{{}}`：

```
\{{escaped}}
{{{{raw}}}}
  {{escaped}}
{{{{/raw}}}}
```

### 自带 helper

plop（非 hbs）自带了一些 helper，都用于处理字符串格式：

- camelCase: changeFormatToThis
- snakeCase: change\_format\_to\_this
- dashCase/kebabCase: change-format-to-this
- dotCase: change.format.to.this
- pathCase: change/format/to/this
- properCase/pascalCase: ChangeFormatToThis
- lowerCase: change format to this
- sentenceCase: Change format to this,
- constantCase: CHANGE\_FORMAT\_TO\_THIS
- titleCase: Change Format To This

## 总结

- 提示插件让你省去翻文档的时间
- snippet 让你免受手打组件代码的麻烦
- 简单的表单生成需求直接使用[表单生成器](https://mrhj.gitee.io/form-generator/#/)也不失为一个好方法
- 对于表格、表单、包括 api 相关逻辑的生成，使用 plop 定制的生成代码会非常爽

其实不只是 element-ui，所有框架都是这个思路，只不过 element-ui 刚好能找到现成的。最后，省下来的时间，可以造造新轮子，分享一下 plop 配置，创造美好前端新世界。（此处有一个若隐若现的狗头
