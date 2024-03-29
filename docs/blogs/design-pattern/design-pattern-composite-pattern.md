---
title: 设计模式-组合模式
tags:
  - 组合模式
categories:
  - 设计模式
date: 2022-03-10 14:48:20
---

# {{ $frontmatter.title }}

组合模式简单来将类似于一棵树，父节点和子节点有着类似的结构

<script setup>
import mermaid from '../../components/mermaid.vue'
</script>

<mermaid mermaidStr="
graph TB
A((组合对象))
B((叶对象))
C((叶对象))
D((叶对象))
E((组合对象))
F((叶对象))
G((叶对象))
H((叶对象))
I((叶对象))
A-->B
A-->C
A-->D
A-->E
E-->F
E-->G
E-->H
E-->I">
</mermaid>

虽然上面说了类似“父子节点”这个字眼,但是组合模式并**不是父子关系**,更多的是**部分-整体**的关系.除了用来表示树形结构外,组合模式能更好的运用对象的多态特性.用户对单个对象和组合对象的使用有着一致性

## 扫描文件夹例子

> 我这里需要实现一个文件夹和文件的扫描的需求.当我选择某个文件夹的时候递归吧所有子文件和子文件夹下的所有文件都显示出来.同时我还需要实现文件夹和文件的删除功能.

<<< @/code/design-pattern/composite-pattern.js
