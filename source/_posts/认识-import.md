---
title: 认识@import
tags:
  - css
categories:
  - 前端
date: 2021-10-14 12:39:49
---

了解 `@import` 么？ 和 `<link>` 有何不同?

<!-- more -->

### 用法

1. 用法: `@import url('a.css');` 或者 `@import 'a.css';` 且必须定义在最顶部

```html
<link href="a.css" rel="stylesheet" />

<style>
  @import url('a.css');
</style>
```

### 加载顺序

加载页面时，link 标签引入的 CSS 被同时加载；

`@import` 引入的 CSS 会等到页面全部被下载完再被加载。(因为 `@import` 是有顺序的语义的)

1. `@import` & `@import`

```html
// 如果一直使用@import，那么就没有什么性能问题 两个样式文件将同时并行下载
<style>
  @import url('a.css');
  @import url('b.css');
</style>
```

2. link & `@import`

```html
//会导致样式表文件逐个加载，并行下载资源是加速页面的一个关键,在IE中link混合@import会破坏样式并行下载
<link href="a.css" rel="stylesheet" type="text/css" />
<style>
  @import url('b.css');
</style>
```

3. link 嵌套 `@import`

```html
//这种方式同样阻止并行加载代码，但是这次是对于所有的浏览器,其实这个应该不会感到奇怪吧，简单的想一下就能理解了。浏览器必须先下载a.css，并分析它，这个时候，浏览器发现了@import规则，然后才会开始加载b.css.
<link href="a.css" rel="stylesheet" type="text/css" />
//在a.css中: @import url('b.css');
```

4. link 阻断 @import

```html
//在下载a.css完成之前，IE不会开始下载b.css。但是在其它所有的浏览器中，这种情况不会发生
<link href="a.css" rel="stylesheet" type="text/css" />
<link href="proxy.css" rel="stylesheet" type="text/css" />
//proxy.css的代码: @import url('b.css');
```

5. 多个 `@import`

   IE 中使用`@import` 会引起**资源**被按照一个不同于预期的顺序下载,在 IE 中，如果脚本中包含的代码，来自样式表文件中应用的样式(比如 getElementsByClassName)， 那么就将可能会发生意外的结果，因为脚本先于样式被加载，尽管开发人员将其置于代码的最后面。

```html
// @import在IE中引发资源文件的下载顺序被打乱
<style>
  @import url('a.css');
  @import url('b.css');
  @import url('c.css');
  @import url('d.css');
  @import url('e.css');
  @import url('f.css');
</style>
<script src="one.js" type="text/javascript"></script>
```

6. link & link
   使用 LINK 来引入样式更简单和安全,使用 LINK 可确保**样式**在所有浏览器里面都能被并行下载,同样能保证**资源**按照开发人员制定的顺序下载。

```html
<link href="a.css" rel="stylesheet" type="text/css" />
<link href="b.css" rel="stylesheet" type="text/css" />
```
