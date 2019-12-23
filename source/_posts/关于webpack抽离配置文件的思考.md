---
title: 关于webpack抽离配置文件的思考
date: 2019-12-23 21:43:33
tags: 

    - webpack

categories: 

    - [前端,webpack]

---

# 关于webpack抽离api配置文件的思考

## 背景：

> 大部分项目开发使用的环境和生产环境有较大差异，且前后端通过API进行通信，部署生产项目时必须大量修改配置重新打包。有时候可能仅仅是配置文件的微小改变却需要重新打包部署发布，对于我们本就心力憔悴的程序员来说又是一种折磨。so 我们需要一种更加便利的配置加载方式！

## 思路：

> 在大量浏览网上的解决方案后，发现大致方法分为3种。

1. 建立globalConfig.json文件用来存放配置，打包的时候分离出这个json。在项目初始化的时候再异步加载该文件。

> - 思考：个人认为是一种很不错的思路，但是如果个别项目前期初始化需要做大量的逻辑判断或多个异步操作，这个时候异步就显得有些难以控制了，必须用 async/await将异步改为同步，需要前期做好规划。

2. 网上还有一种方式是通过webpack的 [generate-asset-webpack-plugin](https://www.npmjs.com/package/generate-asset-webpack-plugin) 插件，在打包的时候读取一份json然后再重新生成一份配置文件。

> - 思考：这种打包方式更能把webpack的能力发挥到极致，本想仔细研究的，但是由于小弟实在是没有找到这个插件的详细文档，且常年没有更新，貌似已经被抛弃了，因此有太多不确定性 so 放弃了种方式

3. 利用浏览器的window全局对象。先项目中建立一个globalConfig.js，在打包时在html里先加载这个文件，将配置文件注入到window全局对象中。然后执行后面的初始化逻辑。

> - 思考：目前来讲个人认为这是一个简单且可靠的方式。虽然大家都知道占用全局变量是一个不好的习惯，但毕竟是API配置文件其重要性不言而喻，so 占用一个全局变量也无伤大雅吧~

## 实现：

> 环境：使用vue3，webpack4未使用vue-cli 

> 目标：分离出prod配置文件，同时保留dev的配置。 打包后再不同的环境自动使用不同的配置文件

### 1. 初始化项目建立globalConfig.js文件

``` 
.
├── package.json
├── package-lock.json
├── public
│   ├── devGlobalConfig.js  //你的开发环境config
│   ├── globalConfig.js     //正式环境 config
│   └── index.html
├── README.en.md
├── README.md
├── src
│   ├── App.vue
│   ├── main.js
│   ├── store
│   └── utils
├── webpack.config.base.js   //基础webpack配置
├── webpack.config.dev.js    //开发环境
└── webpack.config.prod.js   //生产环境
```

