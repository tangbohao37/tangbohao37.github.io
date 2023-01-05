---
title: 深入promise
tags:
  - 手写js
categories:
  - 前端
date: 2021-08-02 22:36:41
---

面试官：你如何理解 promise，能手写一个么？ 答：。。。。

<!-- more -->

要了解 promise 的细节需要看 promise A+ 规范。[链接名称](https://promisesaplus.com/) 英文太多了，不看了直接上手写源码

## 原生 Promise 的使用

```javascript
let p = new Promise((resolve, reject) => {
  resolve('resolve');
  reject('reject');
});

// then 是有2个参数的。 但平时我们一般只用1个 这里需要注意下
p.then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);

p.catch((err) => {
  console.log(err);
});
```

## 开始尝试手写 Promise

### 1.搭建代码框架

第一步创建搭建代码框架

- 这里需要在构造函数传入一个执行器 ，并立即执行
- then 方法需要传入 2 个参数,用于执行返回结果 onFulfilled, onRejected
- 创建 resolve, reject 方法用于触发状态扭转

<<< @/code/promise/promise1.js

测试一下

<<< @/code/promise/test1.js

### 2.加入异步

第一步处理同步任务没问题但是处理异步任务就 gg

```javascript
// 测试异步
let p = new MyPromise1((resolve, reject) => {
  setTimeout(() => {
    resolve('do resolve');
  }, 10);
});

p.then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);
//  结果 ： 空
```

- 因为状态扭转在异步中执行的,then 无法探查到, 我们加入一个回调队列,用于将回调方法存起来, 等状态扭转后再执行

<<< @/code/promise/promise2.js

测试一下

<<< @/code/promise/test2.js

### 3.实现链式调用

- then 需要支持链式调用, 那么他就需要返回一个 **新的 promise** 对象, 而不能是 this
  - 因为如果返回了 this 那么两个 promise 的状态相同, 内部状态是不能改变的,
  - 而且每次使用 promise 的参数值是取决于上一次 then 的返回值,所以不能使用 this
- 新返回的 promise 由于需要在 init 之后使用 , 否则语法报错 , 所以需要加入一个微任务 queueMicrotask(()=>{ //处理新创建的 promise })
- 由于 then 的 return 需要作为下一次 then 的参数, 所以需要进行判断
  - 如果 return 的是一个新的 promise 那么就需要判断他的状态
  - 如果是普通 value 那么直接 resolve 掉
- 如果 then 返回的是自己则报错

<<< @/code/promise/promise3.js

测试一下

<<< @/code/promise/test3.js

### 4.实现捕获异常，并变更状态

<<< @/code/promise/promise4.js

测试一下

<<< @/code/promise/test4.js

### 5.then 为可选参数 修改 pending 状态代码 增加 resolve/reject 静态方法

- 静态的 resolve/reject 需要返回 promise

<<< @/code/promise/promise5.js

测试一下

<<< @/code/promise/test5.js
