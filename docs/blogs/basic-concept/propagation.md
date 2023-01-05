---
title: 事件冒泡和捕获
tags:
  - 事件流
categories:
  - 前端
date: 2021-10-14 11:52:16
---

什么是事件冒泡？如何阻止？什么是事件捕获？如何阻止？

<!-- more -->

### 冒泡/捕获

在前端 dom 事件的世界中 除了 focus / onblur / scroll 几乎所有的事件默认都是冒泡的（因为 addEventListener 第三个参数默认为 false）。

在 dom 事件流里所有的事件都是经过先捕获再冒泡并在**冒泡阶段执行回调**。

- 阻止冒泡: `e.stopPropagation()` 或者 `e.cancelBubble = true`

- 捕获阶段执行: `addEventListener` 第三个参数为 true 即可。 (注意: 事件捕获后还是会继续向下传递的,只是在传递到 target Dom 之后不会再冒泡阶段执行)

- 捕获阶段执行并阻止向下传递: 将上述 2 个方法同时使用即可。 即： 在目标事件上加 `e.stopPropagation()` 并且 `addEventListener` 第三个参数为 true

### stopPropagation() / stopImmediatePropagation()

`e.stopPropagation` 和 `e.stopImmediatePropagation` 都有阻止冒泡的功能。 但是 `stopImmediatePropagation` 做得更彻底。它不光阻止事件冒泡，并将当前事件**后续绑定的其他函数一并阻止**。
