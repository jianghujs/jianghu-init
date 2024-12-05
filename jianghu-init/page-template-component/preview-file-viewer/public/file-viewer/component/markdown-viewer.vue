<template>
  <div class="markdown-viewer" style="height: 100vh; overflow: hidden; overflow-y: auto; padding: 20px;">
    <div v-html="renderedContent" class="markdown-content"></div>
  </div>
</template>

<script>
module.exports = {
  name: 'markdown-viewer',
  props: ['fileUrl'],
  data() {
    return {
      content: '',
      renderedContent: ''
    }
  },
  mounted() {
    this.loadViewer();
  },
  methods: {
    async loadViewer() {
      try {
        await Promise.all([
          this.$root.utils.loadScript('./lib/markdown/marked.min.js'),
          this.$root.utils.loadScript('./lib/markdown/highlight.min.js'),
          this.$root.utils.loadCss('./lib/markdown/github.min.css')
        ]);

        // 配置 marked
        marked.setOptions({
          highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
              return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
          },
          breaks: true,
          gfm: true
        });

        // 获取文件内容
        const response = await fetch(this.fileUrl);
        this.content = await response.text();
        
        // 渲染 markdown
        this.renderedContent = marked.parse(this.content);
        
        this.$emit('loaded');
      } catch (error) {
        console.error('Markdown viewer error:', error);
        this.$emit('error', error);
      }
    }
  }
}
</script>

<style>
.markdown-content {
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-content h1 {
  padding-bottom: .3em;
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
}

.markdown-content h2 {
  padding-bottom: .3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.markdown-content h3 {
  font-size: 1.25em;
}

.markdown-content h4 {
  font-size: 1em;
}

.markdown-content h5 {
  font-size: .875em;
}

.markdown-content h6 {
  font-size: .85em;
  color: #6a737d;
}

.markdown-content pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-content code {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,.05);
  border-radius: 6px;
}

.markdown-content pre code {
  padding: 0;
  background-color: transparent;
}

.markdown-content blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: .25em solid #dfe2e5;
  margin: 0;
}

.markdown-content table {
  border-spacing: 0;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.markdown-content table th,
.markdown-content table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-content table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-content img {
  max-width: 100%;
  box-sizing: content-box;
}

.markdown-content p {
  margin-bottom: 16px;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 2em;
  margin-bottom: 16px;
}
</style> 