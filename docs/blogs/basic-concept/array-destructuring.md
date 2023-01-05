---
title: 数组解构赋值
date: 2019-12-31 15:25:25
tags:
  - 解构

categorites:
  - [前端, ES6]
---

根据阮一峰的《ECMAScript 6 入门》的教程所做的一些个人总结和思考

<!-- more -->

#### 定义

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构

#### 示例摘要

```
let [a, b, c] = [1, 2, 3];

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []   //空数组
```

set 解构也可以用数组遍历

```
let [a,b,c] = new Set([1,2,3])
```

> 只要数据具有 Iterator 接口，均可以被解构

##### 可使用默认值

```
let [a=123]=[undefined]
/// a = 123

let [x =1 ]= [ undefined ]
// x = 1

let [ x = 2] = [null]
//x = null
```

由于 ES6 中使用严格相等运算符(====)，所以只有元素严格等于 undefined 时才生效

- 惰性求值

解构中如果默认的值是一个表达式，则在使用时才会执行。

- 对象解构

```
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;   // 指定解构为新变量
f // 'hello'
l // 'world'
```

上例对象解构中 foo 为解构模式，baz 为被赋值变量，即 key 为解构模式，value 为目标变量。

这里可以使用 ES6 的新特性，简写为下面的情况，

```
const { log } = console;
// 完整写法 const { log:log}=console
log('hello') // hello
```

- 注意：解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值，都会报错。

```
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```
