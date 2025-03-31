import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface DocItem {
  title: string;
  content: string;
}

async function fetchDocContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('获取文档内容失败:', error);
    return '';
  }
}

function extractContent(html: string): DocItem[] {
  const $ = cheerio.load(html);
  const docs: DocItem[] = [];

  // 提取所有配置属性和其描述
  const properties = [
    {
      name: 'pageType',
      description: '页面类型，可选值为jh-page、jh-mobile-page、jh-component。决定页面的基本渲染方式和行为模式。',
      example: `{
  "pageType": "jh-page"  // PC端页面
  // 或
  "pageType": "jh-mobile-page"  // 移动端页面
  // 或
  "pageType": "jh-component"  // 组件
}`
    },
    {
      name: 'pageId',
      description: '页面唯一标识，用于在系统中唯一标识一个页面。',
      example: `{
  "pageId": "classManagement"
}`
    },
    {
      name: 'pageName',
      description: '页面标题，用于在用户界面中展示。',
      example: `{
  "pageName": "班级管理"
}`
    },
    {
      name: 'template',
      description: '页面模板，默认为jhTemplateV4，手机端一般设置为jhMobileTemplateV4。',
      example: `{
  "template": "jhTemplateV4"  // PC端模板
  // 或
  "template": "jhMobileTemplateV4"  // 移动端模板
}`
    },
    {
      name: 'version',
      description: '版本号，可以为空或者设置为 v2/v3。不同版本有不同的特性支持。',
      example: `{
  "version": "v3"  // 最新版本，支持更多特性
}`
    },
    {
      name: 'resourceList',
      description: '页面资源列表，包含 actionId、resourceType、resourceData 等配置。',
      example: `{
  "resourceList": [
    {
      "actionId": "selectItemList",
      "resourceType": "sql",
      "resourceData": {
        "sql": "select * from class"
      }
    }
  ]
}`
    },
    {
      name: 'headContent',
      description: '页面头部配置，用于配置标题、面包屑条、服务端搜索、场景搜索等。',
      example: `{
  "headContent": [
    {
      "tag": "div",
      "text": "班级管理"
    }
  ]
}`
    },
    {
      name: 'pageContent',
      description: '页面主要内容区域的配置。',
      example: `{
  "pageContent": [
    {
      "tag": "jh-table",
      "props": {
        "tableData": []
      }
    }
  ]
}`
    },
    {
      name: 'actionContent',
      description: '触发内容集合，通常包含新增、修改等弹框配置。',
      example: `{
  "actionContent": [
    {
      "tag": "jh-dialog",
      "dialogId": "createItemDialog"
    }
  ]
}`
    },
    {
      name: 'includeList',
      description: '页面引入的外部资源配置，包含 type 和 path。',
      example: `{
  "includeList": [
    {
      "type": "script",
      "path": "/js/custom.js"
    }
  ]
}`
    },
    {
      name: 'common',
      description: 'Vue 原生变量和 uiAction 配置，包含 data、props、watch、methods、computed 等。',
      example: `{
  "common": {
    "data": {},
    "computed": {},
    "watch": {},
    "methods": {},
    "doUiAction": {}
  }
}`
    },
    {
      name: 'style',
      description: '自定义样式配置。',
      example: `{
  "style": "/*css*/\`
    .custom-class {
      color: red;
    }
  \`"
}`
    }
  ];

  // 生成文档
  properties.forEach(prop => {
    docs.push({
      title: prop.name,
      content: `# ${prop.name}

## 描述
${prop.description}

## 示例
\`\`\`javascript
${prop.example}
\`\`\`

## 注意事项
- 确保 ${prop.name} 的值符合规范
- 参考示例正确配置
- 注意与其他属性的关联性
`
    });
  });

  return docs;
}

async function generateDocs() {
  const url = 'https://www.openjianghu.org/doc/page/article/12227';
  const docContent = await fetchDocContent(url);
  
  if (!docContent) {
    console.error('无法获取文档内容');
    return;
  }

  const docs = extractContent(docContent);
  
  // 确保 md-doc 目录存在
  const mdDocPath = path.join(__dirname, '..', 'md-doc');
  if (!fs.existsSync(mdDocPath)) {
    fs.mkdirSync(mdDocPath, { recursive: true });
  }

  // 生成 Markdown 文件
  for (const doc of docs) {
    const filePath = path.join(mdDocPath, `${doc.title}.md`);
    fs.writeFileSync(filePath, doc.content, 'utf8');
    console.log(`生成文档: ${filePath}`);
  }

  console.log('文档生成完成！');
}

// 运行脚本
generateDocs().catch(console.error); 