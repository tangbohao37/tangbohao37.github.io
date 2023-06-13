# 关于 monorepo 的一些想法

记录一下对于公司 `monorepo` 的一些想法

## 解刨目录结构

```
.
├── Dockerfile
├── README.md
├── babel.config.js
├── commitlint.config.js
├── nginx
├── package.json // 根 package.json
├── packages
│   ├── base-web // 一些公共的 page/components/utils/apis 等
│   │   ├── base.vite.config.js
│   │   ├── package.json
│   │   ├── public
│   │   └── src
│   ├── effortless // growth 相关业务
│   │   ├── api
│   │   ├── assets
│   │   ├── effortless.md
│   │   ├── enum
│   │   ├── interface
│   │   ├── lib
│   │   ├── mock
│   │   ├── router
│   │   ├── store
│   │   └── views
│   └── operation // 运营相关业务
│       ├── api
│       ├── assets
│       ├── components
│       ├── enum
│       ├── interface
│       ├── lib
│       ├── locale.ts
│       ├── router
│       ├── store
│       └── views
├── pnpm-lock.yaml
├── pnpm-workspace.yaml // 定义 packages
├── projects
│   ├── pintar-id-app // app 端业务逻辑
│   │   ├── README.md
│   │   ├── babel.config.js
│   │   ├── commitlint.config.js
│   │   ├── index.html
│   │   ├── nginx.conf
│   │   ├── package.json
│   │   ├── public -> ../../packages/base-web/public
│   │   ├── src
│   │   ├── tsconfig.json
│   │   └── vite.config.js
│   └── pintar-id-web // web 端业务逻辑
│       ├── README.md
│       ├── babel.config.js
│       ├── commitlint.config.js
│       ├── dist
│       ├── index.html
│       ├── nginx.conf
│       ├── package.json
│       ├── public -> ../../packages/base-web/public
│       ├── src
│       ├── stats.html
│       ├── tsconfig.json
│       └── vite.config.js
├── scripts
│   ├── install.sh
│   ├── run.js
│   └── upload.js
├── tsconfig.json
├── types
│   └── vue-shims
│       ├── index.d.ts
│       ├── shims-tsx.d.ts
│       └── shims-vue.d.ts
└── vetur.config.js
```

## 现状

可能由于历史原因,所有依赖都被提升到了根 `package.json` 中。

### 所有依赖提升到根 `package.json` 中导致的问题:

- 无法判断单个项目的真正依赖.某业务线项目一旦写入就无法分离.
- 难以对项目进行技术升级,我司业务线跨度大,有落后地区也有相对发达地区,对于不同地区技术应该是不同的

  > 如:东南亚可能需要兼容 ie，而日本/台湾/香港等地区则不用兼容,因此技术栈/打包策略会因地制宜

  > 如果我需要将 webpack 升级为 vite 则需要改动所有国家线，同理 `react 16` 升级 `18` 也要涉及所有国家线，其中涉及的不光是研发还是测试/产品验收等环节

- 无法处理依赖冲突,每次引入新包都需要考虑全国家线影响范围

  > 如: 引入新的依赖, A 包依赖 `react 16`,B 包依赖 `react 18`. 这种依赖冲突只能用 `--legacy` 方式处理,导致一个项目中存在多个 `react`

### 子包 `package.json` 只作为写命令的载体,失去了包的意义

- `monorepo` 的核心是单一仓库管理多**包**, 而包的定义是基于 `package.json` 的,当前的 `package.json` 更像是一个摆设,即便删除了也对项目没啥影响，已经失去了包的概念

  > 因此这种结构就是一个伪 `monorepo` , 只是将文件放在 packages/projects 下，再做了个 alias

- 由于引入依赖于 webpack 的 alias 因此对每个~~项目~~的引用不一定相同，而且很多地方不一定能引入到 只能通过 `../../` 的形式引入,文件关系复杂

  > 如: common 无法引用 project 内的东西。 当我在开发 A 线 需要用到 B 线的内容, 其实中间就已经有了 AB 的公共部分.理论上应该放入 common 中,但是如果我如果提取公共内容在 common 中，那么就需要把 B 线的代码进行修改。 因此 B 线就需要测试,无形中增加了测试范围

- 没有自己的版本号.目前所有项目都依赖与根 package, 因此如果要实现自动更新版本号必须改根`package.json`的版本号,与正常版本迭代逻辑相悖

### 自己写 run.js 重复造轮子增加 bug 几率徒增理解成本

- 目前来看 run.js 内都是执行子包的命令,很多常规命令如 `dev` / `build` 等。都是 `monorepo` 天生支持的，没必要绕一圈
  > 执行子包命令: `lerna run XXXX --filter xxxx` / `pnpm run xxx --filter xxx`

### 分层维度混乱

- 在 common 和 project 里根据业务各自有一套 pages/router/libs 等等。对于这种公共的代码不应该含有副作用,并且内容/UI 不能固定应该有大量参数，方便后期更换图片 UI 等.但目前大量文件都有副作用,切有大量重复代码,难以复用.

  正常来讲公共文件提取一般依照视图/组件/公共 libs 来划分,而不是根据业务来划分(_如: 一个组件,对于业务方是费用展示,而对于组件而言就是金融数字展示_),并且会有独立的 test 和相关文档,

> 重复代码产生过程:A 业务线上某需求一段时间后，需要同步到 B 业务线, 由于有副作用为了不影响 A 业务线，因此复制一份代码放到另一个文件中。

- 所有项目的`文案/静态资源`放在一起,难以分离，增加项目体积 (其他 js 代码同理)

## 建议

### monorepo 工具选择

能用 lerna/Turborepo 等专门做 monorepo 的工具就别用 npm

1. 专门的工具对于非正常使用会有对应的警告提醒
2. 有对应生态专门的命令可以覆盖大部分场景，不用自己想办法写脚本
3. 对于版本化管理更好，集成了 changelog ,易于分包发布

### 重新思考是否真的需要 monorepo

1. monorepo 对于项目的理解难度只增不减
2. git 提交污染
3. 对项目分层有一定要求

## 文档化(业务区块包/UI 组件库)

抽离无副作用的**公共逻辑/UI/业务区块** 到独立包中,对于每个模块都书写完整的文档,单独管理单独发包,单独迭代

### 目的:

1. 减少业务项目代码体积
2. 减少沟通理解成本
3. 减少项目固定开发人员依赖
4. 提高新人上手效率
5. 前期开发技术方案文档细化,排期细化不再以功能点为排期维度,而是可细化到每个方法/UI.
6. 根据规范的 commit 生成 `changelog` 实现公共逻辑迭代版本可追溯
7. 减少单元测试书写难度,同时降低测试人员工作量,减少返工,提高代码健壮性
8. 保留技术沉淀,增加可复用性
9. 方便追溯使用情况(使用量/独立埋点)
10. 方便更精准进行性能测试

### 基础库项目模板需要包含的功能

1. 国际化
2. 调试能力
3. 每个模块的 changelog
4. 代码规范
5. 迭代规范
6. 文档生成

### TOOD-LIST

- 组建/公共代码/业务逻辑拆分规范/划分范围 (建立对应文档站)
  - 业务逻辑 KYC pre judgement
  - 基础服务 ajax / dsbridge
  - 组建拆分
    1. 基础组建
    2. 业务组建
- 组建编写规范
- 单元测试规范
- 文档站能力
- CI/CD 流程
