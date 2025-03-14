const content = {
  pageType: "jh-page", pageId: "studentManagement", pageName: "1page_2table_示例1", version: 'v2',
  resourceList: [
    {
      actionId: 'selectItemList',
      resourceType: 'sql',
      resourceData: {
        "table": "student",
        "operation": "select"
      },
      resourceHook: null,
      desc: '✅student查询-查询列表'
    },
    {
      actionId: 'insertItem',
      resourceType: 'sql',
      resourceData: {
        "table": "student",
        "operation": "jhInsert"
      },
      resourceHook: null,
      desc: '✅student查询-添加成员'
    },
    {
      actionId: 'updateItem',
      resourceType: 'sql',
      resourceData: {
        "table": "student",
        "operation": "jhUpdate"
      },
      resourceHook: null,
      desc: '✅student查询-更新成员'
    },
    {
      actionId: 'deleteItem',
      resourceType: 'sql',
      resourceData: {
        "table": "student",
        "operation": "jhDelete"
      },
      resourceHook: null,
      desc: '✅student查询-删除信息'
    },

  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "1page_2table_示例1", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],
  pageContent: [
    {
      tag: 'v-col',
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      value: [
          /*html*/`

          <v-card class="rounded-lg">
          <!--表格 头部 >>>>>>>>>>>>> -->
          <v-row class="ma-0 pb-4">
            <!--新增按钮-->
            <v-btn color="success" class="elevation-0 mr-2" @click="doUiAction('startCreateItem')" small>新增</v-btn>
            <v-spacer></v-spacer>
            <!--搜索过滤-->
            <v-col cols="12" xs="8" sm="4" md="3" xl="2" class="pa-0">
              <v-text-field color="success" v-model="searchInput" prefix="搜索：" class="jh-v-input" dense filled single-line></v-text-field>
            </v-col>
          </v-row>
          <!-- <<<<<<<<<<< 表格头部 -->
          <!-- 数据表格 >>>>>>>>>>>>> -->
          <v-data-table
            :headers="headers"
            :items="tableData"
            :footer-props="{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有'}"
            :items-per-page="20"
            mobile-breakpoint="0"
            :loading="isTableLoading"
            :class="{'zebraLine': isTableZebraLineShown }"
            checkbox-color="success"
            fixed-header
            class="jh-fixed-table-height elevation-0 mt-0 mb-xs-4">
            <!--表格 操作按钮-->
            <template v-slot:item.action="{ item }">
              <!-- pc端 -->
              <template v-if="!isMobile">
                <span role="button" class="success--text font-weight-medium font-size-2 mr-2" @click="doUiAction('startUpdateItem', item)">
                  <v-icon size="16" class="success--text">mdi-note-edit-outline</v-icon>修改
                </span>
                <span role="button" class="red--text text--accent-2 font-weight-medium font-size-2" @click="doUiAction('deleteItem', item)">
                  <v-icon size="16" class="red--text text--accent-2">mdi-trash-can-outline</v-icon>删除
                </span>
              </template>
              <!-- 手机端 -->
              <v-menu offset-y v-if="isMobile">
                <template v-slot:activator="{ on, attrs }">
                  <span role="button" class="success--text font-weight-medium font-size-2"
                    v-bind="attrs" v-on="on">
                    操作<v-icon size="14" class="success--text">mdi-chevron-down</v-icon>
                  </span>
                </template>
                <v-list dense>
                  <v-list-item @click="doUiAction('startUpdateItem', item)">
                    <v-list-item-title>修改</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="doUiAction('deleteItem', item)">
                    <v-list-item-title>删除</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <!--性别-->
            <template v-slot:item.gender="{ item }">
              {{ getDisplayText({displayObj: constantObj.gender, displayValue: item.gender}) }}
            </template>
            <!--年级-->
            <template v-slot:item.level="{ item }">
              {{ getDisplayText({displayObj: constantObj.level, displayValue: item.level}) }}
            </template>
            <!--没有数据-->
            <template v-slot:loading>
              <div class="jh-no-data">数据加载中</div>
            </template>
            <template v-slot:no-data>
              <div class="jh-no-data">暂无数据</div>
            </template>
            <template v-slot:no-results>
              <div class="jh-no-data">暂无数据</div>
            </template>
            <!-- 表格分页 -->
            <template v-slot:footer.page-text="pagination">
              <span>{{ pagination.pageStart }}-{{ pagination.pageStop }}</span>
              <span class="ml-1">共{{ pagination.itemsLength }}条</span>
            </template>
          </v-data-table>
          <!-- <<<<<<<<<<<<< 数据表格 -->
        </v-card>
  
  
        <!-- 新增 -->
        <v-navigation-drawer v-model="isCreateDrawerShown" v-click-outside="drawerClickOutside" fixed temporary right width="80%" class="elevation-24">
          <v-form ref="createForm" lazy-validation>
            <!-- 抽屉标题 -->
            <v-row no-gutters>
              <span class="text-h7 font-weight-bold pa-4">添加信息</span>
            </v-row>
            <v-divider class="jh-divider"></v-divider>
            <!-- 抽屉的主体 >>>>>>>>>>>>> -->
            <v-row class="ma-0 px-4">
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">学生ID</span>
                <v-text-field class="jh-v-input" dense single-line filled label="学生ID" v-model="createItem.studentId" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">班级ID</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="班级ID" v-model="createItem.classId" :items="constantObj.classId" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">学生名字</span>
                <v-text-field class="jh-v-input" dense single-line filled label="学生名字" v-model="createItem.name" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">年级</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="年级" v-model="createItem.level" :items="constantObj.level" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">性别</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="性别" v-model="createItem.gender" :items="constantObj.gender" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">出生日期</span>
                <v-menu class="jh-v-input" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{on, attrs}">
                    <v-text-field v-bind="attrs" v-on="on" v-model="createItem.dateOfBirth" class="jh-v-input" dense single-line filled readonly label="出生日期"></v-text-field>
                  </template>
                  <v-date-picker color="success" elevation="20" v-model="createItem.dateOfBirth"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">身高</span>
                <v-text-field class="jh-v-input" dense single-line filled label="身高" v-model="createItem.bodyHeight"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">学生状态</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="学生状态" v-model="createItem.studentStatus" :items="constantObj.studentStatus" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">备注</span>
                <v-text-field class="jh-v-input" dense single-line filled label="备注" v-model="createItem.remarks"></v-text-field>
              </v-col>
            </v-row>
            <!-- <<<<<<<<<<< 抽屉的主体 -->
            <!-- 抽屉的操作按钮 >>>>>>>>>>>>> -->
            <v-row class="justify-end mx-0 mt-8 px-6">
              <v-btn color="success" @click="doUiAction('createItem')" small>保存</v-btn>
              <v-btn class="ml-2" @click="isCreateDrawerShown = false" small>取消</v-btn>
            </v-row>
            <!-- <<<<<<<<<<< 抽屉的操作按钮 -->
          </v-form>
          <!-- 抽屉的关闭按钮 -->
          <v-btn elevation="0" color="success" fab absolute top left small tile class="drawer-close-float-btn" @click="isCreateDrawerShown = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-navigation-drawer>
  
  
        <v-navigation-drawer v-model="isUpdateDrawerShown" v-click-outside="drawerClickOutside" fixed temporary right width="80%" class="elevation-24">
          <v-form ref="updateForm" lazy-validation>
            <!-- 抽屉标题 -->
            <v-row no-gutters>
              <span class="text-h7 font-weight-bold pa-4">修改信息</span>
            </v-row>
            <v-divider class="jh-divider"></v-divider>
            <!-- 抽屉的主体 >>>>>>>>>>>>> -->
            <v-row class="ma-0 px-4">
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">学生ID</span>
                <v-text-field class="jh-v-input" disabled dense single-line filled label="学生ID" v-model="updateItem.studentId" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">班级ID</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="班级ID" v-model="updateItem.classId" :items="constantObj.classId" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">学生名字</span>
                <v-text-field class="jh-v-input" dense single-line filled label="学生名字" v-model="updateItem.name" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">年级</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="年级" v-model="updateItem.level" :items="constantObj.level" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">性别</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="性别" v-model="updateItem.gender" :items="constantObj.gender" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">出生日期</span>
                <v-menu class="jh-v-input" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{on, attrs}">
                    <v-text-field v-bind="attrs" v-on="on" v-model="updateItem.dateOfBirth" class="jh-v-input" dense single-line filled readonly label="出生日期"></v-text-field>
                  </template>
                  <v-date-picker color="success" elevation="20" v-model="updateItem.dateOfBirth"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">身高</span>
                <v-text-field class="jh-v-input" dense single-line filled label="身高" v-model="updateItem.bodyHeight"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">学生状态</span>
                <v-select class="jh-v-input" dense single-line filled clearable label="学生状态" v-model="updateItem.studentStatus" :items="constantObj.studentStatus" :rules="validationRules.requireRules"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">备注</span>
                <v-text-field class="jh-v-input" dense single-line filled label="备注" v-model="updateItem.remarks"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-4">
              <contacts-of-student :student-id="updateItem.studentId"></contacts-of-student>
            </v-row>
            <!-- <<<<<<<<<<< 抽屉的主体 -->
            <!-- 抽屉的操作按钮 >>>>>>>>>>>>> -->
            <v-row class="justify-end mx-0 mt-8 px-6">
              <v-btn color="success" @click="doUiAction('updateItem')" small>保存</v-btn>
              <v-btn class="ml-2" @click="isUpdateDrawerShown = false" small>取消</v-btn>
            </v-row>
            <!-- <<<<<<<<<<< 抽屉的操作按钮 -->
          </v-form>
          <!-- 抽屉的关闭按钮 -->
          <v-btn elevation="0" color="success" fab absolute top left small tile class="drawer-close-float-btn" @click="isUpdateDrawerShown = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-navigation-drawer>
          `
      ],
    }
  ],
  actionContent: [

  ],
  includeList: [
    "{% include 'component/contactsOfStudent.html' %}",
    "{% include 'common/jianghuJs/fixedTableHeightV4.html' %}",
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: {
    data: {
      isHelpPageDrawerShown: false,
      // 表格相关数据

      validationRules: {
        requireRules: [
          v => !!v || 'This is required',
        ],
      },
      constantObj: {
        gender: [{ "value": "male", "text": "男" }, { "value": "female", "text": "女" }],
        classId: [
          { "value": "2021-01级-01班", "text": "2021-01级-01班" }, { "value": "2021-01级-02班", "text": "2021-01级-02班" },
          { "value": "2021-02级-01班", "text": "2021-02级-01班" }, { "value": "2021-02级-02班", "text": "2021-02级-02班" },
          { "value": "2021-03级-01班", "text": "2021-03级-01班" }, { "value": "2021-03级-02班", "text": "2021-03级-02班" }
        ],
        level: [{ "value": "01", "text": "一年级" }, { "value": "02", "text": "二年级" }, { "value": "03", "text": "三年级" }],
        studentStatus: [{ "value": "正常", "text": "正常" }, { "value": "退学", "text": "退学" }]
      },
      isTableZebraLineShown: true,
      searchInput: null,
      isTableLoading: true,
      tableData: [],
      headers: [
        { text: "ID", value: "id", width: 80 },
        { text: "学生ID", value: "studentId", width: 120 },
        { text: "学生名字", value: "name", width: 120 },
        { text: "性别", value: "gender", width: 60 },
        { text: "出生日期", value: "dateOfBirth", width: 120 },
        { text: "班级ID", value: "classId", width: 60 },
        { text: "年级", value: "level", width: 80 },
        { text: "身高", value: "bodyHeight", width: 60 },
        { text: "学生状态", value: "studentStatus", width: 80 },
        { text: "备注", value: "remarks", width: 120 },
        { text: "操作者", value: "operationByUser", width: 90 },
        { text: "操作时间", value: "operationAt", width: 150 },
        { text: '操作', value: 'action', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed' },
      ],
      // 新增数据
      isCreateDrawerShown: false,
      createItem: {},
      createActionData: {},
      // 编辑数据
      isUpdateDrawerShown: false,
      updateItem: {},
      updateItemId: null,
      updateActionData: {},
      // 删除数据
      deleteItemId: null,
    },
    watch: {},
    async created() {
      await this.doUiAction('getTableData');
    },
    mounted() {
    },
    methods: {
      async doUiAction(uiActionId, uiActionData) {
        switch (uiActionId) {
          case 'getTableData':
            await this.getTableData();
            break;
          case 'startCreateItem':
            await this.prepareCreateItem();
            await this.openCreateItemDrawer();
            break;
          case 'createItem':
            await this.prepareCreateValidate();
            await this.confirmCreateItemDialog();
            await this.prepareDoCreateItem();
            await this.doCreateItem();
            await this.closeCreateDrawer();
            await this.getTableData();
            break;
          case 'startUpdateItem':
            await this.prepareUpdateItem(uiActionData);
            await this.openUpdateDrawer();
            break;
          case 'updateItem':
            await this.prepareUpdateValidate();
            await this.confirmUpdateItemDialog();
            await this.prepareDoUpdateItem();
            await this.doUpdateItem();
            await this.closeUpdateDrawer();
            await this.getTableData();
            break;
          case 'deleteItem':
            await this.prepareDeleteItem(uiActionData);
            await this.confirmDeleteItemDialog();
            await this.doDeleteItem();
            await this.getTableData();
            break;
          default:
            console.error("[doUiAction] uiActionId not find", { uiActionId });
            break;
        }
      },
      /**
       * description: ✅获取表格数据
       */
      async getTableData() {
        this.isTableLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'studentManagement',
              actionId: 'selectItemList',
              actionData: {},
              where: {},
              orderBy: [{ column: 'operationAt', order: 'desc' }]
            }
          }
        })).data.appData.resultData.rows

        rows.forEach(row => {
          row.operationAt = dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss');
        })
        this.tableData = rows;
        this.isTableLoading = false;
      },
      //   --------------- 新增数据 uiAction >>>>>>>>>>  ---------------
      async prepareCreateItem() {
        this.createItem = {};
      },
      async openCreateItemDrawer() {
        this.isCreateDrawerShown = true;
      },
      async prepareCreateValidate() {
        if (await this.$refs.createForm.validate() === false) {
          throw new Error("[prepareCreateValidate] false");
        }
      },
      async confirmCreateItemDialog() {
        if (await window.confirmDialog({ title: "新增", content: "确定新增吗？" }) === false) {
          throw new Error("取消");
        }
      },
      async prepareDoCreateItem() {
        const { id, ...data } = this.createItem;
        this.createActionData = data;
      },
      async doCreateItem() {
        await window.vtoast.loading("新增数据");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'studentManagement',
              actionId: 'insertItem',
              actionData: this.createActionData
            }
          }
        })
        await window.vtoast.success("新增数据成功");
      },
      async closeCreateDrawer() {
        this.createItem = {};
        this.createActionData = null;
        this.isCreateDrawerShown = false;
      },
      //   --------------- <<<<<<<<<<<< 新增数据 uiAction  ---------------
      //   --------------- 编辑数据 uiAction >>>>>>>>>>>>  ---------------
      async prepareUpdateItem(funObj) {
        this.updateItem = _.cloneDeep(funObj);
      },
      async openUpdateDrawer() {
        this.isUpdateDrawerShown = true;
      },
      async prepareUpdateValidate() {
        if (await this.$refs.updateForm.validate() === false) {
          throw new Error("[prepareUpdateValidate] false");
        }
      },
      async confirmUpdateItemDialog() {
        if (await window.confirmDialog({ title: "修改", content: "确定修改吗？" }) === false) {
          throw new Error("取消");
        }
      },
      prepareDoUpdateItem() {
        const { id, userId, ...data } = this.updateItem;
        this.updateItemId = id;
        this.updateActionData = data;
      },
      async doUpdateItem() {
        await window.vtoast.loading("保存中");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'studentManagement',
              actionId: 'updateItem',
              actionData: this.updateActionData,
              where: { id: this.updateItemId }
            }
          }
        });
        await window.vtoast.success("修改成功");
      },
      async closeUpdateDrawer() {
        this.isUpdateDrawerShown = false;
        this.updateItem = {};
        this.updateActionData = null;
        this.updateItemId = null;
      },
      //   --------------- <<<<<<<<<<<< 编辑数据 uiAction  ---------------
      // ---------------删除数据 uiAction >>>>>>>>>>>>> ---------------
      async prepareDeleteItem(funObj) {
        this.deleteItemId = funObj.id;
      },
      async confirmDeleteItemDialog() {
        if (await window.confirmDialog({ title: "删除", content: "确定删除吗？" }) === false) {
          throw new Error("取消");
        }
      },
      async doDeleteItem(funObj) {
        await window.vtoast.loading("删除数据");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'studentManagement',
              actionId: 'deleteItem',
              actionData: {},
              where: { id: this.deleteItemId }
            }
          }
        });
        await window.vtoast.success("删除数据成功");
        this.deleteItemId = null;
      },
      // ---------------<<<<<<<<<<<<< 删除数据 uiAction ---------------

    }
  },
  style: `
  `

};

module.exports = content;
