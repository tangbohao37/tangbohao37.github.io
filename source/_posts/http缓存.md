---
title: http缓存
tags:
  - 标签
categories:
  - 前端
date: 2021-08-11 22:23:27
---

什么是 http 缓存 ? 强缓存和协商缓存区别是什么 ? Cache-Control / Last-Modified / If-Modified-Since / Etag / If-None-Match 分别是什么？

<!-- more -->

### 重识 http 缓存

首先 http 缓存其实**并不是**只有强缓存/协商缓存。 这两个缓存只是 **(私有)浏览器缓存** 的分类。 [参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)

- http 缓存分类：
  - (私有)浏览器缓存 : 私有缓存只能用于单独用户
  - (共享)代理缓存 : 共享缓存可以被多个用户使用 如 IPS/web 代理服务器
- 缓存操作目标:
  - 一般为 get 请求

### 缓存控制 (http1.1:Cache-control 头 )

> Cache-Control: no-store 没有缓存 -> 每次由客户端发起的请求都会下载完整的响应内容

> Cache-Control: no-cache 缓存但每次重新验证 -> 有请求发出到服务器(会带上于缓存相关的验证字段), 服务器会验证, 若未过期则返回 304

> Cache-Control: public 公有缓存 即：(共享)代理缓存-> 可被任何中间人缓存(cdn/代理服务器等)

> Cache-Control: private 私有缓存 即：(私有)浏览器缓存 -> 中间人无法缓存(如 带有 HTTP 验证信息（帐号密码）的页面)

> Cache-Control: max-age=N 表示资源能够被缓存（保持新鲜）的最大时间-> max-age 是距离请求发起的时间的秒数。 需要与第一次请求 response 的 age(表示距离上一次有效请求的接收时间 ) 配合判断 .一般用于静态资源

> Cache-Control: must-revalidate 必须验证 -> 意味着缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用。

### 新鲜度保持

#### 强缓存阶段:返回 200 from disk/memory (触发条件：在 URI 输入栏中输入然后回车/通过书签访问)

0.发起请求 判断 max-age > age 则使用缓存。否则开始 协商缓存阶段

#### 进入协商缓存:返回 304

1.当客户端发起一个请求时，缓存检索到对应的陈旧资源（ max-age 已经过期），则缓存会先将此请求附加一个 If-None-Match 头(这是浏览器第一次请求 **response** 的 **Etag** 资源标识)，然后发给服务器,检查该资源副本是否是依然还是算新鲜的,若返回 304（无实体信息） 则表示是新鲜的，重置 age = 0

2.如果没有 max-age 则会找 Expires (上一次有效请求的 response 里的) 的值 和 当前 Date 来判断（http1.0 的方法）

3.若以上两个都没有 则使用 If-Modified-Since (上一次有效请求的 response 里的 Last-Modified ) ，重新计算 max-age。

max-age = (Date - Last-Modified ) \* 10%

![缓存执行流程](/images/缓存流程.png)

### 点击刷新事件

当用户点击刷新时如果 head 里面含有 `Cache-control: must-revalidate` 则也会触发缓存验证

### Vary 验证

Vary HTTP **响应头**决定了对于后续的**请求头**，如何判断是请求一个新的资源还是使用缓存的文件。

> 通常用于区分移动端和桌面端的展示内容

![vary 验证流程](/images/vary.png)

### 改进资源策略( 非 http 缓存知识点)

除了以上的 http 缓存，目前还流行一种改进资源策略的方式来验证缓存。
即：验证打包工具 build 时产生的 tag (如配置 webpack.output 的 filename ) 来验证资源是否有更新（通常用于静态资源）
