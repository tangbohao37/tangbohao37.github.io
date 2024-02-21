### 前面有了能在 vitepress 中渲染的 vue3 组件, 并在 theme 中全局注册了，但是这个时候如果在 md 中如果写了 `<LiveEditor>` 会发现,React-Live 可能会报错.因为我们并没有传递正确的 scope

---

#### 为了让使用者尽量减少心智负担，不在写 md 的时候手动引入所需 scope, 我们需要写一个 markdown-it 插件来自动引入, 这也是最复杂的地方。

5. 编写 markdown-it 插件

安装依赖： `@babel/parser` /`@vue/compiler-core` / `@babel/traverse`

具体步骤写在注释中了

```ts
// site/plugins/index.ts
import { parse, type ParseResult } from '@babel/parser';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const DemoTag = 'LiveEditor';

export function demoBlockPlugin(md: MarkdownRenderer) {
  const addRenderRule = (type: string) => {
    const defaultRender = md.renderer.rules[type];

    // 覆盖渲染规则
    md.renderer.rules[type] = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const content = token.content.trim();

      if (!content.match(new RegExp(`^<${DemoTag}\\s`))) {
        // 非 LiveEditor 标签 则使用默认渲染规则
        return defaultRender!(tokens, idx, options, env, self);
      }
      // 检测到md 中的LiveEditor 标签
      // 提取参数
      const props = parseProps<IPropsType>(content);

      if (!props.sourceCodePath) {
        // 容错机制-如果没有 sourceCodePath 则使用默认渲染规则
        return defaultRender!(tokens, idx, options, env, self);
      }
      const mdFilePath = path.dirname(env.path); // md 原文件路径

      /**
       * 因为 react-live 需要提前把依赖的 scope 传进去，所以需要提前把原文件的 import 语句分离出来，
       * 并传入到 vue3组件的 <script> 标签中去
       */

      // 根据 sourceCodePath 获取 react 源码，并分离出 import语句代码片段
      const statement = getFileStatement(mdFilePath, props.sourceCodePath);
      if (!statement) {
        // 容错机制-如果没有找到原文件则使用默认渲染规则
        return defaultRender!(tokens, idx, options, env, self);
      }
      const { sourceFileStr, demoImportCodeArr, demoImportCodeStr } = statement;
      if (demoImportCodeStr) {
        if (!env.sfcBlocks.scripts) {
          env.sfcBlocks.scripts = [];
        }
        const tags = env.sfcBlocks.scripts as { content: string }[];
        const existingSetupScriptIndex = tags?.findIndex(
          (tag) =>
            scriptRE.test(tag.content) &&
            scriptSetupRE.test(tag.content) &&
            !scriptClientRE.test(tag.content)
        );
        let _code = demoImportCodeStr;
        if (existingSetupScriptIndex > -1) {
          // 如果 script 中还有其他引入
          const tagSrc = tags[existingSetupScriptIndex];
          const [, c] = tagSrc.content.match(scriptRegex);
          const componentRegisStatement = demoImportCodeArr.join(os.EOL).trim();
          // 将 react-live 所需 scope 添加在script 之中
          _code = [c, componentRegisStatement].join(os.EOL);
        }

        /**
         * 重新处理添加 scope 之后的代码片段，以obj形式输出所需依赖的scope
         * 这里没用直接用 babel 等工具来提取，是因为很有可能这里的code语句语法是错误的
         * 如 import a from 'b'
         *    import a from 'c'
         * 这种类似的重复命名，或者重复引用
         */
        const { importRecord: statementObj, directImportRecord } =
          importStatementObj(_code);
        const importStatementCode = buildImportStatement(statementObj)
          .join(os.EOL)
          .trim();
        const finalCode = [importStatementCode, ...directImportRecord]
          .join(os.EOL)
          .trim();

        // babel 重新编译,形成正确的 import 语句片段
        const ast = parse(finalCode, {
          sourceType: 'module',
          plugins: ['typescript']
        });

        // 分离 import 语句的 module。 获取需要引入的 scope 传给 LiveEditor
        const _modules = getImportModules(ast);
        if (existingSetupScriptIndex > -1) {
          tags[existingSetupScriptIndex].content =
            `<script lang="ts" setup >${finalCode}</script>`.trim();
        } else {
          tags.unshift({
            content: `<script lang="ts" setup >${finalCode}</script>`.trim()
          });
        }
        return liveEditorTemplate({
          sourceCode: sourceFileStr,
          hideCode: props.hideCode,
          noStyle: props.noStyle,
          scope: _modules.toString() as any
        });
      }
      return liveEditorTemplate({
        sourceCode: sourceFileStr,
        hideCode: props.hideCode,
        noStyle: props.noStyle
      });
    };
  };
  // addRenderRule('html_block');
  addRenderRule('html_inline');
}
```

所需工具函数

