const content = {
  version: 'v7',
  pageType: 'jh-component',

  component: {
    path: 'biz/project/ProjectSummaryCard',
    name: '项目概览卡',
    targets: 'pc',
  },

  pageContent: {
    component: 'VStack',
    props: { gap: 8 },
    children: [
      {
        component: 'PageTitle',
        props: { title: '项目概览' },
      },
    ],
  },

  common: {
    props: {
      project: { type: Object, required: true },
    },
  },
};

module.exports = content;
