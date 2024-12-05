<template>
  <div class="audio-viewer">
    <!-- 音频播放器 -->
    <div class="audio-player">
      <!-- 封面图 -->
      <div class="cover">
        <img src="./svg/music.svg" alt="音频封面">
      </div>

      <!-- 控制栏 -->
      <div class="controls">
        <!-- 进度条 -->
        <div class="progress-bar" @click="seek($event)">
          <div class="progress" :style="{ width: progress + '%' }"></div>
          <div class="progress-handle" :style="{ left: progress + '%' }"></div>
        </div>

        <!-- 时间显示 -->
        <div class="time">
          <span>{{ formatTime(currentTime) }}</span>
          <span>/</span>
          <span>{{ formatTime(duration) }}</span>
        </div>

        <!-- 控制按钮 -->
        <div class="buttons">
          <button class="tool-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
            <img :src="isPlaying ? './svg/pause.svg' : './svg/play.svg'" style="width: 24px; height: 24px;">
          </button>
          <button class="tool-btn" @click="downloadAudio" title="下载">
            <img src="./svg/download.svg" style="width: 24px; height: 24px;">
          </button>
        </div>
      </div>
    </div>

    <!-- 实际的音频元素 -->
    <audio 
      ref="audio" 
      :src="fileUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @error="onError"
    ></audio>
  </div>
</template>

<script>
module.exports = {
  name: 'audio-viewer',
  props: {
    fileUrl: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0
    }
  },

  methods: {
    togglePlay() {
      if (this.isPlaying) {
        this.$refs.audio.pause();
      } else {
        this.$refs.audio.play();
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
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const time = percentage * this.duration;
      this.$refs.audio.currentTime = time;
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    downloadAudio() {
      const a = document.createElement('a');
      a.href = this.fileUrl;
      a.download = this.fileUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
</script>

<style scoped>
.audio-viewer {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.audio-player {
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.cover {
  width: 200px;
  height: 200px;
  margin: 0 auto 24px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover img {
  width: 180px;
  height: 180px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
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

.time {
  display: flex;
  justify-content: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
}

.tool-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(84, 86, 84, 0.6);
  color: #4CAF50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.tool-btn:hover {
  background: rgba(84, 86, 84, 0.8);
}

.tool-btn img {
  opacity: 0.8;
}
</style> 