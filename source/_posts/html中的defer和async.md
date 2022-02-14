---
title: html中的defer和async
tags:
  - 标签
categories:
  - 前端
date: 2021-10-14 14:56:37
---

defer 和 async 的区别是什么？

<!-- more -->

### 对比

defer 和 async 都是 script 标签的属性 其实 script 定义的属性除了 src 或者 type 并不只是这两个 还有 charset / crossorigin /integrity 等等。只是面试喜欢问 defer 和 async 的区别

1. 不使用时：
   没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。

   - 总结下就是 读到这里就执行这个脚本。并阻塞后续文档的加载。 (所以我们喜欢把 script 放在文档的末尾)

```html
<script src="script.js"></script>
```

2. async
   有 async 加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）

   - 总结下就是 文档 和 script 的加载同步执行

```html
<script async src="script.js"></script>
```

3. defer
   有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后, DOMContentLoaded 事件触发之前完成

   - 总结下就是加载过程和 async 一样都是同步加载。 但不一样的是 script 不执行。 等 DOMContentLoaded 之后再执行

```html
<script defer src="myscript.js"></script>
```

一图胜千言:
![defer 和 async](/images/defer和async.jpeg)

### 总结使用:

1. defer 和 async 在网络读取（下载）这块儿是一样的，都是异步的（相较于 HTML 解析）
2. 它俩的差别在于脚本下载完之后何时执行，显然 defer 是最接近我们对于应用脚本加载和执行的要求的
3. 关于 defer，此图未尽之处在于它是按照加载顺序执行脚本的，这一点要善加利用
4. async 则是一个乱序执行的主，反正对它来说脚本的加载和执行是紧紧挨着的，所以不管你声明的顺序如何，只要它加载完了就会立刻执行
5. 仔细想想，async 对于应用脚本的用处不大，因为它完全不考虑依赖（哪怕是最低级的顺序执行），不过它对于那些可以不依赖任何脚本或不被任何脚本依赖的脚本来说却是非常合适的，最典型的例子：Google Analytics
