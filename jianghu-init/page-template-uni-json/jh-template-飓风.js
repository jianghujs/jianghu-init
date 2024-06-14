// ---------- 首页
// 搜索 - uview
// 图片 - uview
// 宫格菜单 - uview
// 新闻简报 => uview
{ 
  template: "jh-noticeBar",
  param: {
    data: 'noticeBar'
  },
  value: '',
  slot: {
    image: `<div>自定义插槽</div>`,
    content:  { tag: 'div', value: '自定义插槽', attrs: { color: 'success' } }
  }
}
noticeBar: {
  imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
  data: [
    {
      text: '新闻1',
      url: '/pages/course/list',
    },
    {
      text: '新闻2',
      url: '/pages/course/list',
    }
  ]
}
// 三宫格图文 ✅
{ 
  template: "jh-threeGirdImageAndText",
  param: {
    ':data': 'threeGirdImageAndText'
  },
  value: '',
  slot: {
    title: `<div>自定义插槽</div>`,
    image:  { tag: 'div', value: '自定义插槽', attrs: { color: 'success' } }
  }
}
threeGirdImageAndText: [
  {
    title: '【特邀】多妈聊教育',
    url: '/pages/course/list',
    imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png'
  },
  {
    title: '【特邀】以诺讲财务',
    url: '/pages/course/list',
    imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png'
  },
  {
    title: '【特邀】旭哥学说话',
    url: '/pages/course/list',
    imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png'
  }
]
// 轮播图文 - uview
// 上下图文 ✅
{ 
  template: "jh-imageAndTexTB",
  param: {
    ':data': 'imageAndTexTB'
  },
  value: '',
  slot: {
    title: `<div>自定义标题插槽</div>`,
    tag:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    label:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    image:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
imageAndTexTB: {
  url: '/pages/course/list',
  imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
  title: '知识付费考试',
  tag: ['学习', '文章'],
  tagColor: '#2C8EFF',
  tagBgColor: '#F3F8FF',
  label: '免费',
  labelColor: '#FE2A2A'
}
//左右图文 ✅
{ 
  template: "jh-imageAndTextLR",
  param: {
    ':data': 'imageAndTextLR'
  },
  value: '',
  slot: {
    title: `<div>自定义标题插槽</div>`,
    tag:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    label:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    image:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
imageAndTextLR: {
  url: '/pages/course/list',
  imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
  title: '知识付费考试',
  tag: '免费',
  tagColor: '#FE2A2A',
  leftLabel: '共8节',
  rightLabel: '3213人已答题'
}
// 上下图文 - 已定义





// ---------- 课程列表
// 搜索 - uview
// tabs - uview
// 左右图文 - 已定义





// ---------- 课程详情
// 轮播图 - uview
// 课程信息 ✅
{ 
  template: "jh-goodInfo",
  param: {
    data: 'goodInfo'
  },
  value: '',
  slot: {
    title: `<div>自定义标题插槽</div>`,
    tag:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    button:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
goodInfo: {
  url: '/pages/course/list',
  title: '知识付费考试',
  tag: ['文章'],
  tagColor: '#2C8EFF',
  tagBgColor: '#F3F8FF',
  button: [
    {
      text: '分享',
      icon: 'share-square',
      color: '#999999'
    },
    {
      text: '收藏',
      icon: 'heart-fill',
      color: '#FF6B00'
    }
  ]
}
// 数量概览 - uview
{ 
  template: "jh-quantityOverview",
  param: {
    data: 'quantityOverview'
  },
  value: '',
  slot: {
    title: `<div>自定义标题插槽</div>`,
    label:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
quantityOverview: [
  {
    num: 10,
    label: '总节数',
  },
  {
    imageUrl: [
      'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
      'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png'
    ],
    label: '已有5966人学习',
  },
]
// tabs - uview
// 课程列表 - uview
{ 
  template: "jh-courseList",
  param: {
    data: 'courseList'
  },
  value: '',
  slot: {
    image: `<div>自定义标题插槽</div>`,
    title: `<div>自定义标题插槽</div>`,
    tag:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
courseList: [
  {
    imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
    text: '已有5966人学习',
    tag: '免费',
    tagColor: '#FE2A2A',
  },
]
// 富文本解析 - uview
// 评价列表 ✅
{ 
  template: "jh-comment",
  param: {
    data: 'comment'
  },
  value: '',
  slot: {
    image: `<div>自定义标题插槽</div>`,
    title: `<div>自定义标题插槽</div>`,
    label:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    description:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
comment: {
  imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
  text: 'usernam0',
  label: '2024-04-12 16:12',
  description: '评论交流文字',
}
// 写评价 - uview
// 底部导航栏 - uview





// ---------- 商城列表
// tabs - uview
// 上下图文 - 已定义





// ---------- 个人中心
// 个人信息 ✅
{ 
  template: "jh-userInfo",
  param: {
    data: 'userInfo'
  },
  value: '',
  slot: {
    image: `<div>自定义标题插槽</div>`,
    title: `<div>自定义标题插槽</div>`,
    icon:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
  }
}
userInfo: {
  url: '',
  imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
  text: 'usernam0'
}
// 图片 - uview
// 宫格菜单 - uview
// 宫格菜单 - uview




// ---------- 个人信息详情
// 个人信息详情 - uview




// ---------- 商品详情
// 轮播图 - uview
// 商品信息 ✅
{ 
  template: "jh-goodInfo2",
  param: {
    data: 'goodInfo2'
  },
  value: '',
  slot: {
    title1: `<div>自定义标题插槽</div>`,
    title2:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    label1:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    label2:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    label3:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
goodInfo2: {
  url: '/pages/course/list',
  title1: '66.00',
  title2: '知识付费考试',
  label1: '划线价：¥99.00',
  label2: '库存：0件',
  label3: '销量：113件'
}
// 富文本解析 - uview
// 评价列表 - 已定义
// 底部导航栏 - uview





// ---------- 商品购买
// 地址信息 - uview
// 选择地址 - uview
{ 
  template: "jh-chooseAddress",
  param: {
    data: 'chooseAddress'
  },
  value: '',
  slot: {
    image: `<div>自定义标题插槽</div>`,
    title: `<div>自定义标题插槽</div>`,
    label:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  }
}
chooseAddress: [
  {
    imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
    username: '苏清',
    tel: '17432423444',
    address: '北京市海淀区家新家园',
  },
]
// 左右图文 - 已定义
// 备注 - uview
// 底部导航栏 ✅
//  左：首页、客服按钮；自定义配置，插槽
//  右：按钮，可定义大小，按钮可配置多个
{ 
  template: "jh-bottomBar",
  param: {
    data: 'bottomBar'
  },
  value: '',
  slot: {
    left: `<div>自定义标题插槽</div>`,
    right: `<div>自定义标题插槽</div>`,
  }
}
bottomBar: {
  leftButton:[
    {
      text: '首页',
      icon: 'share-square',
      color: '#999999',
      click: ''
    },
    {
      text: '客服',
      icon: 'share-square',
      color: '#999999',
      click: ''
    }
  ]
  rightButton: [
    {
      text: '立即购买',
      color: '#2C8EFF',
      click: 'shop'
    },
    {
      text: '结算',
      color: '#2C8EFF',
      click: 'payment'
    }
  ]
}






// ---------- 地址列表
// 地址列表 ✅
{ 
  template: "jh-addressList",
  param: {
    data: 'addressList',
    addresValue: 'addresValue',
  },
  value: '',
  slot: {
    username: `<div>自定义标题插槽</div>`,
    address:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    setDefault:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    edit:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } },
    del:  { tag: 'div', value: '自定义tag插槽', attrs: { color: 'success' } }
  },
  action: {
    setDefault: '',
    editClick: '',
    delClick: ''
  }
}
addressList: [
  {
    id: 1,
    username: '苏清',
    tel: '17432423444',
    address: '北京市海淀区家新家园'
  },
  {
    id: 2,
    username: '苏清222',
    tel: '17432423444',
    address: '北京市海淀区家新家园'
  }
]



// ---------- 添加/编辑地址
// 表单 - uview





// ---------- 订单列表
// tabs - uview
// 订单信息 card ✅
{ 
  template: "jh-orderInfo",
  param: {
    data: 'orderInfo'
  },
  value: '',
  slot: {
    top: `<div>自定义标题插槽</div>`,
    content: `<div>自定义标题插槽</div>`,
    action: `<div>自定义标题插槽</div>`,
  }
}
orderInfo: {
  orderId: 'SP1699542658535271374',
  orderStatus: '待发货',
  url: '',
  imageUrl: 'https://demo.jianghujs.org/jufeng-student/upload/teacher/articleMaterial/56160/1666540566136_微信图片_20221023215307.png',
  title: '孙子兵法',
  price: 9,
  number: 1,
  totalPrice: 9,
  button: [
    {
      text: '立即付款',
      color: '#2C8EFF',
      click: 'payment'
    },
    {
      text: '查看详情',
      color: '#2C8EFF',
      click: 'orderDetail'
    }
  ]
}





// ---------- 订单详情
// 订单状态 - uview
// 订单信息 card - 已定义
// 订单信息项 - uview
// 申请退款 - uview
// 底部操作栏 - 已定义
