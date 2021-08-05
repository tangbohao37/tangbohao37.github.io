---
title: 手写bind
tags:
  - 手写js
categories:
  - 前端
date: 2021-08-04 22:03:03
---

你应该知道 bind/apply/call 的区别哈，那你能手写一个 bind 么？ 我：wtf。。。。

<!-- more -->

### bind

- bind 方法会创建一个新的函数，在 bind() 被调用时，这个新函数的 **this** 被指定为 bind() 的第一个参数，而**其余参数**（是的， bind 是有多个参数，只是我们平时只用一个）将作为新函数的**预置**参数，供调用时使用。

### 原版使用

```javascript
// 浏览器环境
var a = 2;
function fn() {
  let a = 1;
  console.log(this.a);
  console.log(arguments);
}

let obj = {
  a: 3,
};

const _fn = fn.bind(obj, [4, 5]);
_fn(6, 7); //  3   [[4,5],6,7]
fn(); // 2  undefined
```

### 手写一个 bind

{% include_code lang:javascript bind/index.js %}

### 那 call / apply 呢？

{% include_code lang:javascript bind/call_apply.js %}
