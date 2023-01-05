---
title: 面试题-原型链
tags:
  - 原型链
categories:
  - 面试
date: 2022-03-17 15:27:11
---

某大厂遇到一个原型链的面试题。突然发现自己对原型链理解还是不够

<!-- more -->

## 题目

<<< @/code/prototype/code.js

<!-- {% include_code lang:javascript from:1 prototype/code.js %} -->

## 分析

明显是考的原型链.那么顺着原型链向上找:

先看小 f:

1. 首先 f 是 F 的实例,那么通过[new 的原理](https://tangbohao37.github.io/2021/07/29/js%E7%9A%84new%E5%88%B0%E5%BA%95%E5%B9%B2%E4%BA%86%E4%BB%80%E4%B9%88,%E5%8E%9F%E5%9E%8B%E9%93%BE%E5%8F%88%E6%98%AF%E4%BB%80%E4%B9%88/)可以知道 `f.__proto__ === F.prototype` . 继续向下找
2. `F.prototype.__proto__ === Object.prototype` 因此 f.b() 肯定可以找到,而 f.a() 并在 f 的查找链上因此会报错没有这个方法

再看大 F

1. `F.__proto__ ===Function.prototype` 因此 F.a() 可以找到. 继续向下找
2. `Function.prototype.__proto__ === Object.prototype` 因此 F.b() 可以找到

![结果](/images/原型链-面试.drawio.svg)

## 误区

千万不要直接认为 F 的原型链上有 Function.prototype 。而 `f.__proto__`指向 F.prototype ,就**想当然**的认为 ~f 的原型链上也有 Function.prototyp~ 。js 是严格按照`__proto__`向上查找的. 这是在两条不同的链上的东西!.
