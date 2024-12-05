<template>
  <div class="word-viewer"></div>
</template>

<script>
module.exports = {
  name: 'word-viewer',
  props: ['fileUrl'],
  mounted() {
    this.loadViewer();
  },
  methods: {
    async loadViewer() {
      try {
        await Promise.all([
          this.$root.utils.loadCss('./lib/docx/docx.css'),
          this.$root.utils.loadScript('./lib/docx/docx.umd.js')
        ]);
        const viewer = jsPreviewDocx.init(this.$el);
        await viewer.preview(this.fileUrl);
        this.$emit('loaded');
      } catch (error) {
        this.$emit('error', error);
      }
    }
  }
}
</script> 
<style>
.word-viewer {
  max-height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>