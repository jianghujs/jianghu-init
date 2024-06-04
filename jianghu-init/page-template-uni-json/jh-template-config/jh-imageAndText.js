// 配置
{ 
  template: "jh-imageAndText",
  param: {
    data: 'imageAndText'
  },
  value: '',
  slot: {
    title: `<div>自定义标题插槽</div>`,
    tag:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}

// 数据结构
imageAndText: {
  url: '/pages/course/list',
  imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
  title: '知识付费考试',
  tag: '免费',
  tagColor: '#FE2A2A',
  leftLabel: '共8节',
  rightLabel: '3213人已答题'
}

