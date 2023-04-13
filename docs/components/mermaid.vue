<template>
  <div class="mermaid">
    <slot></slot>
  </div>
</template>

<script>
export default {
  mounted() {
    import("https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs").then((m) => {
      m.default.initialize({
        startOnLoad: true,
      });
      m.default.init();
    });
  },
};
</script>