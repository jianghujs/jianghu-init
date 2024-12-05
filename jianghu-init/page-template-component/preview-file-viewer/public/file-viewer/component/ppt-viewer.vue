<template>
  <div style="height: 100vh; width: 100vw; overflow: hidden; overflow-y: auto;">
    <div id="ppt-viewer" class="ppt-viewer" style="overflow: visible;"></div>
  </div>
</template>

<script>
module.exports = {
  name: 'ppt-viewer',
  props: ['fileUrl'],
  mounted() {
    this.loadViewer();
  },
  methods: {
    async loadViewer() {
      try {
        await Promise.all([
          this.$root.utils.loadCss('./lib/ppt/css/pptxjs.css'),
          this.$root.utils.loadCss('./lib/ppt/css/nv.d3.min.css'),
          this.$root.utils.loadScript('./lib/ppt/js/jquery-1.11.3.min.js'),
          this.$root.utils.loadScript('./lib/ppt/js/jszip.min.js'),
          this.$root.utils.loadScript('./lib/ppt/js/filereader.js'),
          this.$root.utils.loadScript('./lib/ppt/js/d3.min.js'),
          this.$root.utils.loadScript('./lib/ppt/js/nv.d3.min.js'),
          this.$root.utils.loadScript('./lib/ppt/js/dingbat.js'),
          this.$root.utils.loadScript('./lib/ppt/js/pptxjs.js'),
          this.$root.utils.loadScript('./lib/ppt/js/divs2slides.js')
        ]);
        
        $("#ppt-viewer").pptxToHtml({
          pptxFileUrl: this.fileUrl,
          fileInputId: "上传_pptx文件",
          slidesScale: "20%", 
          slideMode: false,
          keyBoardShortCut: false,
          incSlide:{height: 0, width:0}, /* 按 2px 增加高度或/和宽度 */
          slideType: "divs2slidesjs", /* 'divs2slidesjs'（默认）,'revealjs'(https://revealjs.com) */
          slideModeConfig: {  // divs2slidesjs - 在幻灯片模式下（slideMode: true）
            first: 2,
            nav: true, /** true,false: 是否显示导航按钮 */
            navTxtColor: "white", /** 颜色 */
            showPlayPauseBtn: false, /** true,false */
            keyBoardShortCut: false, /** true,false */
            showSlideNum: false, /** true,false */
            showTotalSlideNum: false, /** true,false */
            autoSlide: false, /** false 或 秒数（幻灯片之间暂停的时间）, F8 启用（keyBoardShortCut: true） */
            randomAutoSlide: false, /** true,false, autoSlide:true */
            loop: false,  /** true,false */
            background: "black", /** false 或 颜色 */
            transition: "default", /** 过渡类型："slid","fade","default","random", 显示过渡效果需 transitionTime > 0.5 */
            transitionTime: 1 /** 过渡时间，以秒计 */            
          },
          revealjsConfig: { /* 'revealjs' 设置（https://revealjs.com） */
            transition: 'zoom',
            // backgroundTransition: 'zoom', 
            // autoSlide: 5000,
            // loop: true
            slideNumber: true
          }
        });
        this.$nextTick(() => {
          this.scalePPT();
        });

        this.$emit('loaded');
      } catch (error) {
        console.error('PPT viewer error:', error);
        this.$emit('error', error);
      }
    },
    async scalePPT() {
      // 等待 PPT 渲染完成后再进行缩放
      await new Promise(resolve => {
        setTimeout(resolve, 500); // 这里可以根据实际渲染时间调整
      });

      // 获取 PPT 容器和第一张幻灯片
      const pptContainer = document.querySelector('#ppt-viewer');
      const firstSlide = pptContainer.querySelector('.slide');

      // 计算缩放比例
      const originalWidth = firstSlide.offsetWidth;
      const originalHeight = firstSlide.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const scale = Math.min(viewportWidth / originalWidth, viewportHeight / originalHeight);

      // 应用缩放
      pptContainer.style.transform = `scale(${scale})`;
      pptContainer.style.transformOrigin = 'left top';
    }
  }
}
</script>

<style scoped>
.ppt-viewer {
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
}
.slide {
  transform: scale(calc(100vw / 1200px));
}
</style>