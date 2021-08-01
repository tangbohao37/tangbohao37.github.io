---
title: 关于webpack抽离配置文件的思考
date: 2019-12-23 21:43:33
tags:
    - webpack
categories:
    - [前端, webpack]
---

大部分项目开发使用的环境和生产环境有较大差异，且前后端通过 API 进行通信，部署生产项目时必须大量修改配置重新打包。有时候可能仅仅是配置文件的微小改变却需要重新打包部署发布，对于我们本就心力憔悴的程序员来说又是一种折磨。so 我们需要一种更加便利的配置加载方式！

## <!-- more -->

> 目标：分离出 prod 配置文件，同时保留 dev 的配置。根据 webpack 得 mode 字段判断当前环境。打包后在不同的环境自动使用不同的配置文件，同时在生产环境可以根据需求动态修改，无需重新打包部署

#### 思路：

在大量浏览网上的解决方案后，发现大致方法分为 3 种。

> 1. 建立 globalConfig.json 文件用来存放配置，打包的时候分离出这个 json。在项目初始化的时候再异步加载该文件。

-   思考：个人认为是一种很不错的思路，但是如果个别项目前期初始化需要做大量的逻辑判断或多个异步操作，这个时候异步就显得有些难以控制了，必须用 async/await 将异步改为同步，需要前期做好规划。

> 2. 网上还有一种方式是通过 webpack 的 [generate-asset-webpack-plugin](https://www.npmjs.com/package/generate-asset-webpack-plugin) 插件，在打包的时候读取一份 json 然后再重新生成一份配置文件。

-   思考：这种打包方式更能把 webpack 的能力发挥到极致，本想仔细研究的，但是由于小弟实在是没有找到这个插件的详细文档，且常年没有更新，貌似已经被抛弃了，因此有太多不确定性 so 放弃了种方式

> 3. 利用浏览器的 window 全局对象。先项目中建立一个 globalConfig.js，在打包时在 html 里先加载这个文件，将配置文件注入到 window 全局对象中。然后执行后面的初始化逻辑。

-   思考：目前来讲个人认为这是一个简单且可靠的方式。虽然大家都知道占用全局变量是一个不好的习惯，但毕竟是 API 配置文件其重要性不言而喻，so 占用一个全局变量也无伤大雅吧~

#### 实现：

> 环境：使用 vue3，webpack4 未使用 vue-cli

-   手写一个最基础的 webpack 配置，这里只设置了开发 dev 和生产环境 prod 两种配置，vue 能跑通就行~~ 重点是在打包时根据 process.env. NODE_ENV 判断应该使用 dev 还是 prod 的配置文件。在 build 生产环境时利用 copy-webpack-plugin 插件将 prodGlobalConfig.js 复制到 dist 下，然后再 html(需要使用简单的 ejs 语法)中加载即可

```
├── build
│   ├── webpack.config.base.js
│   ├── webpack.config.dev.js
│   └── webpack.config.prod.js
├── package-lock.json
├── package.json
├── public
│   ├── devGlobalConfig.js  <===你的开发环境config
│   ├── index.html
│   └── prodGlobalConfig.js <===正式环境config
└── src
    ├── App.vue
    ├── main.js
    ├── store
    │   ├── config.js
    │   └── index.js
    └── utils
        └── getConfig.js   <===定义根据环境获取配置的工具函数
```

webpack.config.prod.js: 使用 CopyWebpackPlugin 将配置文件复制到打包目录

```
const common = require("./webpack.config.base.js");
const marge = require("webpack-merge");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = marge(common, {
    mode: "production",
    output: {
        filename: "[name].[chunkhash].bundle.js"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([     <== 将生产环境配置文件拷贝到最终的打包目录下
            {
                context: path.resolve(__dirname,'..'),
                from: "./public/prodGlobalConfig.js",
                to: "."
            }
        ])
    ]
});

```

prodGlobalConfig.js：

```
// 生产环境配置项
window.globalConfig = {
    text: "prod"
};
```

devGlobalConfig.js：

```
 // 开发环境
const devConfig = {
    text: "dev"
};
export { devConfig };
```

getConfig.js：根据 process.env. NODE_ENV 判断当前所处的环境，返回不同的配置文件

```
import { devConfig } from "../../public/devGlobalConfig";

const getConfig = function() {
    if (process.env.NODE_ENV === "production") {
        return window.globalConfig;
    } else {
        return devConfig;
    }
};

export { getConfig };
```

main.js： 简单处理。直接将配置文件写入根对象

```
import Vue from "vue";
import { getConfig } from "./utils/getConfig";
import App from "./App.vue";

Vue.prototype.globalConfig = getConfig();

new Vue({
    el: "#app",
    render: h => h(App)
});
```

index.html：使用 ejs 语法判断所处环境，控制是否加载文件

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title><%= htmlWebpackPlugin.options.title %></title>
    </head>
    <body>
        <div id="app"></div>
        <!-- 判断当前环境 -->
        <% if(process.env.NODE_ENV==='production'){%>
        <script src="./prodGlobalConfig.js" type="text/javascript"></script>
        <% }%>
    </body>
</html>
```
