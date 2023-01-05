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
            link: '/write-code/about-new-and-prototype'
          },
          { text: '深入promise', link: '/write-code/about-promise' },
          { text: '手写bind', link: '/write-code/bind' },
          { text: '防抖和节流', link: '/write-code/debounce-and-throttle' },
          { text: '面试题-原型链', link: '/write-code/interviewing-prototype' },
          {
            text: '手写promise.all 和 race',
            link: '/write-code/promise-all-race'
          }
        ]
      },
      {
        text: '基础概念',
        collapsible: true,
        items: [
          {
            text: '怎么理解Commonjs和ESModule',
            link: '/basic-concept/about-commonjs-and-ESModule'
          },
          {
            text: '详解CORS请求',
            link: '/basic-concept/about-CORS-detail'
          },
          {
            text: '认识@import',
            link: '/basic-concept/about-css-@import'
          },
          {
            text: 'this的指向问题',
            link: '/basic-concept/about-this'
          },
          {
            text: '数组解构赋值',
            link: '/basic-concept/array-destructuring'
          },
          {
            text: 'html中的defer和async',
            link: '/basic-concept/defer-and-async-in-html'
          },
          {
            text: '浏览器中的ESModule',
            link: '/basic-concept/ESModule-in-browser'
          },
          {
            text: 'http缓存',
            link: '/basic-concept/http-cache'
          },
          {
            text: '浏览器中的ESModule',
            link: '/basic-concept/ESModule-in-browser'
          },
          {
            text: 'let/const命令',
            link: '/basic-concept/let-const'
          },
          {
            text: '事件冒泡和捕获',
            link: '/basic-concept/propagation'
          }
        ]
      },
      {
        text: '个人思考',
        collapsible: true,
        items: [
          {
            text: '富文本到底在解决什么问题?',
            link: '/some-idea/about-rich-text-editor'
          },
          {
            text: '前端大仓',
            link: '/some-idea/big-multi-repository'
          },
          {
            text: '前端名词解析:构建工具/编译工具/打包工具',
            link: '/some-idea/build-compiler-pack-tool'
          },
          {
            text: 'js 中的栈都能干什么',
            link: '/some-idea/stack-in-js'
          },
          {
            text: 'esbuild为什么这么快',
            link: '/some-idea/why-esbuild-so-fast'
          }
        ]
      }
    ]
  }
});
