---
title: 设计模式-命令模式
tags:
  - 命令模式
categories:
  - 设计模式
date: 2021-10-12 22:54:29
---

# {{ $frontmatter.title }}

命令模式中的命令（command）指的是一个执行某些特定事情的指令。

命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

## oop 思想的命令模式

<!-- {% include_code to:29 lang:javascript design-pattern/command-pattern.js %} -->

<<< @/code/design-pattern/command-pattern.js

## js 中的命令模式

在 oop 的命名模式中，通常需要把命令封装为一个对象，将接收者存储在对象中。但以上步骤其最终目的是把命令传递到接收者并执行 execute()。 也就是传递一个 function 但在 js 的世界里传递函数是一个理所当然的事儿，而存储 接收者也完全可以用闭包实现。并不需要去 new 一个对象。

<<< @/code/design-pattern/command-pattern.js

<!-- {% include_code from:30 lang:javascript design-pattern/command-pattern.js %} -->
