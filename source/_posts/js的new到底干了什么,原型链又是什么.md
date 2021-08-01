---
title: js的new到底干了什么，如何手写一个new
tags:
    - js
categories:
    - [前端, js原理]
date: 2021-07-29 23:44:03
---

let arr = new Array() 到底内部发生了什么? js 中的实例是如何创建出来的？它和 Object.create() 区别是什么？

<!-- more -->

### 原型链说起

> 每个实例对象（object）都有一个私有属性（称之为 `__proto__` ）指向它的**构造函数的原型对象**（`prototype`）。该原型对象也有一个自己的原型对象（`__proto__`），层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。

```javascript
let f = function () {
    this.a = 1;
    this.b = 2;
};
f.prototype.b = 3;
f.prototype.c = 4;

let o = new f();

console.log(o.__proto__ === f.prototype); // true
// 私有属性 __proto__ 指向了构造函数的原型对象

console.log(o.a); //  1
// a是o的自身属性吗？是的，该属性的值为 1

console.log(o.b);
// b是o的自身属性吗？是的，该属性的值为 2
// 原型上也有一个'b'属性，但是它不会被访问到。
// 这种情况被称为"属性遮蔽 (property shadowing)"

console.log(o.c); // 4
// c是o的自身属性吗？不是，那看看它的原型上有没有
// c是o.[[Prototype]]的属性吗？是的，该属性的值为 4

console.log(o.d); // undefined
// d 是 o 的自身属性吗？不是，那看看它的原型上有没有
// d 是 o.[[Prototype]] 的属性吗？不是，那看看它的原型上有没有
// o.[[Prototype]].[[Prototype]] 为 null，停止搜索
// 找不到 d 属性，返回 undefined
```

### new 内部发生了什么？原型链如何指向？

```javascript
let f = function () {
    this.a = 1;
    this.b = 2;
};
f.prototype.b = 3;
f.prototype.c = 4;

let o = new f();
console.log(o);
// o 为新创建的空对象，它的 __proto__ 指向 f.prototype
// o.__proto__  === f.prototype   // true
```

#### new 和 Object.create() 有什么区别？

```javascript
let fn = function () {
    this.a = 1;
    this.f = function () {
        console.log(f);
    };
};

let createFn = Object.create(fn);
// createFn 的原型 指向 传入的 fn 的地址
console.log(createFn.__proto__);
// VM513:1 ƒ () {
//     this.a = 1;
//     this.f = function () {
//         console.log(f);
//     };
// }
console.log(createFn.__proto__ === fn); // true
console.log(createFn.constructor === fn.constructor); // true
console.log(createFn.constructor === fn.prototype.constructor); // false

let newFn = new fn();
console.log(newFn.__proto__ === fn.prototype); // true
console.log(newFn.constructor === fn.constructor); // false
console.log(newFn.constructor === fn.prototype.constructor); // true
```

##### 对比 create 和 new 得知

-   create
-   -   `createFn.__proto__` === fn
-   -   `createFn.constructor` === fn.constructor
-   new
-   -   `newFn.__proto__` === fn.prototype
-   -   `newFn.constructor` === fn.prototype.constructor

也就是 create 的对象他的原型链都是指向 fn 本体的。而 new 的对象 都是指向 fn.prototype

### fn.constructor 和 fn.prototype.constructor 有什么关系

```javascript
// 还是这个栗子
let fn = function () {
    this.a = 1;
    this.f = function () {
        console.log(f);
    };
};
console.log(fn.prototype.constructor === fn); // true
console.log(fn.constructor === Function); // true
```

由上可知

-   一个对象的 fn.constructor 是指向其父类本体的
-   一个对象的 fn.prototype.constructor 是指向本体的

一张图就能明白：
![](/images/原型链.png)
