---
title: 详解CORS请求
tags:
  - CORS
categories:
  - 前端
date: 2021-08-15 19:19:57
---

CORS 是什么？ 为什么浏览器会发个 options 请求？可以不发么？ [本文参考自阮大的文章](http://www.ruanyifeng.com/blog/2016/04/cors.html)

<!-- more -->

# 两种请求

浏览器对于简单请求和非简单请求处理是不一样的！！！

## 简单请求

简单请求满足条件：

- method ： HEAD,GET,POST 之一
- http 头：Accept,Accept-Language,Content-Language,Last-Event-ID,Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

### CORS 头

对于简单请求，浏览器直接发出 CORS 请求, 实际上就是在头信息中 增加一个 **Origin** 请求

下面是一个例子，浏览器发现这次跨源 AJAX 请求是简单请求，就自动在头信息之中，添加一个 **Origin** 字段。

```
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面的头信息中，Origin 字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

- 不在许可范围内，
  浏览器还是会正常返回 http 回应, 但**浏览器发现** 没有 **Access-Control-Allow-Origin** 就知道服务器不允许本次请求, 浏览器就会报错,在 XMLHttpRequest 的 onerror 中捕获。 (注意:状态码是无法识别的,服务器很可能返回 200)
- 在许可范围内 响应会多几个头字段 如下：

```
Access-Control-Allow-Origin: http://api.bob.com // 该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。
Access-Control-Allow-Credentials: true // 是否允许 cookie 一起发送给服务器
Access-Control-Expose-Headers: FooBar // 限定 XMLHttpRequest对象的getResponseHeader() 方法能拿到除默认的字段以外的值(这里XMLHttpRequest对象的getResponseHeader能拿到 FooBar ),
Content-Type: text/html; charset=utf-8
```

### withCredentials 属性

注意：服务器虽然返回了 Control-Allow-Credentials: true。 如果浏览器端不设置 withCredentials 还是不会发送 cookie 给服务器。

- 对于 cookies 是一个双方的约定，有一方不接受 就无法发送/接受

```
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

> 注意： 如果要发送 cookie Access-Control-Allow-Origin 就不能设置为 \* （cookie 的同源策略）

## 非简单请求（这个时候就要发 options 了）

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 PUT 或 DELETE，或者 Content-Type 字段的类型是 application/json

非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求（preflight）。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错

### "预检"请求

非简单请求：

```
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

浏览器发现是**非简单请求** 就会发出 “预检”请求，如下：

```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT   // 即将用到的请求方法
Access-Control-Request-Headers: X-Custom-Header // 额外发送的自定义头
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...

```

### "预检"回应

```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com  // 表示可以接受的来源地址
Access-Control-Allow-Methods: GET, POST, PUT // 接受的方法
Access-Control-Allow-Headers: X-Custom-Header // 接受的自定义头
Access-Control-Max-Age: 1728000 // 本次预检 有效期（秒），有效期内不在发"预检"请求，走**简单请求的逻辑**
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

如果服务器否定了"预检"请求，会返回一个正常的 HTTP 回应，但是没有任何 CORS 相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被 XMLHttpRequest 对象的 onerror 回调函数捕获。控制台会打印出如下的报错信息。
