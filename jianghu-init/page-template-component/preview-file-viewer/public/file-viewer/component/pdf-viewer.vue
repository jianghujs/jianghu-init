<template>
  <div class="pdf-viewer">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="page-nav">
        <button class="tool-btn" @click="prevPage" :disabled="currentPage === 1" title="上一页">
          <img src="./svg/left.svg" style="width: 24px; height: 24px;">
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
          <img src="./svg/right.svg" style="width: 24px; height: 24px;">
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
      scale: 1
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
        const container = this.$refs.container;
        
        // 获取容器尺寸
        const containerWidth = container.clientWidth - 20; // 减去padding
        const containerHeight = container.clientHeight - 20;
        
        // 获取PDF页面原始尺寸
        const originalViewport = page.getViewport({ scale: 1 });
        
        // 计算合适的缩放比例
        const scaleW = containerWidth / originalViewport.width;
        const scaleH = containerHeight / originalViewport.height;
        this.scale = Math.min(scaleW * 1.5, scaleH * 1.5, 3); // 限制最大缩放比例为3
        
        // 使用计算出的缩放比例
        const viewport = page.getViewport({ scale: this.scale });
        
        // 设置canvas尺寸
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // 设置canvas的CSS尺寸以保持显示大小不变
        canvas.style.width = (viewport.width / 1.5) + 'px';
        canvas.style.height = (viewport.height / 1.5) + 'px';
        
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        this.pageRendering = false;
        
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
    }
  }
}
</script>

<style scoped>
.pdf-viewer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
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
  flex: 1;
  overflow: auto;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-wrapper {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: inline-flex;
}

canvas {
  display: block;
}
</style> 