```ts
import { baseParse, transform } from '@vue/compiler-core';

// 提取参数
export const parseProps = <T extends Record<string, any> = any>(
  content: string
) => {
  const ast = baseParse(content);
  const propsMap: any = {};
  transform(ast, {
    nodeTransforms: [
      (node) => {
        if (node.type === 1 && content.includes(node.tag)) {
          // 元素节点且标签为 LiveEditor
          if (node.props.length) {
            node.props.forEach((prop) => {
              if (prop.type === 6) {
                // 属性节点
                propsMap[prop.name] = prop.value?.content;
              }
              if (prop.type === 7) {
                const propName = prop.arg?.loc.source;
                const propVal = prop.exp?.loc.source;
                let v = false;
                try {
                  v = JSON.parse(propVal || '');
                } catch (error) {
                  v = false;
                }
                propName && (propsMap[propName] = v);
              }
            });
          }
        }
      }
    ]
  });
  return propsMap as T;
};

// 根据原文件路径获取 react 源码,并分离出 import 语句代码片段
const getFileStatement = (mdFilePath: string, sourceCodePath: string) => {
  // TODO: 如何获取 vite 配置？ 方便使用 @ 别名路径
  const codeFilePath = path.resolve(mdFilePath, sourceCodePath); // 引入的 code 原文件路径
  const fileExists = fs.existsSync(codeFilePath);
  if (!fileExists) {
    console.log(`${sourceCodePath}  未找到原文件!`);
    return;
  }

  const sourceFileStr = fs.readFileSync(codeFilePath, 'utf-8');
  const demoImportCode = filterJSXComments(sourceFileStr)?.match(importRegex);
  const _demoImportCode = demoImportCode?.join(os.EOL);

  return {
    sourceFileStr: sourceFileStr.replaceAll('"', "'"),
    demoImportCodeArr: demoImportCode,
    demoImportCodeStr: _demoImportCode
  };
};

// 处理重新组合后的代码片段
const importStatementObj = (code: string) => {
  const importRecord: Record<string, any> = {};
  const directImportRecord = [];
  // const importPattern = /import\s+(.*?)\s+from/gs
  const importPattern = /import\s+([\w*{}\s,]+)\s+from\s+['"]([^'"]+)['"]/gms;
  const modulePattern = /from\s+['"]([^'"]+)['"]/g;

  const regex = /import\s+["']([^"']+)["'](?!.*\bfrom\b)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const importStatement = match[0];
    directImportRecord.push(importStatement);
  }

  let importMatches;
  // 匹配 { xxxx , xxxx}
  while ((importMatches = importPattern.exec(code)) !== null) {
    if (importMatches.length > 1) {
      const importText = importMatches[1].trim();

      // Find the module using modulePattern
      let moduleMatches;
      if ((moduleMatches = modulePattern.exec(code)) !== null) {
        if (moduleMatches.length > 1) {
          //  from xxxxxx
          const moduleText = moduleMatches[1].trim();
          //  import xxxx ,{ xxxx }
          const pattern = /[{}]/;
          const hasBrace = pattern.test(importText);
          const _import = importText.split(',').map((i) => {
            // 处理 包含 { 或者 } 的import
            if (hasBrace) {
              const _n = `{ ${i.replace(/[{}]/g, '').trim()} }`;
              return _n;
            }
            return i.trim();
          });
          _import.forEach((_i) => {
            importRecord[_i] = moduleText;
          });
        }
      }
    }
  }

  return { importRecord, directImportRecord };
};

//  重新构建 import 语句
const buildImportStatement = (obj: Record<string, string>) => {
  return Object.entries(obj).map(([k, v]) => {
    return `import ${k} from '${v}';`;
  });
};

const liveEditorTemplate = ({
  sourceCode,
  hideCode,
  noStyle,
  scope
}: ILiveEditor) => {
  return `<LiveEditor :scope="{ ${scope} }" sourceCode="${sourceCode}" :hideCode="${hideCode}" :noStyle="${noStyle}" ></LiveEditor>`;
};

/**
 * Regular expression for matching import statements in a string of code.
 */
// export const importRegex = /import[\s\S]*?\n*$/g
export const importRegex =
  /import\s+[\w*{}\s,]+\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;

/**
 * Regular expression for matching the closing script tag "</script>".
 */
export const scriptRE = /<\/script>/;

/**
 * Regular expression for detecting TypeScript script tags in HTML.
 * Matches script tags with a "lang" attribute set to "ts".
 */
export const scriptLangTsRE = /<\s*script[^>]*\blang=['"]ts['"][^>]*/;

/**
 * Regular expression for detecting the presence of a `setup` attribute in a `script` tag.
 */
export const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/;

/**
 * Regular expression for matching a script tag with the "client" attribute.
 */
export const scriptClientRE = /<\s*script[^>]*\bclient\b[^>]*/;

/**
 * Regular expression for matching script tags in HTML.
 * Matches the opening and closing script tags, as well as any content in between.
 */
export const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/;
```

如果一切顺利,这个时候在 md 中写 LiveEditor 并传入 code path 应该可以正确渲染了,并可以实时编译

```md
<LiveEditor sourceCodePath="./example/index.jsx"></LiveEditor>
```

```tsx
// example/index.jsx
import { useEffect } from 'react';

const Example = () => {
  useEffect(() => {
    console.log('Example Render');
  }, []);

  return (
    <div>
      <h1> This is a example </h1>
    </div>
  );
};

render(<Example />);
```

效果如下：
![img1](/images/vitepress-theme-components/gif2.gif)

ok 最难的一步已经实现,后续的功能就会简单很多
