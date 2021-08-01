---
title: babel入门
date: 2020-01-03 22:45:15
tags: 

    - babel

categories: 

    - [前端 , babel]

---

根据阮一峰的 [《Babel 入门教程》](http://www.ruanyifeng.com/blog/2016/01/babel.html)的教程所做的一些个人总结和思考
<!-- more -->

babel已经成为前端开发的基础依赖。so 借助阮大神的教程学习一下。目前babel已经更新到7.0并改包名为@babel。

#### babel功能

平时我们用ES5+编写代码，但是浏览器和node环境还不完全支持最新的语法（如最常见的箭头函数）。那么babel作为一个编译器的角色将我们的代码再次转换为环境所能识别的代码。

#### 关于配置文件

babelrc 是babel的配置文件，babel如何转换代码，包括支持哪些语法全由这个配置文件决定！

``` 
{
  "presets": [],  <===== 配置你的转码规则集合
  "plugins": []   <===== 根据插件配置你的转码规则
}
```

##### babel.config.js和.babelrc的区别

babel.config.js 以编程的方式进行配置且会将node_modules的包也一同转换；
.babelrc 仅转换你的工程文件

 官方解释：
 - You want to programmatically create the configuration?
 - You want to compile node_modules?

> babel.config.js is for you! 

* You have a static configuration that only applies to your simple single package?

> .babelrc is for you!

##### plugins

> 官方解释：Babel is a compiler (source code => output code). Like many other compilers it runs in 3 stages: parsing, transforming, and printing.

babel的插件一般会拆分成很小的粒度，可以按需引入

pulugins 是一个插件数组，你只需要按需配置你的插件用来制定你的代码该 如何解析，如何转换，如何输出你的代码。（当然大部分时候只需要无脑使用就行了，不需要太多配置）
如果有多个配置项，**按顺序解析！！**

##### preset

由于 plugin 可以按需配置，但是过多的配置又让人心力憔悴，所以就有了preset
这个可以看作是一堆插件的集合。
如果有多个preset 为了向后兼容采用的 **倒叙解析**

##### presets与plugins 的顺序问题

再配置文件中的presets和plugins 会先执行 plugins的配置，再执行presets 

``` 
{
  "plugins": [                    //按顺序先执行 plugins
    "transform-react-jsx",
    "transform-async-to-generator"
  ],
  "presets": [                    // 按倒叙再plugins执行完后执行
    "es2015",
    "es2016"    
  ]
}
````

> 未完待续...