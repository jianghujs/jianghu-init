<template>
  <div class="excel-viewer" style="height: 100vh; overflow: hidden; overflow-y: auto;"></div>
</template>

<script>
module.exports = {
  name: 'excel-viewer',
  props: ['fileUrl'],
  mounted() {
    this.loadViewer();
  },
  methods: {
    async loadViewer() {
      try {
        await Promise.all([
          this.$root.utils.loadCss('./lib/excel/excel.css'),
          this.$root.utils.loadScript('./lib/excel/excel.umd.js')
        ]);
        const viewer = jsPreviewExcel.init(this.$el);
        await viewer.preview(this.fileUrl);
        this.$emit('loaded');
      } catch (error) {
        console.error('Excel viewer error:', error);
        this.$emit('error', error);
      }
    }
  }
}
</script> 