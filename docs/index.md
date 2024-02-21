---
layout: home

title: 小唐的博客
titleTemplate: 记录、学习、思考

hero:
  name: 小唐的博客
  tagline: 记录、学习、思考

  image:
    src: /vitepress-logo-large.webp
    alt: VitePress

features:
  - icon: ⚡️
    title: 设计模式
    details: 基于《JavaScript 设计模式与开发实践》的学习记录
    link: /blogs/design-pattern/index
  - icon: 💡
    title: 个人思考
    details: 记录个人分享和他人分享，积累优质经验与感悟
    link: /blogs/some-idea/index
  - icon: 🛠️
    title: 手写代码
    details: 一些面试积累的手写代码题目,上到数据结构,下到手写实现 JS 关键字
    link: /blogs/write-code/index
  - icon: 🔩
    title: 基础概念
    details: 虽然都讨厌八股文,但当有一天真理解其中的原理突然就会有大彻大悟的感觉
    link: /blogs/basic-concept/index
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(40px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}
</style>
