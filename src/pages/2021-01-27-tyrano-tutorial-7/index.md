---
path: '/tyrano-tutorial-6'
date: '2021-03-20T11:03:50.608Z'
title: 'TyranoScript 从入门到魔改 6 备忘录'
tags: ['TyranoScript', 'coding']
---

这里收集一些关于 TyranoScript 零散的信息或是使用技巧，以备太久不用忘掉之需。

## 内核对象

tyrano.js 的这个函数，我一眼看上去，惊呼迷惑：

```javascript
function object(o) {
  var f = object.f,
    i,
    len,
    n,
    prop
  f.prototype = o
  n = new f()
  for (i = 1, len = arguments.length; i < len; ++i)
    for (prop in arguments[i]) n[prop] = arguments[i][prop]
  return n
}
object.f = function() {}
```

但是整理了一下（真想吐槽原写法的函数声明真是古早味……），就这：

```javascript
function object(o) {
  var f = function() {}
  f.prototype = o
  let obj = new f()
  // 注意 i 为 1，后面的参数才会附加到对象中
  for (let i = 1; i < arguments.length; ++i)
    for (let prop in arguments[i]) obj[prop] = arguments[i][prop]
  return obj
}
```

乍看有点像“热门面试题：自己写一个 new”，细看又不对，这里面就有 new 啊草（日语

这个奇葩函数做的是：

- 传入一个对象 `o`，把 `o` 接到构造函数的原型链
- 构造空对象，啥也没有，就是让他继承 `o` 里的函数（其实就等同于 Object.create）
- 然后把 o 后多余的参数附到这个新对象上

总之吧，可以理解成内核实例 `TYRANO` 就是 `object(tyrano.core)` 得来的，在调用内核接口时记得用 `TYRANO` 而不是 `tyrano`。

`TYRANO.init` 后会通过 loadModule 把 `/tyrano/plugins/` 里的各个模块的东西都塞到 TYRANO.kag 的原型链里，于是——

你就可以用 `TYRANO.kag` 调用 `tyrano.plugin.kag` 里的所有东西，例如：

- `TYRANO.kag.config.defaultSeVolume` 获取当前音效音量
- `TYRANO.kag.tag.seopt` 修改音效音量

## CG

`[tb_cg id="cg_main0_1"]` 解锁 id 为 cg_main0_1 的 cg，搜一下就知道这其实是个 builder 的宏。

```
[macro name="tb_cg"]
	[iscript]
    sf.cg_id[mp.id] = "on";
  [endscript]
[endmacro]
```

按这道理，用 `TYRANO.kag.variable.sf.cg_id[mp.id]` 就能获取 CG 是否已解锁

## Log

Log 缓存在 variable.tf.system.backlog

修改 backlog 的是 pushBackLog 函数，有两个地方用到：

- pushlog 标签，用标签插 log
- showMessage 函数，在展示信息的同时插 log，想修改插的 log 的格式就在这改

需要注意的是，存档展示的当前信息也是这里来的，注意调整格式的时候不要影响到。

## 文档

TyranoScript 的 Tag 文档地址：

英文文档地址 -> http://tyranobuilder.com/tyranoscript-tags-reference/

日文文档地址 -> https://tyrano.jp/tag/

中文文档地址 -> 怎么可能有嘛 (・ω<) てへぺろ

## 变量

TyranoScript 中变量有三种：

- sf 系统（全局的）
- f 游戏变量（跟存档）
- tf 暂存（关掉游戏就没了）

可以用 eval 标签或 iscript 标签修改，可以这么做的原因是 `evalScript` 里藏着一个 `saveSystemVariable`，确实不太直观。

```
;This assigns a text string to a system variable
[eval exp="sf.variable1 = 'Sample Text'"]

;This assigns a number to a game variable
[eval exp="f.flag1 = 1000"]

;This assigns a temporary variable
[eval exp="tf.flag1 = f.flag2"]

[iscript]
sf.variable1 = 'Sample Text'
f.flag1 = 1000
tf.flag1 = f.flag2
[endscript]
```

## 设置

