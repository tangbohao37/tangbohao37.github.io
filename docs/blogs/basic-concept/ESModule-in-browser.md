---
# title: 浏览器中的ESModule
# tags:
#   - 标签
# categories:
#   - 前端
# date: 2022-02-02 18:24:09
---

目前浏览器开始逐步支持原生 ESModule,那么如何理解这个特性呢?对于开发而言又会产生哪些变化呢?
本文参考自[张鑫旭的博客](https://www.zhangxinxu.com/wordpress/2018/08/browser-native-es6-export-import-module/)

## 兼容性(2022-2-11)

![静态import](/images/can-i-use-modules-script.png)

![动态import](/images/can-i-use-dynamic.png)

目前主流浏览器版本均已支持

## 静态 import

当我们给 script 标签 加上 `type="module"` 时,浏览器就会自动把 內联或者外链的 script 认为是 ESModule .

<<< @/code/browser-ESModule/test-static-import.html

<<< @/code/browser-ESModule/test.js

![结果](/images/browser-esmodule/1.png)

注意: 如果希望使用 node 命名规范的 ESModule (mjs) 需要在服务器端设置 mine type 为 `application/javascript`。

### 注意一些细节

1. 对于老旧浏览器不支持 ESModule 的情况，可以使用 `nomodule` 进行兼容

2. import 不支持裸露的说明符

```javascript
// 不支持
import { A } from 'xxx.mjs';
import { B } from 'utils/xx.mjs';

// 支持
import React from 'https://unpkg.com/react@17/umd/react.development.js';
import { foo } from '/utils/bar.mjs';
import { foo } from './bar.mjs';
import { foo } from '../bar.mjs';
```

3. 默认按 defer([defer 和 async 详情](./html中的defer和async)) 行为的顺序加载

- defer 简单说明

```html
<!-- 同步 -->
<script src="1.js"></script>

<!-- 异步但顺序保证 -->
<script defer src="2.js"></script>
<script defer src="3.js"></script>
```

- module

```html
<!-- module 默认外挂defer -->
<script type="module" src="1.mjs"></script>

<!-- 硬加载嘛 -->
<script src="2.js"></script>

<!-- 比第一个要晚一点 -->
<script defer src="3.js"></script>
<!-- 最终加载顺序 2,1,3 -->
```

- 内敛的 module

```html
<!-- 默认 defer -->
<script type="module">
  console.log('Inline module执行');
</script>

<!-- 硬加载 -->
<script src="1.js"></script>

<!-- 内敛 script 没有defer概念，因此写了没有用等于 硬加载 -->
<script defer>
  console.log('Inline script执行');
</script>

<script defer src="2.js"></script>
<!-- 最终顺序 1.js -> Inline script -> Inline module ->2.js -->
```

4. 支持 `async`

```html
<!-- firstBlood模块一加载完就会执行 -->
<script async type="module">
  import { pColor } from './firstBlood.mjs';
  pColor('red');
</script>

<!-- doubleKill模块一加载完就会执行 -->
<script async type="module" src="./doubleKill.mjs"></script>
```

5. 总是跨域
   需要资源服务器端配置 `Access-Control-Allow-Origin` 字段

6. 天然无凭证
   如果请求来自同一个源（域名一样），大多数基于 CORS 的 API 将发送凭证（如 cookie 等），但 fetch()和模块脚本是例外 – 除非您要求，否则它们不会发送凭证。

## 动态 import

<<< @/code/browser-ESModule/test-dynamic-import.html

![结果](/images/browser-esmodule/2.png)

### 一点细节

1. `import()` 和 `静态 import` 一样不能是裸露的地址。
2. 不同的是 `import()` 可以直接使用在 script 标签中 因此它没有 `type="module>"` 的限制
3. `import()` 总是跨域
