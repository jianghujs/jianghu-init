/**
 * V7 子组件 UI 模式示例（jh-component，无 fields/views）
 */
const content = {
  version: 'v7',
  pageType: 'jh-component',

  component: {
    path: 'biz/example/ProjectSummaryCardFull',
    name: '项目概览卡（全集）',
    targets: 'pc',
  },

  includeList: [
    { type: 'css', path: '/component/projectSummaryCard/card.css' },
    { type: 'html', path: 'component/projectSummaryCard/badge.html' },
  ],

  pageContent: {
    component: 'VStack',
    props: { gap: 8, class: 'project-summary-card' },
    children: [
      {
        component: 'PageTitle',
        props: { title: '项目概览', helpBtn: false },
      },
      {
        component: 'HStack',
        props: { gap: 12, align: 'center' },
        children: [
          {
            component: 'Box',
            props: { class: 'flex-1 rounded-lg border p-3' },
            children: [
              '<div class="text-xs text-gray-500">项目名称</div>',
              '<div class="text-lg font-bold">{{ project.projectName }}</div>',
            ],
          },
          {
            component: 'Box',
            props: { class: 'rounded-lg border p-3' },
            children: [
              '<div class="text-xs text-gray-500">状态</div>',
              '<div :class="statusClass">{{ project.status }}</div>',
            ],
          },
        ],
      },
      {
        component: 'MobileFilterBtn',
        props: { label: '更多', icon: 'more-2' },
        attrs: { '@click': 'onMoreClick' },
      },
    ],
  },

  common: {
    props: {
      project: { type: Object, required: true },
      cardTitle: { type: String, default: '项目概览' },
    },
    computed: {
      statusClass() {
        const s = this.project && this.project.status;
        if (s === '已归档') return 'text-gray-400';
        if (s === '进行中') return 'text-green-600';
        return 'text-orange-500';
      },
    },
    methods: {
      onMoreClick() {
        this.$emit('more');
      },
    },
  },
};

module.exports = content;
