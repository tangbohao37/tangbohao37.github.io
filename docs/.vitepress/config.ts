import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '小唐的博客',
  description: '记录、学习、思考',
  lastUpdated: true,
  cleanUrls: 'without-subfolders',
  lang: 'zh-CN',
  themeConfig: {
    lastUpdatedText: 'Updated Date',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/tangbohao37/tangbohao37.github.io'
      }
    ],
    editLink: {
      pattern:
        'https://github.com/tangbohao37/tangbohao37.github.io/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    sidebar: [
      {
        text: '简单理解设计模式',
        collapsible: true,
        items: [
          {
            text: '模板模式',
            link: '/blogs/design-pattern/design-pattern-template-pattern'
          },
          {
            text: '策略模式',
            link: '/blogs/design-pattern/design-pattern-strategy-pattern'
          },
          {
            text: '单例模式',
            link: '/blogs/design-pattern/design-pattern-singleton-pattern'
          },
          {
            text: '发布订阅模式',
            link: '/blogs/design-pattern/design-pattern-publish-subscribe-pattern'
          },
          {
            text: '迭代器模式',
            link: '/blogs/design-pattern/design-pattern-iterator-pattern'
          },
          {
            text: '组合模式',
            link: '/blogs/design-pattern/design-pattern-composite-pattern'
          },
          {
            text: '命令模式',
            link: '/blogs/design-pattern/design-pattern-command-pattern'
          },
          {
            text: '职责链模式',
            link: '/blogs/design-pattern/design-pattern-chain-of-responsibility-pattern'
          }
        ]
      },
      {
        text: '手写代码',
        collapsible: true,
        items: [
          {
            text: 'js的new到底干了什么，如何手写一个new',
            link: '/blogs/write-code/about-new-and-prototype'
          },
          { text: '深入promise', link: '/blogs/write-code/about-promise' },
          { text: '手写bind', link: '/blogs/write-code/bind' },
          {
            text: '防抖和节流',
            link: '/blogs/write-code/debounce-and-throttle'
          },
          {
            text: '面试题-原型链',
            link: '/blogs/write-code/interviewing-prototype'
          },
          {
            text: '手写promise.all 和 race',
            link: '/blogs/write-code/promise-all-race'
          }
        ]
      },
      {
        text: '基础概念',
        collapsible: true,
        items: [
          {
            text: '怎么理解Commonjs和ESModule',
            link: '/blogs/basic-concept/about-commonjs-and-ESModule'
          },
          {
            text: '详解CORS请求',
            link: '/blogs/basic-concept/about-CORS-detail'
          },
          {
            text: '认识@import',
            link: '/blogs/basic-concept/about-css-@import'
          },
          {
            text: 'this的指向问题',
            link: '/blogs/basic-concept/about-this'
          },
          {
            text: '数组解构赋值',
            link: '/blogs/basic-concept/array-destructuring'
          },
          {
            text: 'html中的defer和async',
            link: '/blogs/basic-concept/defer-and-async-in-html'
          },
          {
            text: '浏览器中的ESModule',
            link: '/blogs/basic-concept/ESModule-in-browser'
          },
          {
            text: 'http缓存',
            link: '/blogs/basic-concept/http-cache'
          },
          {
            text: '浏览器中的ESModule',
            link: '/blogs/basic-concept/ESModule-in-browser'
          },
          {
            text: 'let/const命令',
            link: '/blogs/basic-concept/let-const'
          },
          {
            text: '事件冒泡和捕获',
            link: '/blogs/basic-concept/propagation'
          }
        ]
      },
      {
        text: '个人思考',
        collapsible: true,
        items: [
          {
            text: '富文本到底在解决什么问题?',
            link: '/blogs/some-idea/about-rich-text-editor'
          },
          {
            text: '前端大仓',
            link: '/blogs/some-idea/big-multi-repository'
          },
          {
            text: '前端名词解析:构建工具/编译工具/打包工具',
            link: '/blogs/some-idea/build-compiler-pack-tool'
          },
          {
            text: 'js 中的栈都能干什么',
            link: '/blogs/some-idea/stack-in-js'
          },
          {
            text: 'esbuild为什么这么快',
            link: '/blogs/some-idea/why-esbuild-so-fast'
          }
        ]
      }
    ]
  }
});
