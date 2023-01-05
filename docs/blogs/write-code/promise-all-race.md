---
title: 手写promise.all 和 race
tags:
  - 手写js
categories:
  - 前端
date: 2022-03-18 12:01:39
---

面试官:你能用 promise 实现一个 promise.all 和 race 么?

<!-- more -->

## 实现

<<< @/code/promise-all/index.js

## promise.race 和 all 同理，更简单

去掉 `count` 计数, 任意一个状态扭转成功后就返回

<<< @/code/promise-race/index.js
