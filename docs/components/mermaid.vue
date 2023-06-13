<template>
  <div class="mermaid">
    <slot>
      {{ mermaidStr }}
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    mermaidStr: String,
  },
  mounted() {
    import(
      "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs"
    ).then((m) => {
      m.default.initialize({
        startOnLoad: true,
      });
      m.default.init();
    });
  },
};
</script>