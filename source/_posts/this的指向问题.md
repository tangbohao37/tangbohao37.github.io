---
title: this的指向问题
tags:
  - this
categories:
  - 前端
date: 2021-08-05 21:39:44
---

关于 this 的指向一直是一个迷,
(这里摘至)[https://juejin.cn/post/6844903891092389901]

<!-- more -->

## 默认绑定

- 默认绑定一般发生在回调函数,函数直接调用;

```javascript
function test() {
  // 严格模式下是 undefined
  // 非严格模式下是 window
  console.log(this);
}

//setTimeout的比较特殊
setTimeout(function () {
  //严格模式和非严格模式下都是window
  console.log(this);
});

arr.forEach(function () {
  //严格模式下是undefined
  //非严格模式下是window
  console.log(this);
});
```

## 隐式调用

- 这个通俗点用一句话概括就是谁调用就是指向谁

```javascript
const obj = {
  name: 'joy',
  getName() {
    console.log(this); //obj
    console.log(this.name); //joy
  },
};
obj.getName();
```

## 显示绑定 call,apply,bind

```javascript
const obj1 = {
  name: 'joy',
  getName() {
    console.log(this);
    console.log(this.name);
  },
};

const obj2 = {
  name: 'sam',
};

obj1.getName.call(obj2); //obj2 sam
obj1.getName.apply(obj2); //obj2 sam
const fn = obj1.getName.bind(obj2);
fn(); //obj2 sam
```

## new 绑定

```javascript
function Vehicle() {
  this.a = 2;
  console.log(this);
}
new Vehicle(); //this指向Vehicle这个new出来的对象
```

## es6 的箭头函数

- es6 的箭头函数比较特殊,箭头函数 this 为父作用域的 this，不是调用时的 this.
- 要知道前四种方式,都是调用时确定,也就是动态的,而箭头函数的 this 指向是静态的,声明的时候就确定了下来.比较符合 js 的词法作用域吧

```javascript
window.name = 'win';
const obj = {
  name: 'joy',
  age: 12,
  getName: () => {
    console.log(this); //其父作用域this是window,所以就是window
    console.log(this.name); //win
  },
  getAge: function () {
    //通过obj.getAge调用,这里面this是指向obj
    setTimeout(() => {
      //所以这里this也是指向obj 所以结果是12
      console.log(this.age);
    });
  },
};
obj.getName();
obj.getAge();
```

## 5 种 this 绑定的优先级

> 箭头函数 -> new 绑定 -> 显示绑定 call/bind/apply -> 隐式绑定 -> 默认绑定

