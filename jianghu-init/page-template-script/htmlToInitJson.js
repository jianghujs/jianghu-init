const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
// 读取文件的路径
const filePath = path.resolve(__dirname, '../app/view/user-group-role/init.html');
// 使用 fs.readFileSync 方法读取文件内容
const htmlString = fs.readFileSync(filePath, 'utf-8');

const $ = cheerio.load(htmlString, { xml: { recognizeSelfClosing: true, decodeEntities: false } });

let forms = [];

let initjson = {
  pageType: "jh-page",
  pageId: "course",
  table: "course",
  pageName: "org页面",
  resourceList: [],
  includeList: [],
  common: {
    data: {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  },
  pageContent: [],
  actionContent: [],
}

$('v-navigation-drawer v-form').each(function(i, formElem) {
  let config = {
    formItemList: [],
    action: [],
  };

  // 读小标题
  $(formElem).find('v-row').each(function(i, elem) {
    const title = $(elem).find('span.title').text();
    if (title) {
      config.formItemList.push({class: 'title pl-4', tag: 'span', value: title });
    }

    $(elem).find('>v-col').each(function(i, elem) {
      let label = $(elem).find('span.inputLabel').text();
      if (!label) {
        label = $(elem).find('span.jh-input-label').text();
      }
      const field = $(elem).children().not('span');
      if (field[0]) {
        let model = field.attr('v-model');
        let tag = field[0].name;
        const attrs = {};
  
        for (const [key, value] of Object.entries(field.attr())) {
          if (key !== 'v-model' && key !== 'class') {
            attrs[key] = value == '' ? true : value;
          }
          
        }
        if (tag == 'datetime-picker') {
          tag = 'v-date-picker'
        }
        if (!label) {
          label = attrs.label;
        }
        if (model) {
            // model值可能是a1.xxx, a2.xxx,或a1['xxx'],只需要取.后面,或者[]中间的值
            // model = model.split('.').pop();
        }
        let item = { label, model, tag, attrs, rules: attrs[':rules'] };

        delete attrs[':rules'];
        delete attrs['dense'];
        delete attrs['filled'];
        delete attrs['single-line'];
        //排除item空值
        item = Object.fromEntries(Object.entries(item).filter(([_, v]) => v));

        config.formItemList.push(item);
      }
    });
  });


  $(formElem).find('v-row > v-btn').each(function(i, elem) {
    const tag = elem.name;
    const value = $(elem).text();
    const attrs = {
      color: 'primary',
      small: true,
    };

    for (const [key, value] of Object.entries($(elem).attr())) {
      if (key !== 'class') {
        attrs[key] = value;
      }
    }

    config.action.push({ tag, value, attrs });
  });

  forms.push(config);
});

$('v-data-table').each(function(i, elem) {
  const attrs = {}
  for (const [key, value] of Object.entries($(elem).attr())) {
    if (key !== 'class') {
      attrs[key] = value;
    }
  }

  initjson.pageContent.push({
    tag: 'jh-table',
    attrs,
    slot: $(elem).html()
  })
});

initjson.actionContent.push({
  tag: 'jh-drawer',
  key: "create",
  title: '新增',
  contentList: forms.map(form=> (
    {
      label: "新增",
      type: "form", 
      formItemList: form.formItemList
    }
  )),
})


// const dataMatch = htmlString.match(/data: \(\) => \(([\s\S]*?)\),/);
// const methodsMatch = htmlString.match(/methods: \{([^}]+)\}/);
// const watchMatch = htmlString.match(/watch: \{([^}]+)\}/);
// const computedMatch = htmlString.match(/computed: \{([^}]+)\}/);
// const propsMatch = htmlString.match(/props: \{([^}]+)\}/);jianghujs_attendance
// const modelMatch = htmlString.match(/model: \{([^}]+)\}/);


// if (dataMatch) {

//   initjson.common.data = dataMatch[1]
// }
// if (methodsMatch) {
//   initjson.common.methods =  methodsMatch[1];
// }
// if (watchMatch) {
//   initjson.common.watch =  watchMatch[1];
// }
// if (computedMatch) {
//   initjson.common.computed =  computedMatch[1];
// }
// if (propsMatch) {
//   initjson.common.props =  propsMatch[1];
// }
// if (modelMatch) {
//   initjson.common.model =  modelMatch[1];
// }

// 获取文件的基本名称
const baseName = path.basename(filePath, '.html');

initjson.pageName = baseName
initjson.componentPath = baseName

// 写到json目录
const outputFilePath = path.resolve(__dirname, `${baseName}.json`);

let outputContent = JSON.stringify(initjson, null, 2);
outputContent = outputContent
  .replace(/\\n/g, '\n')
  .replace(/\\r/g, '\r')
  .replace(/\\/g, '');
  
// 使用 fs.writeFileSync 方法将 JSON 对象写入文件
fs.writeFileSync(outputFilePath,  outputContent);
