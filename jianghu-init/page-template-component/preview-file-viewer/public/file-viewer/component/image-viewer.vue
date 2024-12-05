<template>
  <div class="image-viewer">
    <!-- 工具栏 -->
    <div class="toolbar">
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
      <button @click="resetView" class="tool-btn" title="重置">
        <img src="./svg/redo.svg" style="width: 24px; height: 24px;" alt="重置">
      </button>
      <button @click="downloadImage" class="tool-btn" title="下载">
        <img src="./svg/download.svg" style="width: 24px; height: 24px;" alt="下载">
      </button>
    </div>

    <!-- 图片容器 -->
    <div class="image-container" ref="container">
      <img :src="fileUrl" 
           ref="image"
           :style="imageStyle" 
           @load="onImageLoad"
           @error="onImageError"
           @mousedown="startDrag"
           @touchstart="startDrag">
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    fileUrl: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      scale: 1,
      rotation: 0,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0
    }
  },

  computed: {
    imageStyle() {
      return {
        transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale}) rotate(${this.rotation}deg)`,
        transition: this.isDragging ? 'none' : 'transform 0.3s',
        cursor: this.isDragging ? 'grabbing' : 'grab'
      }
    }
  },

  mounted() {
    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('touchmove', this.onDrag);
    window.addEventListener('mouseup', this.stopDrag);
    window.addEventListener('touchend', this.stopDrag);
  },

  beforeDestroy() {
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('touchmove', this.onDrag);
    window.removeEventListener('mouseup', this.stopDrag);
    window.removeEventListener('touchend', this.stopDrag);
  },

  methods: {
    zoomIn() {
      this.scale = Math.min(this.scale * 1.2, 5)
    },

    zoomOut() {
      this.scale = Math.max(this.scale / 1.2, 0.1)
    },

    rotateLeft() {
      this.rotation = (this.rotation - 90) % 360
    },

    rotateRight() {
      this.rotation = (this.rotation + 90) % 360
    },

    resetView() {
      this.scale = 1;
      this.rotation = 0;
      this.translateX = 0;
      this.translateY = 0;
    },

    downloadImage() {
      const a = document.createElement('a')
      a.href = this.fileUrl
      a.download = this.fileUrl.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },

    onImageLoad() {
      this.$emit('loaded')
    },

    onImageError(error) {
      this.$emit('error', error)
    },

    startDrag(event) {
      this.isDragging = true;
      const point = event.touches ? event.touches[0] : event;
      this.startX = point.clientX - this.translateX;
      this.startY = point.clientY - this.translateY;
    },

    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      
      const point = event.touches ? event.touches[0] : event;
      this.translateX = point.clientX - this.startX;
      this.translateY = point.clientY - this.startY;
    },

    stopDrag() {
      this.isDragging = false;
    }
  }
}
</script>

<style scoped>
.image-viewer {
  width: 100%;
  height: 100vh;
  position: relative;
  background: #f5f5f5;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
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

.tool-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  padding: 0;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tool-btn i {
  font-size: 24px;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
}
</style> 