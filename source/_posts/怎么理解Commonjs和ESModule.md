---
title: 怎么理解Commonjs和ESModule
tags:
  - js
categories:
  - 前端
date: 2021-08-13 00:02:00
---

关于 commonjs 和 ES Module 本质的思考 [本文摘自掘金](https://juejin.cn/post/6994224541312483336)

<!-- more -->

# 先来几个问题

1 Commonjs 和 Es Module 有什么区别 ？
2 Commonjs 如何解决的循环引用问题 ？
3 既然有了 exports，为何又出了 module.exports ? 既生瑜，何生亮 ？
4 require 模块查找机制 ？
5 Es Module 如何解决循环引用问题 ？
6 exports = {} 这种写法为何无效 ？
7 关于 import() 的动态引入 ？
8 Es Module 如何改变模块下的私有变量 ？

# commonjs 说起

## commonjs 使用

在使用 规范下，有几个显著的特点。

- 在 commonjs 中每一个 js 文件都是一个单独的模块，我们可以称之为 module；
- 该模块中，包含 CommonJS 规范的核心变量: exports、module.exports、require；
- exports 和 module.exports 可以负责对模块中的内容进行导出；
- require 函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容；

### 先看看如何使用的

- 导出

```javascript
let name = '小唐同学';
module.exports = function sayName() {
  return name;
};
```

- 导入

```javascript
const sayName = require('./hello.js');
module.exports = function say() {
  return {
    name: sayName(),
    author: '我不是外星人',
  };
};
```

思考 2 个问题：

- commonjs 如何解决变量污染的
- module.exports exports require 三者如何工作的？

## commonjs 实现原理

已知条件：每个模块上存在 module , exports , require , `__filename` ,`___dirname` ,虽然我们没有对其定义但可以直接使用

- module :用于记录模块信息
- exports : 当前模块导出的属性
- require : 引入模块
- `__filename` : 当前模块文件的绝对路径 /a/b/c.js
- `__dirname` : 当前模块的目录路径 /a/b

在编译的过程中，实际 Commonjs 对 js 的代码块进行了首尾包装， 我们以上述的代码为例子，它被包装之后的样子如下：

```javascript
(function (exports, require, module, __filename, __dirname) {
  let name = '小唐同学';
  module.exports = function sayName() {
    return name;
  };
});
```

在 Commonjs 规范下模块中，会形成一个包装函数，我们写的代码将作为包装函数的执行上下文，使用的 require ，exports ，module 本质上是通过形参的方式传递到包装函数中的。

大概是这样:

{% include_code lang:javascript commonjs和ESModule.js/common.js %}

## commonjs 文件加载流程

![缓存执行流程](/images/require文件加载流程.webp)

### 文件引入流程与处理

commonjs 模块同步加载并执行文件模块, 在执行阶段分析模块依赖, 采用深度优先遍历，执行顺序为 父-> 子-> 父

{% include_code lang:javascript commonjs和ESModule.js/a.js %}

{% include_code lang:javascript commonjs和ESModule.js/b.js %}

{% include_code lang:javascript commonjs和ESModule.js/main.js %}

node main.js 执行结果：

(结果)[/images/main 执行结果.png]

根据结果可以得出一下结论

- `main.js` 和 `a.js` 都引入了 `b.js` 但是 `b.js` 只执行了一次
- `a.js` 和 `b.js` 模块相互引用, 但是**没有**出现循环引用
- 执行顺序 父-> 子 -> 父

问题来了。 commonjs 如何实现以上效果的

## require 加载原理

需要明白 2 个概念 module 和 Module

module: 在 node 中 每个 js 文件 都是一个 module , module 上保存了 exports 等信息之外还有一个 loaded 表示该模块是否被加载

Module: node 整个系统运行之后, 会用 Module 缓存每个模块的加载信息

{% include_code lang:javascript commonjs和ESModule.js/require.js %}

require 大致流程：

- require 会接收一个参数——文件标识符，然后分析定位文件，分析过程我们上述已经讲到了，接下来会从 Module 上查找有没有缓存，如果有缓存，那么直接返回缓存的内容。

- 如果没有缓存，会创建一个 module 对象，缓存到 Module 上，然后执行文件，**加载完文件**，将 loaded 属性**设置为 true** ，然后返回 module.exports 对象。借此完成模块加载流程。

- 模块导出就是 return 这个变量的其实跟 a = b 赋值一样， 基本类型导出的是值， 引用类型导出的是引用地址。

- exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports， 所以对 exports 进行赋值会导致 exports 操作的不再是 module.exports 的引用。

### require 如何避免重复加载的

从上面可以了解到。由于有缓存的缘故，对于第二次 require 一个模块 会直接读取缓存的 module 无需再次执行

### require 避免循环引用

同样是依靠缓存来解决的这个问题 , 已经加载了所以不会再次执行.
但有一点需要注意。

> 由于 a.js 虽然打上了 cache 标记 还没有加载完成 (loaded =false) 所以这个时候是 {} 空对象

(结果)[/images/mian 异步执行结果.png]

### exports 和 module.exports

系统分析完 require ，接下来我们分析一下，exports 和 module.exports，首先看一下两个的用法。

#### exports

```javascript
exports.name = `小唐`;
exports.say = function () {
  console.log(666);
};

// 引用
const a = require('./a');
console.log(a);
```

exports 就是传入到当前模块内的一个对象，本质上就是 module.exports。

问题：为什么 exports={} 直接赋值一个对象就不可以呢？ 比如我们将如上 a.js 修改一下：

```javascript
exports = {
  a: 123,
};
```

(结果)[/images/export 使用.png]

理想情况下是通过 exports = {} 直接赋值，不需要在 exports.a = xxx 每一个属性，但是如上我们看到了这种方式是无效的。为什么会这样？实际这个是 js 本身的特性决定的。

> 通过上述讲解都知道 exports ， module 和 require 作为形参的方式传入到 js 模块中。我们直接 exports = {} 修改 exports ，等于重新赋值了形参，那么会重新赋值一份，但是不会在引用原来的形参()。举一个简单的例子

```javascript
function wrap(myExports) {
  myExports = {
    name: '我不是外星人',
  };
}

let myExports = {
  name: 'alien',
};
wrap(myExports);
console.log(myExports); // {name : 'alien'}
```

> 我们期望修改 myExports ，但是没有任何作用。
> 假设 wrap 就是 Commonjs 规范下的包装函数，我们的 js 代码就是包装函数内部的内容。当我们把 myExports 对象传进去，但是直接赋值 myExports = { name:'我不是外星人' } 没有任何作用，相等于内部重新声明一份 myExports 而和外界的 myExports 断绝了关系。所以解释了为什么不能 exports={...} 直接赋值。

#### module.exports

module.exports 本质上就是 exports ，我们用 module.exports 来实现如上的导出。

```javascript
module.exports = {
  name: '《React进阶实践指南》',
  author: '我不是外星人',
  say() {
    console.log(666);
  },
};

module.exports = function () {
  // ...
};
```

> 从上述 require 原理实现中，我们知道了 exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports 。那么这就说明在一个文件中，我们最好选择 exports 和 module.exports 两者之一，如果两者同时存在，很可能会造成覆盖的情况发生。比如如下情况：

```javascript
exports.name = 'alien'; // 此时 exports.name 是无效的
module.exports = {
  name: '《React进阶实践指南》',
  author: '我不是外星人',
  say() {
    console.log(666);
  },
};
```

### Q & A

1 那么问题来了？既然有了 exports，为何又出了 module.exports?

答：如果我们不想在 commonjs 中导出对象，而是只导出一个类或者一个函数再或者其他属性的情况，那么 module.exports 就更方便了，如上我们知道 exports 会被初始化成一个对象，也就是我们只能在对象上绑定属性，但是我们可以通过 module.exports 自定义导出 除去对象外的其他类型元素。

2 与 exports 相比，module.exports 有什么缺陷 ？

答：module.exports 当导出一些函数等非对象属性的时候，也有一些风险，就比如循环引用的情况下。对象会保留相同的内存地址，就算一些属性是后绑定的，也能间接通过异步形式访问到。但是如果 module.exports 为一个非对象其他属性类型，在循环引用的时候，就容易造成属性丢失的情况发生了。

# ES Module

Nodejs 借鉴了 Commonjs 实现了模块化 ，从 ES6 开始， JavaScript 才真正意义上有自己的模块化规范，

Es Module 的产生有很多优势，比如:

- 借助 Es Module 的静态导入导出的优势，实现了 tree shaking。
- Es Module 还可以 import() 懒加载方式实现代码分割。

具体用法就不细说了

## ES Module 特性

1. 静态语法

ES6 module 的引入和导出是静态的，import 会自动提升到代码的顶层 ，import , export 不能放在块级作用域或条件语句中。

2. 执行特性

ES6 module 和 Common.js 一样，对于相同的 js 文件，会保存静态属性。

但是与 Common.js 不同的是 ，CommonJS 模块同步加载并执行模块文件，ES6 模块提前加载并执行模块文件，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历，执行顺序是 **子 -> 父**（入口文件最后执行）。

为了验证这一点，看一下如下 demo。

{% include_code lang:javascript commonjs和ESModule.js/es/main.js %}

{% include_code lang:javascript commonjs和ESModule.js/es/a.js %}

{% include_code lang:javascript commonjs和ESModule.js/es/b.js %}

结果：
![main.js执行结果](/images/es执行.webp)

3. 导出绑定

```javascript
export let num = 1;
export const addNumber = () => {
  num++;
};

import { num, addNumber } from './a';
num = 2; // 直接修改则报错
```

接下来对 import 属性作出总结：

- 使用 import 被导入的模块运行在严格模式下。
- 使用 import 被导入的变量是只读的，可以理解默认为 const 装饰，无法被赋值
- 使用 import 被导入的变量是与原变量绑定/引用的，可以理解为 import 导入的变量无论是否为基本类型都是引用传递。

# 总结

## commonjs：

- CommonJS 模块由 JS 运行时实现。
- CommonJs 是单个值导出，本质上导出的就是 exports 属性。
- CommonJS 是可以动态加载的，对每一个加载都存在缓存，可以有效的解决循环引用问题。
- CommonJS 模块同步加载并执行模块文件。

## ES Module

- ES6 Module 静态的，不能放在块级作用域内，代码发生在编译时。
- ES6 Module 的值是动态绑定的，可以通过导出方法修改，可以直接访问修改结果。
- ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
- ES6 模块提前加载并执行模块文件，
- ES6 Module 导入模块在严格模式下。
- ES6 Module 的特性可以很容易实现 Tree Shaking 和 Code Splitting。
