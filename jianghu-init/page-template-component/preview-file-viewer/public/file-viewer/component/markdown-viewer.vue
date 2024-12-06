<template>
  <div class="markdown-viewer">
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
          // this.$root.utils.loadCss('./lib/markdown/highlight.min.css'),
          this.$root.utils.loadCss('./lib/markdown/github.min.css'),
        ]);

        // 配置 marked
        marked.setOptions({
          highlight: function(code, lang) {
            let highlightedCode;
            if (lang && hljs.getLanguage(lang)) {
              highlightedCode = hljs.highlight(code, { language: lang }).value;
            } else {
              highlightedCode = hljs.highlightAuto(code).value;
            }
            
            // 添加行号
            const lines = highlightedCode.split('\n');
            const numberedLines = lines.map((line, index) => {
              const lineNumber = `<span class="line-number" style="display:inline-block;width:40px;text-align:right;padding-right:10px;color:#999;user-select:none;">${index + 1}</span>`;
              return `<div class="line">${lineNumber}<span class="line-content">${line}</span></div>`;
            });
            
            return `<div class="code-block" style="position:relative;">${numberedLines.join('')}</div>`;
          },
          renderer: new marked.Renderer(),
          gfm: true,
          tables: true,
          breaks: true,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
        });

        // 获取文件内容
        const response = await fetch(this.fileUrl);
        this.content = await response.text();
        const ext = this.fileUrl.split('.').pop().toLowerCase();
        if (ext !== 'md') {
          this.content = "```".concat(this.getFileLanguage(ext), "\n").concat(this.content, "\n```");
        }

        // 渲染 markdown
        this.renderedContent = marked.parse(this.content);
        
        this.$emit('loaded');
      } catch (error) {
        console.error('Markdown viewer error:', error);
        this.$emit('error', error);
      }
    },
    getFileLanguage(ext) {
      const languageMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'vue': 'vue',
        'html': 'html',
        'css': 'css',
        'less': 'less',
        'scss': 'scss',
        'sass': 'sass',
        'json': 'json',
        'md': 'markdown',
        'sql': 'sql',
        'py': 'python',
        'java': 'java',
        'php': 'php',
        'go': 'go',
        'rs': 'rust',
        'rb': 'ruby',
        'sh': 'shell',
        'yml': 'yaml',
        'yaml': 'yaml',
        'xml': 'xml',
        'txt': 'plaintext'
      };
      return languageMap[ext] || 'plaintext';
    }
  }
}
</script>

<style>
.markdown-viewer {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #f5f5f5;
  overflow: hidden;
  overflow-y: auto; 
  user-select: none;
  -webkit-user-select: none;
  box-sizing: border-box;
  padding: 20px;
}
@media (max-width: 768px) {
  .markdown-viewer {
    padding: 10px;
  }
}

.markdown-content pre {
  padding-top: 10px;
}

.markdown-content .line-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 
