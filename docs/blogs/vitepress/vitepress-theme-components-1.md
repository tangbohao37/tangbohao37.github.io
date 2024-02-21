# 如何用 vitepress 实现能实时编辑的 react 的组件库站点

对于 vue3 vitepress 有着很好的支持,但是对于 react 组件的渲染和实时编辑, vitepress 并没有提供现成的解决方案,因此本文将介绍如何实现这个需求.

[demo 在这里](https://tangbohao37.github.io/vitepress-theme-components/demo/button.html)

## why ？

vitepress 天然不支持 react 为什么还要用 vitepress 呢?

因为本人所在公司 `vue3` 和 `react` 技术栈同时存在,需要考虑兼容场景。因此希望能够在 `vitepress` 中实现 `react` 组件的渲染和实时编辑,以便于公司内部的组件库的展示和使用.

同类型的 `dumi` 基于 `webpack` 比较慢。`storybook` 虽然可以改为 `vite` 构建, 但是配置上手成本高,且部分插件收费,体验也不抬好

## 组件库站点需求梳理

_这里只考虑站点需求,并非组件库需求._

1. 组件展示与示例展示: 显示所有组件的列表，并提供详细的示例和文档，以便用户了解每个组件的用途和如何使用
2. _**提供可视化/可交互式示例: 为每个组件提供交互式示例，以便用户可以实时修改示例代码并实时查看结果**_
3. _**组件版本迭代记录回溯: 提供组件更新记录查询**_
4. 设计资源共享: 提供设计资源下载页面
5. 响应式布局
6. 多语言支持
7. _**组件稳定性保障: 对每个组件提供对应的单测覆盖率展示**_
8. _**组件 API 文档根据 ts 类型自动生成**_
9. 静态站点生成: 便于实现 cdn 加速.

这里的需求大部分都是 vitepress 已经有现成的,真正需要我们实现的只是第`2/3/7/8` 条,其中最难的应该是第 `2` 条,我们先从最难的开始

## 需求实现思路

::: tip 核心思路
vitepress 是用 markdown-it 来作为 md 渲染核心.虽然 vitepress 没有插件系统,但是提供了自定义 theme 能力,可以在 theme 中配置 markdown-it 插件来实现 md 的订制化渲染.
:::

这里默认认为你已经了解 vitepress 的基本使用,如果不了解,请先阅读 [vitepress 官方文档](https://vitepress.dev)

### 1. 组件展示与示例展示

对于 react 环境而言，由于 vitepress 本身是基于 vue3 的并不支持 react. 这里有 2 个思路来实现 react 组件的渲染

::: info 2 种思路

1. 通过 vitepress 的 markdown-it 插件来实现 react 的渲染(相当于增加一套 react 支持)
2. 将 react 转成 vue3 能识别的代码,然后通过 vitepress 原生渲染

:::

这里使用第二种方案,因为第一种方案工程量太大.

::: tip 难点问题

1. Q:如何将 react 代码转为 vue3 能识别的代码

   A:对于 vue3/react 技术栈互相转换的场景 可以使用 [veaury](https://github.com/devilwjp/veaury) 来实现, 丝滑且简单

2. Q:如何实现 react 代码的实时编译

   A:实时编译可以使用[react-live](https://github.com/FormidableLabs/react-live) 来实现

:::

#### 开始实现

初始化 vitepress 项目等过程略过,直接开干

安装依赖 `react-live`

根目录下创建 `site` 文件夹,用于存放 theme 相关组件,

```
.
├── LICENSE
├── README.md
├── .vitepress // vitepress 配置文件
├── components // 组件存放
├── example // 存放示例代码
├── docs // 文档存放
├── package.json
├── pnpm-lock.yaml
├── site   // 专门存放自定义 theme 相关文件
└── vitest.config.ts // 单测配置文件
```

由于涉及 react / vue 混合开发，单独在 site 下创建 `react-components` 文件

```
./site
├── components // vue 组件
│   ├── live-editor.vue
├── constant
│   └── index.ts
├── plugins // md 插件
│   └── index.ts
├── react-components // react 组件
│   ├── index.js
│   ├── index.tsx
│   ├── react-live.js
│   └── react-live.tsx
├── styles
│   └── react-live.css
└── types
    └── index.ts
```

#### 1. 编写 react 渲染容器组件

```tsx
// site/react-components/index.tsx
import { FC, useMemo } from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import { importRegex } from '../constant';
import '../styles/react-live.css';

export interface IReactLive {
  sourceCode?: string; // react 代码
  scope?: Record<string, any>; // react 代码中需要引入的依赖，提供给 sucrase 编译使用
  noStyle?: boolean; // 是否需要默认样式
}

export const ReactLive: FC<IReactLive> = ({
  sourceCode,
  scope,
  noStyle = false
}) => {
  const demoLogicCode = useMemo(() => {
    return sourceCode?.replace(importRegex, '').trim();
  }, [sourceCode]);

  return (
    <div className="react-live-comp-wrapper">
      <LiveProvider code={demoLogicCode} scope={scope} noInline>
        <div className={noStyle ? '' : 'react -live-comp-demo-wrapper'}>
          <LivePreview />
          <LiveError />
        </div>
      </LiveProvider>
    </div>
  );
};
```

2. react 渲染容器编译

安装依赖 `swc`

因为 `veaury` 转换代码似乎不能直接识别 tsx 的 react 组件。因此这里需要先吧组件编译为 js 再进行转换

```bash
npx swc ./site/react-components/*.tsx -d ./site/ -C jsc.transform.react.runtime=automatic
```

目前有了 react 的渲染容器, 由于 vitepress 是基于 vue3 的.因此我们需要一个 vue3 组件来承载这个 react 容器,这样才能在 vitepress 中正常渲染
