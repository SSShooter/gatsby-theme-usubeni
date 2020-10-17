---
path: '/tyrano-tutorial-6'
date: '2020-10-17T11:03:50.608Z'
title: 'TyranoScript 从入门到魔改 5 页面创造'
tags: ['TyranoScript', 'coding']
---

有一天，老板说要 UI 大整改，还好我有所准备。

之前就埋怨过，设定、cg 等页面用 TyranoScript 编写，看起来不好理解，而且页面层级还老分不清，还不如直接写 HTML 呢，今天就来分析一下怎么用 HTML 写一个新页面。

我们从已有的“非脚本”页面入手，例如默认的 Load 页面，全局搜索 `displayLoad` 就能找到，在 kag.menu.js 文件中。

```javascript
this.kag.html('load', { array_save: array, novel: $.novel }, function(
  html_str
) {
  var layer_menu = that.kag.layer.getMenuLayer()
  var j_save = $(html_str)
  j_save.find('.save_list').css('font-family', that.kag.config.userFace)
  j_save.find('.save_display_area').each(function() {
    $(this).click(function(e) {
      var num = $(this).attr('data-num')
      that.snap = null
      that.loadGame(num)
      var layer_menu = that.kag.layer.getMenuLayer()
      layer_menu.hide()
      layer_menu.empty()
      var layer_title = that.kag.layer.getTitleLayer()
      layer_title.hide()
      layer_title.empty()
      if (that.kag.stat.visible_menu_button == true) $('.button_menu').show()
    })
  })
  j_save.find('.button_smart').hide()
  if ($.userenv() != 'pc') {
    j_save.find('.button_smart').show()
    j_save.find('.button_arrow_up').click(function() {
      var now = j_save.find('.area_save_list').scrollTop()
      var pos = now - 160
      layer_menu
        .find('.area_save_list')
        .animate({ scrollTop: pos }, { queue: false })
    })
    j_save.find('.button_arrow_down').click(function() {
      var now = j_save.find('.area_save_list').scrollTop()
      var pos = now + 160
      j_save
        .find('.area_save_list')
        .animate({ scrollTop: pos }, { queue: false })
    })
  }
  that.setMenu(j_save)
})
```

新建页面的核心就是 `kag.html` 函数，此函数位于 kag.js：

```javascript
{
  html: function(html_file_name, data, callback) {
    var that = this
    data = data || {}
    if (this.cache_html[html_file_name]) {
      if (callback) {
        var tmpl = $.templates(this.cache_html[html_file_name])
        var html = tmpl.render(data)
        callback($(html))
      }
    } else {
      if (!this.kag.stat.sysview) {
        this.kag.stat.sysview = {
          save: './tyrano/html/save.html',
          load: './tyrano/html/load.html',
          backlog: './tyrano/html/backlog.html',
          menu: './tyrano/html/menu.html',
        }
      }
      var path_html = this.kag.stat.sysview[html_file_name]
      $.loadText(path_html, function(text_str) {
        var tmpl = $.templates(text_str)
        var html = tmpl.render(data)
        that.cache_html[html_file_name] = text_str
        if (callback) callback($(html))
      })
    }
  }
}
```

html 函数的参数分别是：

- 文件名称
- 传入的数据
- 回调函数

观察 displayLoad 可知，加载 load 页面需要传入页面名称 load，一个包含存档内容的对象，以及参数为 html 文件内容的回调函数。这里有一个槽点，callback 传入的 \$(html) 根本不是参数所写的 html\_ “str” 而是经过 jQuery 处理的对象。

回到在 html 函数中，`$.loadText` 使用 ajax 获取本地 html 文件；而 `$.templates` 和 `tmpl.render` 等函数均出自开源渲染引擎 [jsrender](https://github.com/BorisMoore/jsrender)。

在 load.html 中，我们可以看到模板的使用：

```html
<div class="save_list">
  {{for array_save}}
  <div class="save_display_area save_list_item" data-num="{{:num}}">
    <span class="save_list_item_thumb">
      {{if img_data != ""}}
      <img class="pic" src="{{:img_data}}" />
      {{/if}}
    </span>
    <span class="save_list_item_thumb">
      {{if img_data == ""}}
      <div class="pic">No data</div>
      {{/if}}
    </span>

    <div class="save_list_item_area">
      <div class="save_list_item_date">{{:save_date}}</div>
      <div class="save_list_item_text">{{:title}}</div>
    </div>
  </div>
  {{/for}}
</div>
```

但是我不打算用 jsrender 作为模板引擎，因为我还要引入 Vue 顺便蹭一蹭 MVVM 的便捷。

于是我们可以改写一个更简单的 html 函数：

```javascript
{
  htmlPure: function(html_file_name, data, callback) {
    var that = this
    data = data || {}
    if (this.cache_html[html_file_name]) {
      if (callback) {
        callback(this.cache_html[html_file_name])
      }
    } else {
      var path_html = this.kag.stat.sysview[html_file_name]
      $.loadText(path_html, function(text_str) {
        that.cache_html[html_file_name] = text_str
        if (callback) callback(text_str)
      })
    }
  },
}
```

htmlPure 函数去除了模板引擎渲染，直接将 html 字符串传入回调函数。（可以选择保留 jsrender，但是为了不和 Vue 的模板冲突，需要修改 Vue 的 delimiters）

在新增 htmlPure 函数后，还要新建一个创建新页面的标签，这里命名为 `showExtendPage`：

```javascript
tyrano.plugin.kag.tag.showExtendPage = {
  pm: {},
  start: function(pm) {
    var that = this
    this.kag.stat.is_skip = false
    this.kag.htmlPure(pm.name, null, function(html_str) {
      var extendPage = $(html_str)
      var layer_extend = that.kag.layer.layer_extend
      layer_extend[0].style.zIndex = pm.zindex || 9999999999
      layer_extend[0].innerHTML = ''
      layer_extend.fadeIn()
      layer_extend.append(extendPage)
    })
    this.kag.ftag.nextOrder()
  },
}
```

这就是使用自定义页面的思路，在把脚本文件更换为 html 文件后整个人得到了解放，不用思考**脚本跳转的回调**和**层级清除**问题，调用 showExtendPage 标签即可使页面淡入。