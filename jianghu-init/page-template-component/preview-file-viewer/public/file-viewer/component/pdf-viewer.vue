<template>
  <div class="pdf-viewer" ref="pdfViewer">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="page-nav" v-if="totalPages > 1">
        <button class="tool-btn" @click="prevPage" :disabled="currentPage === 1" title="上一页">
          <img src="./svg/left.svg" style="width: 24px; height: 24px;"/>
        </button>
        <div class="page-info">
          <input 
            type="number" 
            v-model.number="currentPage"
            @change="goToPage"
            :min="1"
            :max="totalPages"
          > / {{ totalPages }}
        </div>
        <button class="tool-btn" @click="nextPage" :disabled="currentPage === totalPages" title="下一页">
          <img src="./svg/right.svg" style="width: 24px; height: 24px;"/>
        </button>
      </div>
      <div class="zoom-controls">
        <button @click="zoomIn" class="tool-btn" title="放大">
          <img src="./svg/plus.svg" style="width: 24px; height: 24px;" alt="放大">
        </button>
        <button @click="zoomOut" class="tool-btn" title="缩小">
          <img src="./svg/minus.svg" style="width: 24px; height: 24px;" alt="缩小">
        </button>
        <button @click="rotateLeft" class="tool-btn" title="向左旋转">
          <img src="./svg/rotate-left.svg" style="width: 24px; height: 24px;" alt="向左旋转">
        </button>
        <button @click="rotateRight" class="tool-btn" title="向右旋转">
          <img src="./svg/rotate-right.svg" style="width: 24px; height: 24px;" alt="向右旋转">
        </button>
        <button @click="resetZoom" class="tool-btn" title="重置">
          <img src="./svg/redo.svg" style="width: 24px; height: 24px;" alt="重置">
        </button>
      </div>
    </div>

    <!-- PDF 容器 -->
    <div class="pdf-container" ref="container">
      <div class="canvas-wrapper">
        <canvas ref="pdfCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'pdf-viewer',
  props: ['fileUrl'],
  data() {
    return {
      currentPage: 1,
      totalPages: 1,
      pdfDoc: null,
      pageRendering: false,
      pageNumPending: null,
      scale: 1,
      scaleToFit: 1,
      rotate: 0
    }
  },
  async mounted() {
    await this.loadViewer();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async loadViewer() {
      try {
        await this.$root.utils.loadScript('./lib/pdf/pdf.min.js');
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdf/pdf.worker.min.js';

        this.pdfDoc = await pdfjsLib.getDocument(this.fileUrl).promise;
        this.totalPages = this.pdfDoc.numPages;
        // 初始化获取pdf的初始视口
        await this.renderPage(this.currentPage);
        this.$emit('loaded');
      } catch (error) {
        console.error('PDF viewer error:', error);
        this.$emit('error', error);
      }
    },

    handleResize() {
      if (this.pdfDoc) {
        this.renderPage(this.currentPage);
      }
    },

    async renderPage(num) {
      this.pageRendering = true;
      try {
        const page = await this.pdfDoc.getPage(num);
        const canvas = this.$refs.pdfCanvas;
        const context = canvas.getContext('2d');

        // 获取容器宽度和高度
        const container = this.$refs.pdfViewer;
        const containerWidth = container.clientWidth - 10; // 减去边距
        const containerHeight = container.clientHeight - 10; // 减去边距

        // 获取PDF页面的原始视口,添加旋转参数
        const originalViewport = page.getViewport({ scale: 1.0, rotation: this.rotate || 0 });

        // 计算适合容器的缩放比例
        const widthScale = containerWidth / originalViewport.width;
        const heightScale = containerHeight / originalViewport.height;
        const fitScale = Math.min(widthScale, heightScale);

        // 应用缩放和旋转并获取新视口
        const viewport = page.getViewport({ 
          scale: this.scale * fitScale,  // 使用动态计算的缩放比例
          rotation: this.rotate || 0 
        });

        // 设置canvas尺寸,增加2倍分辨率
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = viewport.width * pixelRatio;
        canvas.height = viewport.height * pixelRatio;
        canvas.style.width = viewport.width + 'px';
        canvas.style.height = viewport.height + 'px';

        // 设置canvas上下文缩放以提高清晰度
        context.scale(pixelRatio, pixelRatio);

        // 渲染PDF页面到canvas
        await page.render({ 
          canvasContext: context, 
          viewport: viewport,
          // 增加渲染质量
          renderInteractiveForms: true,
          enableWebGL: true,
          useSystemFonts: true
        }).promise;
        
        this.pageRendering = false;

        // 处理待渲染的页面
        if (this.pageNumPending !== null) {
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
      } catch (error) {
        console.error('Error rendering page:', error);
        this.pageRendering = false;
      }
    },

    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },

    prevPage() {
      if (this.currentPage <= 1) return;
      this.currentPage--;
      this.queueRenderPage(this.currentPage);
    },

    nextPage() {
      if (this.currentPage >= this.totalPages) return;
      this.currentPage++;
      this.queueRenderPage(this.currentPage);
    },

    goToPage() {
      if (this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      this.queueRenderPage(this.currentPage);
    },

    // 放大功能
    zoomIn() {
      this.scale += 0.1; // 每次放大0.1
      this.renderPage(this.currentPage); // 重新渲染当前页面
    },

    // 缩小功能
    zoomOut() {
      if (this.scale > 0.1) { // 防止缩小到负值
        this.scale -= 0.1; // 每次缩小0.1
        this.renderPage(this.currentPage); // 重新渲染当前页面
      }
    },

    // 向左旋转
    rotateLeft() {
      this.rotate = (this.rotate - 90) % 360;
      this.renderPage(this.currentPage);
    },

    // 向右旋转
    rotateRight() {
      this.rotate = (this.rotate + 90) % 360;
      this.renderPage(this.currentPage);
    },

    // 重置缩放
    resetZoom() {
      this.scale = 1; // 重置缩放比例为1
      this.renderPage(this.currentPage); // 重新渲染当前页面
    }
  }
}
</script>

<style scoped>
.pdf-viewer {
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #999;
  padding: 5px;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 70px;
}

.toolbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  z-index: 1000;
}

@media (max-width: 768px) {
  .toolbar {
    bottom: 10px !important ;
  }
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-info {
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  /* 不换行 */
  white-space: nowrap;
}

.page-info input {
  width: 40px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  padding: 0 4px;
}

.page-info input::-webkit-inner-spin-button,
.page-info input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-btn i {
  font-size: 20px;
}

.pdf-container {
  box-sizing: border-box;
  display: block;
  margin: auto;
}

.canvas-wrapper {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: inline-flex;
  position: relative;
}

canvas {
  display: block;
  max-width: none;
  max-height: none;
}

.zoom-controls {
  display: flex;
  gap: 8px;
}
</style> 