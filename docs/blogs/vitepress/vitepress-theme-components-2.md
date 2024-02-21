### 前面有了能实时编译 react 的容器, 现在来写一个 vue3 的组件, 以便在 vitepress 中渲染

3. 编写承载这个 react 组件的 vue3 容器

因为有实时编辑的功能。因此这里选用 vscode 内核 monaco-editor 作为编辑器

安装依赖 `@guolao/vue-monaco-editor` `veaury`

```vue
<!-- site/components/live-editor.vue -->
<template>
  <div class="editor-container">
    <ReactLivePreview
      :scope="props.scope"
      :sourceCode="code || ''"
      :noStyle="props.noStyle"
    />
    <div v-if="!props.hideCode" class="editor-wrapper">
      <vue-monaco-editor
        v-model:value="code"
        language="javascript"
        :theme="isDark ? 'vs-dark' : 'vs'"
        :options="MONACO_EDITOR_OPTIONS"
        @mount="handleMount"
        :on-change="onChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReactLive } from '../react-components/index'; // 引入 react 组件
import { useData } from 'vitepress';
import { applyReactInVue } from 'veaury';
import VueMonacoEditor from '@guolao/vue-monaco-editor';
import { ref, shallowRef } from 'vue';

type IProps = {
  sourceCodePath?: string;
  hideCode?: boolean;
  noStyle?: boolean;
  sourceCode?: string;
  scope?: Record<string, any>;
};

const ReactLivePreview = applyReactInVue(ReactLive);

const props = withDefaults(defineProps<IProps>(), {
  hideCode: false,
  noStyle: false
});

const { isDark } = useData();
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: {
    autohide: true
  }
};
const code = ref(props.sourceCode);
const editorRef = shallowRef();
const handleMount = (editor: any) => (editorRef.value = editor);
const onChange = (newValue: any) => {
  code.value = newValue;
};
</script>

<style scoped>
/* 略 */
</style>
```

4. vitepress 注册自定义组件

创建 theme/index.ts 在 theme 配置中注册组件

```ts
import LiveEditor from '../../site/components/live-editor.vue';

const theme: Theme = {
  Layout: BaseLayout,
  enhanceApp(ctx) {
    ctx.app.component('LiveEditor', LiveEditor);
  }
};
export default theme;
```

尝试在 md 里写 `LiveEditor` 标签, 并引入 react 示例代码, 会发现 `react-live` 会报错.因为我们并没有引入 `react-live` 所需要的 scope .

```md
<!-- docs/components/button/index.md -->

## Basic

A button is a command component to trigger an operation.

<LiveEditor sourceCodePath="../../../example/button/index.jsx"></LiveEditor>

There are primary, secondary, dashed, outline and text button types.
```

渲染如下：
![img1](/images/vitepress-theme-components/img1.png)

这时我们有了能渲染 react 代码的容器.

下一步就是写 markdown-it 插件，也是最复杂的一步
