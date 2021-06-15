---
path: '/efficient-VS Code'
date: '2021-06-15T12:08:12.411Z'
title: '高效 VS Code 快捷键'
tags: ['coding']
---

## 推荐

| 快捷键        | 功能                      | 评价                                                                       |
| ------------- | ------------------------- | -------------------------------------------------------------------------- |
| Ctrl+X        | 剪切一行                  | 免去手动选择的麻烦                                                         |
| Ctrl+C        | 复制一行                  | 免去手动选择的麻烦                                                         |
| Ctrl+L        | 选择一行（包含换行符）    | 免去手动选择的麻烦                                                         |
| Shift+Alt+↑/↓ | 复制到上/下一行           | 我个人来说大多数复制的情况都是复制到上下行，所以这个快捷键还能省掉一个粘贴 |
| Ctrl+Shift+K  | 删除一行                  | 极大方便                                                                   |
| Ctrl+]/[      | 缩进                      | 以前很常用，但是在用 prettier 之后基本不会手动缩进                         |
| Home/End      | 移动到行头/尾             | 使用得不算多，但可以记一下                                                 |
| Ctrl+Home/End | 移动到文件头/尾           | 使用得不算多，但可以记一下                                                 |
| Alt+Z         | 超长不换行                | 就像现在写 markdown 表格，超长换行会很难看，这时候就有用了                 |
| Alt+←/→       | 返回/前进到上次选择的位置 | 在上下反复查阅代码的时候很实用                                             |
| Shift+Alt+F   | 格式化文档                | 强！烈！推！荐！每！个！人！都！需！要！知！道！                           |
| Ctrl+K Ctrl+F | 格式化选择区域            | 个人感觉是个有一点鸡肋                                                     |
| Ctrl+B        | Toggle 侧边栏显示         | 分屏之后显示区域窄了经常需要隐藏侧边栏，十分常用                           |

### Ctrl K

K 代表的大概是 chord（和弦），有点优美。Ctrl+K 默认都是组合键的基础，这里的组合是指先按 Ctrl+K 再按下一组按键，并非同时按。

### Command Palette

准确来说 Ctrl+P 出来的就是核心输入框，至于这个输入框可以做什么，你只要输入一个 `?` VS Code 就会告诉你。

| 快捷键             | 功能              | 评价             |
| ------------------ | ----------------- | ---------------- |
| Ctrl+P             | Command Palette   | 可以快速打开文件 |
| F1 或 Ctrl+Shift+P | 运行命令          | 会自动给你加 `>` |
| Ctrl+Shift+O       | 快速跳转到 Symbol | 会自动给你加 `@` |
| Ctrl+G             | 快速跳转到某行    | 会自动给你加 `:` |
| Ctrl+T             | 快速跳转到某行    | 会自动给你加 `#` |

### 代码块控制

| 快捷键        | 功能                             |
| ------------- | -------------------------------- |
| Ctrl+Shift+\  | 移动到当前代码块的花括号         |
| Ctrl+Shift+[  | 折叠当前代码块                   |
| Ctrl+Shift+]  | 展开当前代码块                   |
| Ctrl+K Ctrl+L | Toggle 当前代码块                |
| Ctrl+K Ctrl+[ | 折叠所有子代码块                 |
| Ctrl+K Ctrl+] | 展开所有子代码块                 |
| Ctrl+K Ctrl+0 | 折叠所有代码块                   |
| Ctrl+K Ctrl+2 | 折叠 2（其他数字也可以）级代码块 |
| Ctrl+K Ctrl+J | 展开所有代码块                   |
| Ctrl+K Ctrl+/ | 折叠所有块注释                   |

### 光标插入

| 快捷键       | 功能                           | 评价                                                      |
| ------------ | ------------------------------ | --------------------------------------------------------- |
| Alt+点击     | 插入光标                       | 类似多个 if 选择、html 结构修改等情况比较常用             |
| Ctrl+Alt+↑/↓ | 在上/下一行插入光标            | 代码外形统一的话挺好办                                    |
| Ctrl+U       | 撤销上次光标插入               |                                                           |
| Ctrl+D       | 选择下一个与选中区域相同的地方 | Ctrl+D 之后按方向键也可以批量插入光标                     |
| Ctrl+F2      | 选择所有与选中区域相同的地方   | Ctrl+Shift+L 好像也是一样效果，同时，长按 Ctrl+D 也差不多 |

P.S.快捷键与显卡冲突时可以 Ctrl+Alt+F12 打开显卡控制面板修改显卡快捷键

### 选区

上面提过的 Ctrl+L、Ctrl+D 这里就不重复了

| 快捷键                     | 功能     |
| -------------------------- | -------- |
| Shift+Alt+→                | 扩大选区 |
| Shift+Alt+←                | 缩小选区 |
| Shift+Alt+鼠标拖拽         | 整片选择 |
| Shift+Alt+方向键/PgUp/PgDn | 整片选择 |

### 显示

| 快捷键       | 功能                   |
| ------------ | ---------------------- |
| F11          | 全屏                   |
| Ctrl+=/-     | 缩放                   |
| Ctrl+Shift+V | Markdown 预览          |
| Ctrl+K V     | 另开窗口 Markdown 预览 |
| Ctrl+K Z     | Zen Mode               |

## 最后说两句

这部分使用频率较低，基本都是习惯用鼠标操作，也是鼠标可以轻易做到的，用快捷键大概是突出一个逼格。

剩下还有不少快捷键，可以在 [VS Code 官方 cheat sheet](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf) 查看。

最后说一句，记这些东西是不是很麻烦，没有用，说实话，记是需要成本，但是当你熟练到像在用 Ctrl C/V/S 那样，可想而知有多畅快。

另外关于高效使用 VS Code 还有代码片段和 `.vscode` 等方法，就留到以后再写吧。

## 参考链接

- [VS Code 官方 cheat sheet](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
- [tips-and-tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
