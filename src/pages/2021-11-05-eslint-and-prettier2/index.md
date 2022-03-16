---
path: '/eslint-and-prettier2'
date: '2021-11-07T18:14:01.447Z'
title: '用 eslint 和 prettier 让跨 IDE 协作更舒服'
tags: ['coding', 'ESLint', 'Prettier']
---

## TL; DR

- 搭配 eslint 和 prettier 可以进行代码质量优化和跨 IDE 协作
- 安装插件和 npm 包以顺利使用 eslint 和 prettier
- 准备配置文件 `.eslintrc.js` 和 `.prettierrc.js`（可以借助工具生成也可手写）
- 提高效率，开启 IDE 的保存自动格式化功能
- 用 npm 可以更方便地管理 eslint 和 prettier 配置

## 场景

[之前说明了一下 eslint 和 prettier 的区别](https://ssshooter.com/2020-06-01-eslint-and-prettier/)，这次是要实践解决 VScode 和 jetbrains 系 IDE 的协作问题。

jetbrains 系在输入 html 标签名后如果在后面接一个属性的话，再换行就会自动对齐到标签名的长度，但是如果后面不接属性直接换行的话就定位到正常缩进位置。第一种情况如下图的 `el-select` 第二种情况如 `el-option`，即使再使用 IDE 的格式化也是按照这个“设定”格式化。

![](/blog-image/jb-format.png)

但是 vscode 中找不到配置这种缩进的方法，要做到兼顾两款 IDE 和所有开发者的格式统一，便很自然地想到 eslint 和 prettier 了，这也是前端项目中十分常用的代码管理工具。

这里就有一个小问题，eslint 不够吗？某些情况下确实不够，虽说 eslint 也能管代码格式，但他毕竟是个 ES lint……Vue 文件里模板部分的缩进他不管，所以如果需求是 vsc 和 jb 协作的话，只用 eslint 不够，模板部分得靠 prettier 统一。都用 vsc 的话短时间没大问题，但是随着 vsc 版本升级指不定格式化算法会修改，所以还是多加一个 prettier 靠谱。

## 安装插件

### vscode

插件页找这两个即可：

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### webstorm

![webstorm eslint](/blog-image/ws-eslint.png)

![webstorm prettier](/blog-image/ws-prettier.png)

webstorm 自带 eslint，prettier 可以在 settings-plugins 里搜索安装（ws 似乎也默认安装了 prettier）。

- https://www.jetbrains.com/help/webstorm/eslint.html
- https://www.jetbrains.com/help/webstorm/prettier.html

## 安装核心程序

IDE 插件都不包含两个格式化程序的核心算法，仅仅提供与 IDE 沟通的桥梁，他们的运行都是依赖于 node_modules 目录里的程序，所以 npm 包安装是必须的。

```
npm install --save-dev eslint eslint-plugin-vue prettier
```

其中 [eslint-plugin-vue](https://eslint.vuejs.org/rules/) 是 Vue 专用的 lint 规则，对应 react 也会有。

而且还需要在两个 IDE 都装上对应插件

在设置里可以设置 prettier 的路径：

![ws prettier setting](/blog-image/ws-prettier2.png)

## 初始化配置

### eslint

> ESLint does both traditional linting (looking for problematic patterns) and style checking (enforcement of conventions). You can use ESLint for everything, or you can combine both using Prettier to format your code and ESLint to catch possible errors.

```
npx eslint --init
```

初始化建议直接三个都选 `To check syntax, find problems, and enforce code style`。

输出格式当然还是推荐 js，一来本身就受到 eslint 管理，而且还可以根据程序自定义输出结果。

![eslint init](/blog-image/eslint-init.png)

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
```

看起来配置很少，其实都浓缩在 `extends` 里的预设规则集里了。

<!-- const 会不会被加速 -->

### prettier

官网自带的 [playground](https://prettier.io/playground/) 可以帮你生成 json 文件，拿到了直接新建 `.prettierrc.js` 文件用 `module.exports =` 输出就可以了

全部可选配置的详细解释可以看这里 https://prettier.io/docs/en/options.html

```javascript
module.exports = {
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  vueIndentScriptAndStyle: false,
}
```

## 其他问题

### prettier 和 eslint 的冲突

有时候 prettier 和 eslint 的规则有冲突，prettier [官网](https://prettier.io/docs/en/related-projects.html#eslint-integrations)有相关专题描述这个问题，不过个人认为没有必要额外加兼容软件，因为 prettier 的配置本来就很少，手动兼容也不是难事，再加这些工具可能反而会增加维护负担。

像是默认生成的 eslint 规则在格式化 `switch` 的时候和 prettier 规则就不一样，但是 prettier 没有细致到控制 `switch` 缩进的规则，所以要改 eslint 迁就 prettier：`indent: [2, 2, { SwitchCase: 1 }],`

### 自动格式化

尽管快捷键很方便，还是不如一个 `ctrl S` 来得直接。

webstorm 可以在 settings 搜索到保存时的行为，勾选 eslint 和 prettier。

![webstorm action on save](/blog-image/ws-action-on-save.png)

vscode 可以直接写入这个配置（默认格式化工具使用 prettier）：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true
}
```

### 提交检查

**项目立项时未使用代码格式化工具，后来再接入的项目没必要立即开启提交检查，渐进式修改即可**

使用 [husky](https://typicode.github.io/husky) 可以帮助我们在提交前运行一些检查代码质量或进行代码测试的脚本。

安装过程大概是 `npx husky-init` 初始化后安装 husky 依赖，在 package.json 文件添加 lint 命令。

```json
{
  "scripts": {
    "lint": "node ./node_modules/eslint/bin/eslint.js --ext .vue,.js src",
    "fix": "node ./node_modules/eslint/bin/eslint.js --ext .vue,.js src --fix",
    "prepare": "husky install"
  }
}
```

然后在 `.husky` 文件夹中的 `pre-commit` 文件添加 `npm run lint`，即可在提交前运行 eslint，失败时不可提交代码。

## 配置分享

一般来说一个团队完全可以所有项目共用一套配置，直接复制配置文件共享就能跳过生成配置的步骤，更方便的还通过 [npm 管理配置](https://prettier.io/docs/en/configuration.html#sharing-configurations)文件，像下面这样（eslint 同理）：

```javascript
module.exports = {
  ...require('@company/prettier-config'),
  semi: false,
}
```

## 拓展

[ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)
