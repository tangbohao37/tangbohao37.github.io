---
title: 富文本到底在解决什么问题?
tags:
  - 富文本
categories:
  - 前端
date: 2022-02-21 19:34:50
---

为什么富文本被誉为“前端天坑”？具体有哪些坑？也有人称之为"前端天花板",又凭什么成为前端天花板？

<!-- more -->

## 经典版富文本(代表:早期轻量级编辑器如 UEditor)

### 1.content-editable 和 exeCommand

全局属性 content-editable 是富文本实现的核心,用于创建可编辑区域.而 document.exeCommand 用于触发命令,从而操作可编辑区域.

[这里有个最简单的富文本示例](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Editable_content#%E4%BE%8B%E5%AD%90%EF%BC%9A%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E4%BD%86%E5%AE%8C%E6%95%B4%E7%9A%84%E5%AF%8C%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8)

可以 cv 下来运行一下这个示例,这个示例基本上包含了大部分常用的富文本功能.这个编辑器看似没有任何问题所有的功能都正常渲染。但真正的问题就出在这看似正常的渲染里。

### 2.天坑的由来

分别用 chrome 和 firefox 运行一下。 随便输入点字符，然后**中间敲几个回车**

![对比](/images/rich-text-editor/1.png)

可以看见虽然他们长得一样，但实际上视图层的代码语义是完全不同的

```html
<!-- firefox结果 -->
<div class="rte-editbox" id="rte-editbox-0" contenteditable="true">
  <div>一串</div>
  <div><br /></div>
  <div><br /></div>
  <div>字符</div>
</div>

<!-- chrome结果 -->
<div class="rte-editbox" id="rte-editbox-0" contenteditable="true">
  一串
  <div><br /></div>
  <div><br /></div>
  <div>字符</div>
</div>
```

`一串` 这个首行字符在 firefox 下被认为是一个独立的子 div，而在 chrome 下认为是一个普通的字符.

那么这里就出现了语义上的分歧.而这种分歧在持续开发中还会有更多.而这成了富文本中的天坑。 因为 **exeCommand 并不属于 w3c 规范**,是完全浏览器自行实现的 api 并且对用户是完全黑盒状态，那天突然不支持了或者修改了都不好说。

在富文本的环境下我们要对 dom 进行精确操作但由于同样的 view 可能会有多种 dom 情况，并且很难一一列举需要在不停的使用中慢慢发现慢慢迭代，这也成了富文本开发的主要工作量之一。

> contentEditable 生成的 DOM 不总是符合我们的预期的。视觉上等价，但是在 DOM 结构上不是等价的。在平时 web 开发中 我们只需要关心视觉上的等价,在富文本中需要**双向等价**。

那么如何解决这个问题呢? 这个时候我们就需要用到类似 vue/react 的单向数据流的思维了。**如果我们弃用 exeCommand 并拦截掉浏览器默认渲染行为,所有的视图层由 data 驱动渲染,那么就可以保证 data 到 view 的一致性了** 而这就是如今的富文本编辑器的主流解决方案

## 现代版富文本(代表:draft-js,slate-js)

我们知道现代富文本编辑器的核心解决思路就是弃用 exeCommand 自己实现 data 到 view 的渲染。那么他们是如何实现的呢?

### 浅析 slate 工作流程

- 在富文本操作区域内 content-editable 被继续保留, 通过拦截用户事件触发自定义 command 指令。
- 指令的执行会生成 Operation 队列
- 每个 Operation 被逐个 apply 到编辑器数据模型(增删改), 根据不同的操作修改数据模型,同时将受影响的节点表示为 dirty path。
- 将标识出来的 dirty path 逐个 normalize (如合并相邻文本操作)
- 返回最新的 数据模型(data) 重新 render 正确的结果
<!-- 
TODO: flow 插件

````flow
start=>start: 渲染视图
event=>operation: 事件拦截触发 command
operation=>operation: 执行 command 生成 Operation 队列
apply=>operation: Operation 逐个 apply 修改数据模型生成 dirty path
dirty=>operation: normalize 构建 data
e=>end: 渲染视图

start->event->operation->apply->dirty->e
``` -->

> 很明显这就是一个单向数据流模型, 这也是富文本的标准解决方案了 draft.js 也是类似的单项数据流

### 现代富文本框架的瓶颈

随着时代的进步现代富文本的需求场景已经逐渐从**单人编辑**发展到了**多人协同**场景了.前面聊的 slate 可以很好的实现这个功能,slate 将 command 操作拆分为了粒度更小的 operation 队列.当我们把 operation 发送到对方, 对方便能拿到和我们一样的数据了

> 与其告诉对方自己生成了怎样的内容，不如再细致一点，告诉对方自己执行了怎样的操作

但问题在于多人协同场景,已经不仅仅是 pc 浏览器的范畴了,更有可能会是: A 在 PC Chrome 上编辑文档,B 在 ipad 上编辑,C 又在安卓上查看。

1. 由于 content-editable 依赖于浏览器,就意味着在多端适配上有天然的障碍.
2. 各浏览器对标签的渲染实现并不相同,同一个 h1 标签在 safari 和 chrome 上就有不同的 UI 呈现.
3. 除了 UI 呈现各浏览器实现不同,操作也有些许不同.如在 chrome 里 双击文本会拖蓝**一组词语**,而 firefox 双击则会拖蓝**一句话**

这些差异兼容性理论上都是可以用各种方式抹平,但这就是个无底洞每一次浏览器更新都会伴随新的问题出现

## 最终版富文本(代表:Google Docs/Office Word Online/iCloud Pages/ WPS ⽂字在线版/腾讯文档)

我们可以打开以上编辑器 F12 查看一下渲染元素,会发现这种大厂的编辑器都无一例外的放弃 dom 渲染,甚至只能看见整个输入页内只有一个 空的 canvas 或者 svg 或者 div.那他们如何完成页面渲染的呢? 很可惜这种终极富文本编辑器目前没有任何相关开源项目就项目解析文章都很少,只知道 google docs 是通过 canvas 重写一个渲染层。既然从写了整个渲染层那么之前提出的多端适配/UI 一致性几乎都可以解决了。

![google docs](/images/rich-text-editor/2.png)

毕竟既然解决不了浏览器的问题，那就把浏览器解决掉. 具体如何把浏览器无从得知,只知道极其困难。

最后用语雀文档的负责人的表格做一个直观的对比吧
![截取自'富文本编辑器的技术演进'](/images/rich-text-editor/3.png)
````