```javascript
TYRANO.kag.tag.bgmopt.start.call(TYRANO, {
  volume: v,
  effect: 'true',
  buf: '',
})
```

current_msg_alpha 透明度

screen_full

fullState

config.alreadyReadTextColor

config.autoRecordLabel

stat.already_read

在没有读入脚本的时候倒是没问题，但是如果在脚本运行中插入一个 call，默认是会调用 `nextOrder` 跑下一句脚本的，换句话说就是在游戏菜单的设置中做 bgmopt 等调整，对话框中的内容就会跑到下一句。

```javascript
TYRANO.kag.stat.is_strong_stop = true
TYRANO.kag.tag.bgmopt.start.call(TYRANO, {
  volume: v,
  effect: 'true',
  buf: '',
})
TYRANO.kag.stat.is_strong_stop = false
```

上面的写法可以回避 `nextOrder`。

顺便补充一下，默认配置由 `loadConfig` 导入 `data\system\Config.tjs` 文件的内容。

## 在 js 跑 ks 指令

```
TYRANO.kag.ftag.startTag('tag')
```

## stat

上面提到的 kag.stat 是 tyrano 的储存状态的关键变量。

```javascript
;[
  'map_label',
  'map_macro',
  'vertical',
  'f',
  'mp',
  'current_layer',
  'current_page',
  'is_stop',
  'is_wait',
  'is_trans',
  'is_wait_anim',
  'is_strong_stop',
  'strong_stop_recover_index',
  'is_nowait',
  'current_message_str',
  'current_save_str',
  'current_keyframe',
  'map_keyframe',
  'is_script',
  'buff_script',
  'is_html',
  'map_html',
  'cssload',
  'save_img',
  'stack',
  'set_text_span',
  'current_scenario',
  'is_skip',
  'is_auto',
  'current_bgm',
  'current_bgm_vol',
  'current_se',
  'enable_keyconfig',
  'current_bgmovie',
  'current_camera',
  'current_camera_layer',
  'is_move_camera',
  'is_wait_camera',
  'current_line',
  'is_hide_message',
  'is_click_text',
  'is_adding_text',
  'flag_ref_page',
  'ruby_str',
  'ch_speed',
  'skip_link',
  'log_join',
  'log_clear',
  'f_chara_ptext',
  'flag_glyph',
  'current_cursor',
  'font',
  'locate',
  'default_font',
  'sysview',
  'chara_pos_mode',
  'chara_effect',
  'chara_ptext',
  'chara_time',
  'chara_memory',
  'chara_anim',
  'pos_change_time',
  'chara_talk_focus',
  'chara_brightness_value',
  'chara_blur_value',
  'chara_talk_anim',
  'chara_talk_anim_time',
  'chara_talk_anim_value',
  'apply_filter_str',
  'video_stack',
  'is_wait_bgmovie',
  'charas',
  'jcharas',
  'play_bgm',
  'play_se',
  'map_se_volume',
  'map_bgm_volume',
  'map_vo',
  'vostart',
  'log_write',
  'buff_label_name',
  'already_read',
  'visible_menu_button',
  'title',
]
```

这意味着在你新增自定义标签时，必须要考虑保存的问题。否则会出现这样的问题：你做了一个特效标签，保存的时候特效在运行，但是读档时却没有了。

这个问题的解决方案就是在标签运行同时在 stat 记录运行状态，我的情况就是设置 currentEffect 属性并记录参数，在设置 stat 后，需要在读档时（loadGameData 函数，kag.menu.js）还原当时的状态，没有状态时还要主动清除当前状态。

## 加载

setLayerHtml，相对的是保存用的 getLayeyHtml

在 bg 标签记录 stat.currentBG，然后在 setLayerHtml 特殊处理 bg

在加载时同样需要**谨慎处理** `nextOrder`，因为在 load 的时候调用了自己新增的 setEffect，里面有一句 `nextOrder`，导致读档产生诡异的效果（例如突然冒出个例会），并且因为这是异步的操作，很难 debug，这个问题就查了老半天 😂。

## 截图

为此我们需要从 doSave 开始看
