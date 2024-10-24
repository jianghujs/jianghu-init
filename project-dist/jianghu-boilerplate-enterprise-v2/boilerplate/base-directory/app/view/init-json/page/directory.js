const content = {
  pageType: "jh-page", pageId: "directory", table: "directory", pageName: "目录", 
  resourceList: [
    // 	directory	selectItemList	✅查询目录	service		{ "service": "directory", "serviceFunction": "getDirectoryList" }
    {
      actionId: "selectItemList",
      resourceType: "service",
      resourceHook: {},
      desc: "✅查询列表-directory",
      resourceData: { service: "directory", serviceFunction: "getDirectoryList" }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "欢迎进入目录管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],
  pageContent: [
    {
      tag: 'v-card',
      attrs: { class: 'jh-wrapper-card', style: 'width: 100%' },
      quickAttrs: ['outlined'],
      value: `
        <v-row dense no-gutters v-if="isDirectoryLoading || (!isDirectoryLoading && directoryList)">
          <!-- 目录 -->
          <v-col cols="12" xs="12" sm="3" md="2" class="jh-fixed-table-height overflow-y-auto" style=" max-width: 160px !important;">
            <v-card flat class="py-1 px-2 px-md-8 jh-directory-card">
              <div class="jh-card-body px-4 px-sm-0">
                <v-skeleton-loader
                  type="list-item-three-line, list-item-three-line, list-item-three-line"
                  v-if="isDirectoryLoading"
                ></v-skeleton-loader>
                <template v-else>
                  <div v-for="(value, key, index) in groupedItems" :key="index" class="mb-5">
                    <div class="mb-6"></div>
                    <template v-if="value.length">
                      <div class="font-weight-bold text-subtitle-2 text--darken-2 mb-3">{{key}}</div>
                      <div class="mb-3" v-for="(val, i) in value" :key="i">
                        <a class="jh-font-size-14 text-decoration-none"  :class="activeDirectory === val.name ? 'success--text' : 'grey--text text--darken-2'" :href="\`#$\{val.name}\`" @click="activeDirectory = val.name">{{val.name}}</a>
                      </div> 
                    </template>
                  </div>
                </template>
              </div>
            </v-card>
          </v-col>

          <!-- 应用 -->
          <v-col cols="12" xs="12" class="jh-fixed-table-height overflow-y-auto" style="flex: 1"> 
            <v-card flat class="pa-0 pa-md-6 px-md-8 jh-list-card">
              <div class="jh-card-body px-4 px-md-6 px-sm-0">
                <v-skeleton-loader
                  type="list-item-three-line, list-item-three-line, list-item-three-line"
                  v-if="isDirectoryLoading"
                ></v-skeleton-loader>
                <template v-else>
                  <div class="mb-6" v-for="(catalog, catalogIndex) in directoryList" :key="catalogIndex">
                    <div class="font-weight-medium text-h6 mb-2" :id="\`$\{catalog.name}\`">{{catalog.name}}</div>
                    <v-row style="margin: -8px">
                      <v-col cols="12" xs="12" sm="6" md="4"
                        v-for="(app, appIndex) in catalog.children"  
                        :key="catalogIndex + '-' + appIndex"
                        class="pa-3"
                        >
                        <v-card class="rounded-lg pa-4 jh-app-card" outlined role="button">
                          <div class="px-4 px-sm-0">
                            <div class="d-flex align-center justify-space-between" @click.stop="!app.children.length ? doUiAction('jump', app.url) : doUiAction('changeExpandApp', { key: catalogIndex + '-' + appIndex })">
                              <div class="d-flex align-center">
                                <!-- icon -->
                                <div class="jh-app-icon">
                                  <v-avatar size="28" v-if="app.icon" tile>
                                    <img
                                      :src="directoryUrl + '/<$ ctx.app.config.appId $>' + app.icon"
                                    >
                                  </v-avatar>
                                  <svg v-else t="1702548638970" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13380" width="200" height="200"><path d="M864 144.014222H559.985778a16.042667 16.042667 0 0 0-15.985778 15.985778v304.014222c0 8.789333 7.196444 15.985778 16.014222 15.985778h303.985778c8.817778 0 16.014222-7.196444 16.014222-16.014222V160.028444a16.042667 16.042667 0 0 0-16.014222-16.014222z m0 399.985778H559.985778a16.042667 16.042667 0 0 0-15.985778 16.014222v303.985778c0 8.817778 7.196444 16.014222 16.014222 16.014222h303.985778c8.817778 0 16.014222-7.224889 16.014222-16.014222V559.985778a16.042667 16.042667 0 0 0-16.014222-15.985778zM463.985778 143.985778H160.028444a16.042667 16.042667 0 0 0-16.014222 16.014222v304.014222c0 8.789333 7.224889 15.985778 16.014222 15.985778h304.014223c8.789333 0 15.985778-7.196444 15.985777-16.014222V160.028444a16.042667 16.042667 0 0 0-16.014222-16.014222z m0 400.014222H160.028444a16.042667 16.042667 0 0 0-16.014222 16.014222v303.985778c0 8.817778 7.224889 16.014222 16.014222 16.014222h304.014223c8.789333 0 15.985778-7.224889 15.985777-16.014222V559.985778a16.042667 16.042667 0 0 0-16.014222-15.985778z" fill="#333333" fill-opacity=".65" p-id="13381"></path></svg>
                                </div>
                                <!-- app name -->
                                <div class="font-weight-medium text-subtitle-1 grey--text text--darken-4 mx-3">{{app.name}}</div>
                              </div>
                              <!-- 展开收起 -->
                              <template v-if="app.children.length > 0">
                                <v-icon size="16" v-if="!_.includes(expandApp, catalogIndex + '-' + appIndex)" @click.stop="doUiAction('changeExpandApp', { key: catalogIndex + '-' + appIndex })">mdi-plus</v-icon>
                                <v-icon size="16" v-else @click.stop="doUiAction('changeExpandApp', { key: catalogIndex + '-' + appIndex })">mdi-minus</v-icon>
                              </template>
                            </div>
                            <!-- 子页面 -->
                            <div class="mt-4" v-if="_.includes(expandApp, catalogIndex + '-' + appIndex)">
                              <div v-for="(children, childIndex) in app.children"  key="childIndex" class="jh-font-size-14 grey--text text--darken-2 text-truncate mt-1 d-flex align-center"  @click="doUiAction('jump', children.link)">
                                <v-avatar size="20" v-if="app.icon" tile>
                                  <img
                                    :src="directoryUrl + '/<$ ctx.app.config.appId $>' + app.icon"
                                  >
                                </v-avatar>
                                <v-icon v-else size="16">mdi-open-in-new</v-icon>
                                <span class="ml-2">{{children.name}}</span>
                              </div>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row> 
                  </div>
                </template>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 空数据 -->
        <div v-else class="text-center pt-10">暂无数据~</div>
      `
    }
  ],
  
  includeList: [
    // {% include 'common/constantUtil.html' %}
    { type: 'html', path: 'common/constantUtil.html' },
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      isDirectoryLoading: true,
      directoryList: null,
      activeDirectory: null,
      expandApp: [],

      isWorkWechat: false,
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500',
      directoryUrl: 'window.constantObj.directoryUrl'
    }, // data 表达式
    computed: {
      groupedItems() {
        const jianghuItems = this.directoryList.filter(item => item.name.startsWith('江湖')).map(item => {
          return {
            name: item.name
          }
        });
        const otherItems = this.directoryList.filter(item => !item.name.startsWith('江湖')).map(item => {
          return {
            name: item.name
          }
        });

        return {
          '江湖应用': jianghuItems,
          '其它应用': otherItems
        };
      }
    },
    watch: { },
    async created() { },
    mounted() {
      this.isWorkWechatEnv();
      this.doUiAction('getTableData');
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      async doUiAction(uiActionId,uiActionData){
        switch(uiActionId){
          case 'getTableData':
            await this.getTableData();
            break;
          case 'changeExpandApp':
            await this.changeExpandApp(uiActionData);
            break;
          case 'jump':
            await this.jump(uiActionData);
            break;
          default:
            console.error("[doUiAction] uiActionId not find", { uiActionId });
            break;
        }
      },

      /**
       * 获取表格数据
       */
      async getTableData() {
        this.isDirectoryLoading = true;
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'directory',
              actionId: 'selectItemList',
              orderBy: [{column: 'operationAt', order: 'desc'}]
            }
          }
        });

        const rows = result.data.appData.resultData.rows;
        rows.forEach((catalog, catalogIndex) => {
          catalog.children.forEach((app, appIndex) => {
            if (this.isMobile && (app.name.includes('-移动端') || !app.name.includes('-电脑端'))) {
              this.expandApp.push(`${catalogIndex}-${appIndex}`);
            } else if (!this.isMobile && !app.name.includes('-移动端')) {
              this.expandApp.push(`${catalogIndex}-${appIndex}`);
            }
          })
        })
        this.directoryList = rows;
        this.isDirectoryLoading = false;
      },
      changeExpandApp(funObj){
        const { key } = funObj;
        if (!this.expandApp.includes(key)) {
          this.expandApp.push(key);
        } else {
          this.expandApp = this.expandApp.filter((e) => e !== key);
        }
      },
      jump(url) {
        window.open(url);
      },
      //  判断是否企微环境
      async isWorkWechatEnv() {
        //获取user-agaent标识头
        var ua = window.navigator.userAgent.toLowerCase();
        //判断ua和微信浏览器的标识头是否匹配
        if ((ua.match(/micromessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork')) {
          this.isWorkWechat = true;
        } else {
          this.isWorkWechat = false;
        }
      }
    }
  },
  style: /*css*/`
  .jh-wrapper-card{
    min-height: calc(100vh - 151px);
  }
  .jh-directory-card{
    height: 100%;
    min-height: calc(100vh - 151px); 
    border-right: 1px solid #F4F5F6 !important;
  }
  .jh-app-card{
    box-shadow: 0px 5px 6px 0px rgba(0,0,0,0.05) !important;
  }
  .jh-app-card:hover{
    box-shadow: 0px 12px 20px 0px rgba(0,0,0,0.05) !important;
  }
  .jh-app-icon svg{
    width: 28px;
    height: 28px;
    vertical-align: middle;
  }

  /* 移动端适配 >>>>>>>>>>>>> */
  @media (max-width: 600px){
    .jh-wrapper-card{
      min-height: auto;
    }
    .jh-directory-card{
      min-height: auto;
    }
  }
  /* <<<<<<<<<<<<< 移动端适配 */
  `
  
};

module.exports = content;
