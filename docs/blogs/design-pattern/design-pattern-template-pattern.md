---
title: 设计模式-模版方法模式
tags:
  - 模版模式
categories:
  - 设计模式
date: 2022-03-12 13:12:38
---

模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式。在传统的面向对象语言中，一个运用了模板方法模式的程序中，子类的方法种类和执行顺序都是不变的，所以我们把这部分逻辑抽象到父类的模板方法里面。

<!-- more -->

## 使用场景

从大的方面来讲，模板方法模式常被架构师用于搭建项目的框架，架构师定好了框架的骨架，程序员继承框架的结构之后，负责往里面填空，比如 Java 程序员大多使用过 HttpServlet 技术来开发项目。

一个 httpServlet 程序包含 7 个生命周期，而这些 do 方法需要由子类来提供具体实现

```javascript
doGet();
doHead();
doPost();
doPut();
doDelete();
doOption();
doTrace();
```

而在前端开发中也有很多模板方法模式的场景。比如我们在构建 UI 组件时，一般构建过程是这样的：

1. 初始化容器
2. 拉取相应数据
3. 数据渲染到容器中
4. 通知用户完成渲染

那么我们就可以把这几个步骤都封装到父类中.让子类来具体实现

## 钩子方法

很多时候模板并不是一成不变的.有时候个别方法会有选择性的执行.这个时候就需要用到钩子方法(hook)了,通过放置钩子隔离变化.

我们在父类中容易变化的地方放置钩子,钩子可以有一个默认实现,具体要不要挂钩由子类自行决定。

## 示例

我们需要完成 煮咖啡和煮茶叶的方法,他们的步骤都是:

1. 把水煮沸
2. 用沸水冲泡饮料
3. 把饮料倒进杯子
4. 加调料

但是部分客户不需要加调料.如何实现呢？

```JS
//JavaScript

// 饮料基类
var Beverage = function () {}
Beverage.prototype.boilWater = function () {
  console.log("把水煮沸")
}

// 冲泡
Beverage.prototype.brew = function(){
  throw new Error("子类必须重写冲泡方法");
}

Beverage.prototype.pourInCap =function(){
  throw new Error("子类必须重写导入杯子方法")
}

Beverage.prototype.addCondiments = function(){
  throw new Error("子类必须重写添加调料方法")
}

Beverage.prototype.customerWantsCondiments = function(){
  return true // 默认需要添加调料
}
Beverage.prototype.init=function(){
  this.boilWater()
  this.brew()
  this.pourInCap()
  if (this.customerWantsCondiments()) {
    this.addCondiments()
  }
}

var CoffeeWithHook = function(){}
CoffeeWithHook.prototype = new Beverage() // 继承饮料基类

CoffeeWithHook.prototype.brew = function(){
  console.log("用水冲泡咖啡")
}

CoffeeWithHook.prototype.pourInCap = function(){
  console.log("把咖啡倒入杯子中")
}

CoffeeWithHook.prototype.addCondiments = function(){
  console.log("加糖和牛奶")
}

CoffeeWithHook.prototype.customerWantsCondiments=function(){
  return window.confirm("是否需要添加调料")
}

var coffee = new CoffeeWithHook()

coffee.init()


```

## 必须要用继承么？

众所周知 js 中函数是第一公民,所谓继承在这里的作用也就是作为一个模版方法让基类能够按一定顺序调用到它.

放弃继承用更 js 的风格实现一次

```JS
//JavaScript
var Beverage =function (params) {
  var boilWater = params.boilWater || function(){
    console.log("把水煮沸")
  }
  var brew = params.brew || function(){
    throw new Error("必须传递冲泡方法")
  }
  var pourInCap = params.pourInCap || function(){
    throw new Error("必须传倒入杯子方法")
  }
  var addCondiments = params.addCondiments || function(){
    throw new Error("必须传添加调料方法")
  }
  var F = function(){}

  F.prototype.init(){
    boilWater()
    brew()
    pourInCap()
    addCondiments()
  }
  return F
}
// Beverage 相当于一个工厂方法. 里面规定了方法的执行顺序
var Coffee = Beverage({
  brew:function(){
    console.log("冲泡")
  },
  pourInCap:function(){
    console.log("倒入杯子")
  },
  addCondiments:function(){
    console.log("加调料")
  }
})

var cf = new Coffee()
cf.init()

```
