---
title: 设计模式-迭代器模式
tags:
  - 迭代器模式
categories:
  - 设计模式
date: 2021-10-07 17:53:20
---

# {{ $frontmatter.title }}

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

<!-- more -->

## 实现自己的迭代器

<<< @/code/design-pattern/iterator-pattern.js

<!-- {% include_code to:12 lang:javascript design-pattern/iterator-pattern.js %} -->

### 内部迭代器

上面的 each 函数就是一个内部迭代器，内部已经把迭代规则写好了，外部不用关心内部实现

### 外部迭代器

<<< @/code/design-pattern/iterator-pattern.js

<!-- {% include_code from:13 lang:javascript design-pattern/iterator-pattern.js %} -->

迭代器模式是一种相对简单的模式，简单到很多时候我们都不认为它是一种设计模式。目前的绝大部分语言都内置了迭代器。
