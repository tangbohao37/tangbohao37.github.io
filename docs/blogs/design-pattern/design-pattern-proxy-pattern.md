---
title: 设计模式-代理模式
tags:
  - 代理模式
categories:
  - 设计模式
date: 2021-10-07 16:59:16
---

# {{ $frontmatter.title }}

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象。

<!-- more -->

## 代理模式实现图片预加载

<<< @/code/design-pattern/proxy-pattern.js

<!-- {% include_code form:1 to:25 lang:javascript design-pattern/proxy-pattern.js %} -->

> 现在我们通过 proxyImage 间接地访问 MyImage。proxyImage 控制了客户对 MyImage 的访问，并且在此过程中加入一些额外的操作，比如在真正的图片加载好之前，先把 img 节点的 src 设置为一张本地的 loading 图片

当然这里实际上不用代理也是可以实现的。 将 img.onload 事件放入 MyImg 即可,但是这样违法了"单一职责原则"

> 单一职责原则指的是，就一个类（通常也包括对象和函数等）而言,应该仅有一个引起它变化的原因。如果一个对象承担了多项职责，就意味着这个对象将变得巨大，引起它变化的原因可能会有多个,过多的职责耦合会导致代码脆弱和低内聚。

## js 中的注意事项

由于 js 是动态类型语言,因此我们无法判断接口是否符合协议,需要人工对代理对象的接口一致性做出约束

## 缓存代理工厂

<<< @/code/design-pattern/proxy-pattern.js

<!-- {% include_code from:27  lang:javascript design-pattern/proxy-pattern.js %} -->
