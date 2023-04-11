import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '小唐的博客',
  description: '记录、学习、思考',
  lastUpdated: true,
  cleanUrls: true,
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
        collapsed: true,
        link: 'blogs/design-pattern/',
        items: [
          {
            text: '模板模式',
            link: './design-pattern-template-pattern'
          },
          {
            text: '策略模式',
            link: './design-pattern-strategy-pattern'
          },
          {
            text: '单例模式',
            link: './design-pattern-singleton-pattern'
          },
          {
            text: '发布订阅模式',
            link: './design-pattern-publish-subscribe-pattern'
          },
          {
            text: '迭代器模式',
            link: './design-pattern-iterator-pattern'
          },
          {
            text: '组合模式',
            link: './design-pattern-composite-pattern'
          },
          {
            text: '命令模式',
            link: './design-pattern-command-pattern'
          },
          {
            text: '职责链模式',
            link: './design-pattern-chain-of-responsibility-pattern'
          }
        ]
      },
      {
        text: '手写代码',
        collapsed: true,
        link: 'blogs/write-code/',
        items: [
          {
            text: 'js的new到底干了什么，如何手写一个new',
            link: './about-new-and-prototype'
          },
          { text: '深入promise', link: './about-promise' },
          { text: '手写bind', link: './bind' },
          {
            text: '防抖和节流',
            link: './debounce-and-throttle'
          },
          {
            text: '面试题-原型链',
            link: './interviewing-prototype'
          },
          {
            text: '手写promise.all 和 race',
            link: './promise-all-race'
          }
        ]
      },
      {
        text: '基础概念',
        collapsed: true,
        link: 'blogs/basic-concept/',
        items: [
          {
            text: '怎么理解Commonjs和ESModule',
            link: './about-commonjs-and-ESModule'
          },
          {
            text: '详解CORS请求',
            link: './about-CORS-detail'
          },
          {
            text: '认识@import',
            link: './about-css-@import'
          },
          {
            text: 'this的指向问题',
            link: './about-this'
          },
          {
            text: '数组解构赋值',
            link: './array-destructuring'
          },
          {
            text: 'html中的defer和async',
            link: './defer-and-async-in-html'
          },
          {
            text: '浏览器中的ESModule',
            link: './ESModule-in-browser'
          },
          {
            text: 'http缓存',
            link: './http-cache'
          },
          {
            text: '浏览器中的ESModule',
            link: './ESModule-in-browser'
          },
          {
            text: 'let/const命令',
            link: './let-const'
          },
          {
            text: '事件冒泡和捕获',
            link: './propagation'
          }
        ]
      },
      {
        text: '个人思考',
        collapsed: true,
        link: 'blogs/some-idea/',
        items: [
          {
            text: '富文本到底在解决什么问题?',
            link: './about-rich-text-editor'
          },
          {
            text: '前端大仓',
            link: './big-multi-repository'
          },
          {
            text: '前端名词解析:构建工具/编译工具/打包工具',
            link: './build-compiler-pack-tool'
          },
          {
            text: 'js 中的栈都能干什么',
            link: './stack-in-js'
          },
          {
            text: 'esbuild为什么这么快',
            link: './why-esbuild-so-fast'
          }
        ]
      }
    ]
  }
});
