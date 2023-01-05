---
title: 设计模式-职责链模式
tags:
  - 职责链模式
categories:
  - 设计模式
date: 2022-03-12 14:30:52
---

职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

通俗一点就是:考试时一道题你不会做,就写个小纸条问后面的同学,如果后面同学也不会则一直向后传递直到有人会为止

<!-- more -->

## 示例

需求:一个手机售卖网站,针对支付过定金的用户有一定的优惠政策。在正式购买后：

1. 已经支付过 500 元定金的用户会收到 100 元的商城优惠券，
2. 200 元定金的用户可以收到 50 元的优惠券
3. 而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。

对于不知道职责链的人。估计就一通 if else 直接梭哈。使用职责链模式又是怎么样呢

```JS
//JavaScript
//  orderType:订单类型 1:交500定金的用户 2:交200定金的用户 3:普通用户
//  pay : 是否支付定金
//  stock : 用于普通用户的手机库存
var order500 = function (orderType,pay,stock) {
  if (orderType === 1 && pay ) {
    console.log("500定金,得100优惠卷");
  }else{
    return 'next'
  }
}

var order200 =function(orderType,pay,stock){
  if (orderType === 2 && pay) {
    console.log("200定金,得50优惠卷")
  }else{
    return 'next'
  }
}

var orderNormal = function(orderType , pay ,stock){
  if (stock>0) {
    console.log("普通用户，无优惠券");
  }else{
    return 'next'
  }
}

var Chain = function(fn){
  this.fn = fn
  this.next = null
}

Chain.prototype.setNext = function(next){
  return this.next = next
}
Chain.prototype.next = function (){
  return this.next && this.next.passRequest.apply(this.next,arguments)
}
Chain.prototype.passRequest = function(){
  var res = this.fn.apply(this,arguments)
  if (res==='next') {
    return this.next && this.next.passRequest.apply(this.next,arguments)
  }
  return res
}

// 测试
var chain500 = new Chain(order500)
var chain200 = new Chain(order200)
var chainNormal = new Chain(orderNormal)

// 设置链条
chain500.setNext(chain200)
chain200.setNext(chainNormal)

// 同步 执行
chain500.passRequest(1,true , 500)

// 异步执行
var fn1= new Chain(function(){
  console.log(1)
  return 'next'
})

var fn2 = new Chain(function(){
  console.log(2)
  var self = this
  setTimeout(() => {
    self.next()
  }, 100);
})

fn3 = new Chain(function(){
  console.log(3)
})

fn1.setNext(fn2).setNext(fn3)
fn1.passRequest()
```

以上是通过 Chain 类实现的责任链。下面是利用 js 函数式的方式来实现

<<< @/code/design-pattern/chain-of-responsibility-pattern.js

> 无论是作用域链、原型链，还是 DOM 节点中的事件冒泡，我们都能从中找到职责链模式的影子。职责链模式还可以和组合模式结合在一起，用来连接部件和父部件，或是提高组合对象的效率。学会使用职责链模式，相信在以后的代码编写中，将会对你大有裨益。
