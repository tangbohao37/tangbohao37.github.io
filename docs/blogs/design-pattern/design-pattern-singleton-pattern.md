---
title: 设计模式-单例模式
tags:
  - 单例模式
categories:
  - 设计模式
date: 2021-10-07 11:16:37
---

# {{ $frontmatter.title }}

单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现并不复杂

<!-- more -->

## js 中使用 OOP 的形式实现的单例模式

<!-- {% include_code from:1 to:25 lang:javascript design-pattern/singleton-pattern.js %} -->

<<< @/code/design-pattern/singleton-pattern.js

当然以上形式违反了“单一职责原则”,因为 CreateDiv 的构造函数做了 2 件事： 1.判断单例 2.执行 init 初始化
当有一天我们不需要创建单例的 div 时就要重新改造构造函数了. 可以用代理优化一下

### 用代理实现单例

<<< @/code/design-pattern/singleton-pattern.js

<!-- {% include_code from:26 to:53 lang:javascript design-pattern/singleton-pattern.js %} -->

这段代码实现一下特性:

1. 单例判断移出到 proxy 中,保持 CreateDiv 功能单一

2. 这里用一个自执行函数封装 proxy 方法,不污染全局变量

3. 使用闭包保持内部 instants 可持续缓存

4. 在需要的时候再创建对象(惰性)

## 使用 js 中的单例

前面我们使用的 OOP 的思想来实现的单例模式,但 js 是一个无类(class-free) 语言,也正因为如此，生搬单例模式的概念并无意义。在 JavaScript 中创建对象的方法非常简单，既然我们只需要一个“唯一”的对象，为什么要为它先创建一个“类”呢？传统的单例模式实现在 JavaScript 中并不适用。

> 单例模式的核心是确保只有一个实例，并提供全局访问。

那么在 js 的世界里，全局变量基本上可以满足单例模式的条件,但全局变量并不是单例模式。但却可以当作单例模式来使用

为了避免全局变量的滥用,我们可以使用 命名空间/闭包封装私有变量 来实现

1. 命名空间:

```js
var namespace = {
  a: function () {},
  b: function () {}
};
```

2. 闭包

```js
var glob = (function () {
  var instants = null
  return {
    getInstants = function(){
      return instants
    }
  }
})()
```

### 通用惰性单例

```js
var getSingle = function (fn) {
  var res = null
  return (res || res = fn.apply(this, arguments)) // apply 确保 fn 内部能访问到全局对象 windows
}
```
