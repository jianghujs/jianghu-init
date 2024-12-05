<template>
  <div class="video-viewer">
    <!-- 视频播放器容器 -->
    <div class="video-container">
      <!-- 视频元素 -->
      <video
        ref="video"
        class="video-player"
        :src="fileUrl"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @error="onError"
        @click="togglePlay"
      ></video>

      <!-- 控制栏 -->
      <div class="controls" v-show="controlsVisible" @mouseover="showControls" @mouseleave="hideControls">
        <!-- 进度条 -->
        <div class="progress-bar" @click="seek">
          <div class="progress" :style="{ width: progress + '%' }"></div>
          <div class="progress-handle" :style="{ left: progress + '%' }"></div>
        </div>

        <!-- 控制按钮组 -->
        <div class="control-buttons">
          <!-- 播放/暂停按钮 -->
          <button class="control-btn" @click.stop="togglePlay">
            <img :src="isPlaying ? './svg/pause.svg' : './svg/play.svg'" style="width: 24px; height: 24px;">
          </button>

          <!-- 时间显示 -->
          <div class="time">
            <span>{{ formatTime(currentTime) }}</span>
            <span>/</span>
            <span>{{ formatTime(duration) }}</span>
          </div>

          <!-- 音量控制 -->
          <div class="volume-control">
            <button class="control-btn" @click.stop="toggleMute">
              <img :src="isMuted ? './svg/volume-off.svg' : './svg/volume-up.svg'" style="width: 24px; height: 24px;">
            </button>
            <input 
              type="range" 
              class="volume-slider" 
              min="0" 
              max="100" 
              v-model.number="volume"
              @input="updateVolume"
            >
          </div>

          <!-- 全屏按钮 -->
          <button class="control-btn" @click.stop="toggleFullscreen">
            <img :src="isFullscreen ? './svg/compress.svg' : './svg/expend.svg'" style="width: 24px; height: 24px;">
          </button>

          <!-- 下载按钮 -->
          <button class="control-btn" @click.stop="downloadVideo">
            <img src="./svg/download.svg" style="width: 24px; height: 24px;">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'video-viewer',
  props: {
    fileUrl: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      isPlaying: false,
      isMuted: false,
      isFullscreen: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      volume: 100,
      controlsVisible: true,
      controlsTimer: null
    }
  },

  mounted() {
    // 监听全屏变化
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
    // 初始化音量
    this.$refs.video.volume = this.volume / 100;
  },

  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    clearTimeout(this.controlsTimer);
  },

  methods: {
    togglePlay() {
      const video = this.$refs.video;
      if (this.isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      this.isPlaying = !this.isPlaying;
    },

    onTimeUpdate(e) {
      this.currentTime = e.target.currentTime;
      this.progress = (this.currentTime / this.duration) * 100;
    },

    onLoadedMetadata(e) {
      this.duration = e.target.duration;
      this.$emit('loaded');
    },

    onEnded() {
      this.isPlaying = false;
      this.currentTime = 0;
      this.progress = 0;
    },

    onError(error) {
      this.$emit('error', error);
    },

    seek(e) {
      const video = this.$refs.video;
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const time = percentage * this.duration;
      video.currentTime = time;
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    toggleMute() {
      const video = this.$refs.video;
      video.muted = !video.muted;
      this.isMuted = video.muted;
      if (this.isMuted) {
        this.volume = 0;
      } else {
        this.volume = 100;
      }
    },

    updateVolume() {
      const video = this.$refs.video;
      video.volume = this.volume / 100;
      video.muted = this.volume === 0;
      this.isMuted = video.muted;
    },

    async toggleFullscreen() {
      if (!document.fullscreenElement) {
        await this.$el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    },

    onFullscreenChange() {
      this.isFullscreen = !!document.fullscreenElement;
    },

    downloadVideo() {
      const a = document.createElement('a');
      a.href = this.fileUrl;
      a.download = this.fileUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    showControls() {
      clearTimeout(this.controlsTimer);
      this.controlsVisible = true;
    },

    hideControls() {
      if (this.isPlaying) {
        this.controlsTimer = setTimeout(() => {
          this.controlsVisible = false;
        }, 2000);
      }
    }
  }
}
</script>

<style scoped>
.video-viewer {
  width: 100%;
  height: 100vh;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 20px;
  transition: opacity 0.3s;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-handle {
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.control-btn:hover {
  opacity: 1;
}

.time {
  color: white;
  font-size: 14px;
  display: flex;
  gap: 4px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

/* 全屏样式 */
:fullscreen .video-container {
  background: black;
}

:fullscreen .video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style> 