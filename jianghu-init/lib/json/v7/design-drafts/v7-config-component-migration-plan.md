# V7 配置与组件契约统一改造计划

## 1. 文档状态

- 状态：实施前计划，尚未作为正式 V7 规范发布。
- 适用范围：`jianghu-init json`、V7 semantic compiler、V6 Vue 组件、VSCode 扩展。
- 设计输入：
  - `pages/examples/design-drafts/fullCrudPage.v7.design-draft.js`
  - `design-drafts/v6ComponentProps.design-draft.js`
- 核心目标：新配置只生成 canonical key；旧配置通过统一兼容层继续运行，并输出紧凑 warning。
- 实施原则：先规范化，再校验，再编译；Builder 和 Vue 组件内部不长期并行维护两套业务语义。

## 2. 目标与非目标

### 2.1 本次必须实现

1. 冻结 semantic config 与 runtime component props 的 canonical key。
2. 所有可等价转换的旧 key 在校验前转换，保证旧 V7 配置继续生成 PC/Mobile 页面。
3. 新旧 key 同时存在且值不同时立即报错，禁止静默覆盖。
4. 收集旧 key 使用记录，CLI 每个配置文件集中输出紧凑 warning。
5. 生成器、示例、Schema、Hover、补全和文档只推荐 canonical key。
6. VSCode 对旧 key 显示 Warning 和替换建议，但不能把仍受兼容支持的旧 key 标成结构 Error。
7. PC 与 Mobile 使用同一份规范化结果；双端生成不能重复提示同一 warning。

这里的“旧配置”指使用旧 key 的 V7 init-json，以及手写旧 component props。v1-v6 配置继续走各自现有链路，不在本计划内自动改写为 V7。

### 2.2 本次不改名

以下名称尚未定案，本轮保持现状，避免扩大迁移范围：

- `items`
- `options`
- `tableSelected`
- `beforeCloseCompareFields`
- Vuetify 标准结构中的 `headers`
- `filter.fields`，等搜索与过滤职责再次统一时单独讨论

### 2.3 延后完善但保留在契约中

- `keywordFieldList`
- `keywordHeaders`

这两个 key 继续作为搜索公共 props，但在完成 PC/Mobile 动态选列端到端联调前，生成器不主动输出。

## 3. 最终分层

```text
用户 init-json
  -> semantic aliases / structural migrations
  -> canonical semantic validation
  -> views compiler / expandCrudPage
  -> canonical component node props
  -> runtime prop compatibility
  -> resolved render nodes
  -> NJK / Vue component
```

各层职责：

- Semantic 层只处理 `page/fields/views/platform/includeList` 等业务配置。
- Runtime 层只处理 `Table/FormSheet/Search` 等组件节点 props。
- Vue 组件只消费 canonical props；为手写旧 HTML 保留必要的短期 prop alias。
- Warning 由编译过程收集，由 CLI 或 IDE 展示；底层纯函数不直接 `console.warn`。

## 4. Semantic canonical key

### 4.1 页面与资源

| 旧结构 | Canonical 结构 | 兼容策略 |
| --- | --- | --- |
| `includeList[].target` | `includeList[].targets` | 等价转换并 warning |
| `page.template: string` | `page.template: { pc, mobile }` | 字符串转换为对应生成端；双端时两端复用并 warning |
| `page.helpDoc` | 保持 | `boolean` 控制默认文档；字符串作为自定义 URL |

`page.id` 是帮助文档默认地址的唯一 pageId 来源。业务不应在 `PageTitle/PageHeader.props` 中重复配置 `pageId`。

编译结果：

```js
page.helpDoc === true
// -> { showHelp: true, pageId: page.id }

typeof page.helpDoc === 'string'
// -> { showHelp: true, helpSrc: page.helpDoc, pageId: page.id }
```

`pageId` 只作为编译器注入的内部 prop，用于缺少 `helpSrc` 时拼接 `/{appId}/pageDoc#{pageId}.md`。

### 4.2 fields 字段结构

目标分组：

```js
fields: {
  projectId: {
    label: '项目ID',
    type: 'text',
    cls: 'mb-2',
    column: {},
    search: {},
    form: {},
    createForm: {},
    updateForm: {},
    autoId: {},
  },
}
```

结构迁移：

| 旧 key | Canonical 位置 |
| --- | --- |
| `width/align/class/cellClass` | `column.*` |
| `op` | `search.op` |
| `component/options/required/readonly/rules/placeholder/hint/quickAttrs/attrs` | `form.*` |
| `pc` | `form.pcAttrs` |
| `mobile` | `form.mobileAttrs` |
| `views.create.fieldAttrs[field]` | `fields[field].createForm` |
| `views.update.fieldAttrs[field]` | `fields[field].updateForm` |

优先级：

```text
字段根级通用信息
  < fields[field].form
  < fields[field].createForm / updateForm
  < view 内显式动态 interaction
```

迁移要求：

- 旧结构只在规范化层读取。
- 新旧位置同值时保留 canonical，并 warning。
- 新旧位置值冲突时报告完整路径并终止编译。
- `form.type` 可覆盖字段根级 `type`。
- `labelRequired` 只控制标签必填标识；未配置时跟随 `required`。

### 4.3 views.list

| 旧 key | Canonical key | 说明 |
| --- | --- | --- |
| `columns` | `columnList` | PC 列定义 |
| `mobileColumns` | `mobileColumnList` | 缺省回退 `columnList` |
| `toolbarActions` | `headActionList` | 集合头部动作 |
| `rowActions` | `rowActionList` | 行动作 |
| `search.fields` | `search.fieldList` | 服务端搜索字段 |
| `mobileSearchBtnText` | `search.mobileBtnText` | 移动端触发按钮文案 |
| `mobileSearchIcon` | `search.mobileBtnIcon` | 移动端触发按钮图标 |
| `mobileSearchTitle` | `search.mobileSheet.title` | 搜索 Sheet 标题 |
| `searchSheet` | `search.mobileSheet` | 移动端 Sheet 配置 |
| `mobileSearchKey` | 内部稳定 key | 旧值暂时保留行为并 warning，新配置不再暴露 |

保持不变：

- `search.keyword`
- `filter`
- `orderBy`
- `serverPagination`
- `pageSize`
- `selectable`
- `mobileItemAction`
- `dataTableProps`

搜索目标结构：

```js
search: {
  keyword: { fields: [], placeholder: '' },
  fieldList: [],
  btnText: '查询',
  btnIcon: 'search',
  mobileBtnText: '筛选',
  mobileBtnIcon: 'filter-2',
  mobileSheet: {},
}
```

### 4.4 views.create

| 旧 key | Canonical key | 兼容策略 |
| --- | --- | --- |
| `fields` | `fieldList` | 转换并 warning |
| `actions` | `actionList` | 转换并 warning |
| `saveTipBeforeClose` | `beforeCloseConfirm` | 转换并 warning |
| `sheet` | `mobileSheet` | 转换并 warning |
| `fieldAttrs` | `fields.*.createForm` | 结构迁移并 warning |
| `type: 'form'` | 删除 | 接受并 warning；值不是 `form` 时错误 |

### 4.5 views.update 与 tab

| 旧 key | Canonical key | 兼容策略 |
| --- | --- | --- |
| `tabs` | `tabList` | 转换并 warning |
| `fields` | `fieldList` | 转换并 warning |
| `actions` | `actionList` | 转换并 warning |
| `sheet` | `mobileSheet` | 转换并 warning |
| `fieldAttrs` | `fields.*.updateForm` | 结构迁移并 warning |
| `tabs[].fields` | `tabList[].fieldList` | 转换并 warning |
| `tabs[].actions` | `tabList[].actionList` | 转换并 warning |
| `tabs[].type: 'form'` | 删除 | 接受并 warning；其他值错误 |

## 5. Runtime component canonical props

### 5.1 集合组件

`jh-table` 与 `jh-list`：

| 旧 prop | Canonical prop |
| --- | --- |
| `toolbarActionList` | `headActionList` |

保持：`headers`、`rowActionList`、`filterList`、`items`、`loading`、`options`、`tableSelected`。

### 5.2 表单与叠层

| 旧 prop | Canonical prop |
| --- | --- |
| `jh-form.fields` | `fieldList` |
| `formContainer.fields` | `fieldList` |
| `FormSheet.headActionList` | `actionList` |
| `Sheet.shown` | `value` |
| `SearchSheet.shown` | `value` |

Drawer、Sheet 对外统一 `value + input`。旧 `shown + update:shown` 在兼容期继续可用，canonical 值优先。

Sheet 高度 canonical props：

```js
maxBodyHeight: null,
bodyHeightMode: 'content', // content | fill
```

旧高度 props 的处理：

| 旧 prop | 处理 |
| --- | --- |
| `autoHeight` | 转换为 `bodyHeightMode`，warning |
| `viewportOffset` | 转换为计算后的 `maxBodyHeight`，warning |
| `bodyHeight` | 转换为 `maxBodyHeight + bodyHeightMode:'fill'`，warning |
| `minCardHeight` | 兼容期继续透传并 warning，不再生成 |
| `hiddenBtn` | 兼容期继续执行并 warning，后续另定动作区替代方案 |
| `rounded` | 兼容期继续执行并 warning，新组件使用固定视觉规范 |

`stackZIndex/attach/lazy` 作为组件内部参数，不进入业务 Schema 和生成器。`cardClass/bodyClass/actionsClass` 只保留为高级样式入口，不默认生成。

### 5.3 搜索组件

`jh-search`、`jh-page-header`、`jh-mobile-search-sheet` 公共目标：

```js
const searchProps = {
  fieldList: [],
  keyword: '',
  keywordConfig: { fields: [], placeholder: '' },
  keywordFieldList: [],
  keywordHeaders: [],
  showBtn: true,
  btnText: '查询',
  btnIcon: 'search',
};
```

兼容映射：

| 旧 prop | Canonical prop |
| --- | --- |
| `fields` | `fieldList` |
| `searchFieldList` | `fieldList` |
| `keyword` 为对象 | `keywordConfig` |
| `keywordMeta` | `keywordConfig` |
| `searchBtn` | `showBtn` |
| `showSearchBtn` | `showBtn` |
| `searchBtnText` | `btnText` |
| `searchBtnIcon` | `btnIcon` |

`keyword` canonical 类型固定为字符串。对象型旧 `keyword` 必须在规范化时迁移，不能进入组件。

### 5.4 标题、过滤、按钮与布局

| 旧 prop | Canonical prop |
| --- | --- |
| `PageTitle.helpDoc` | `showHelp` |
| `PageHeader.helpBtn` | `showHelp` |
| `TableFilter.fields` | `filterList` |
| `TextBtn.text` | `label` |
| `TextBtn.iconName` | `icon` |
| `TextBtn.iconRight` | `iconPosition` |
| `Grid.colsSm/colsMd` | `cols: { sm, md }` |

删除但兼容期继续接受：

- `TextBtn.alignSub`
- `VStack/HStack.flexFromCls`
- `Box.extraStyle`

旧值能等价迁移到 `attrs.class` 或 `attrs.style` 时自动迁移并 warning；不能等价迁移时保持旧行为至兼容期结束。

## 6. Alias 与 warning 基础设施

### 6.1 单一迁移清单

新增机器可读的迁移清单，记录：

```js
{
  scope: 'semantic' | 'runtime',
  path: 'views.list',
  from: 'columns',
  to: 'columnList',
  kind: 'rename' | 'move' | 'legacy-only',
  since: 'v7-next',
}
```

建议文件：

- `lib/json/v7/migration/keyMigrations.js`：CLI/编译器唯一来源。
- `vscode-extension/src/generated/v7-key-migrations.json`：构建脚本生成的扩展副本。
- `scripts/sync-v7-migration-artifacts.js`：同步并检查生成物。

禁止在 `semanticKeyAliases.js`、Hover、Schema validator 中分别手写不同映射而不做一致性测试。

### 6.2 诊断对象

```js
{
  level: 'warning',
  code: 'V7_DEPRECATED_KEY',
  path: 'views.list.columns',
  replacement: 'views.list.columnList',
  count: 1,
}
```

规则：

1. `normalizeSchema(input, diagnostics)` 收集 semantic 迁移。
2. `resolveNode(..., diagnostics)` 收集 runtime prop 迁移。
3. `buildPage()` 返回 `{ standardConfig, legacyConfig, diagnostics }`。
4. PC/Mobile 双端构建共用一次 semantic 规范化诊断，或在汇总时按 `code+path+replacement` 去重。
5. 纯函数不输出日志，`handle_json_config_v7.js` 将诊断挂到 `jsonConfig.v7Diagnostics`。
6. CLI 在当前配置文件处理结束时集中输出一次。

### 6.3 CLI warning 格式

默认单行：

```text
⚠ V7旧key(3): views.list.columns→columnList; search.fields→fieldList; create.actions→actionList
```

重复路径压缩：

```text
⚠ V7旧key(5): tab.fields→fieldList ×3; tab.actions→actionList ×2
```

输出约束：

- 不使用大边框。
- 同一文件只输出一组。
- 同一映射只输出一次，重复项使用 `×N`。
- 超过终端宽度时最多分为两行，第二行使用两个空格缩进。
- 只使用 canonical 相对路径，不输出长绝对路径。
- 新配置无 warning。

### 6.4 冲突规则

| 输入 | 结果 |
| --- | --- |
| 只有旧 key | 转换、运行、warning |
| 只有新 key | 直接运行、无 warning |
| 新旧 key 同值 | 保留新 key、删除旧 key、warning |
| 新旧 key 不同值 | Error，列出两个完整路径 |
| 旧 key 无法等价转换 | 兼容期保持旧行为、warning，不得静默丢弃 |

## 7. 编译器实施步骤

### 阶段 A：诊断通道

1. 新增 `migration/keyMigrations.js` 与诊断去重工具。
2. 扩展 `normalizeViewKeys()`，在转换时记录路径和替代 key。
3. 扩展 `normalizeSchema()`，支持字段分组、移动和删除型迁移。
4. 保持 `normalizeSchema(input)` 原调用方式可用；diagnostics 参数可选。
5. `buildPage()` 返回 diagnostics，不改变现有 `standardConfig/legacyConfig` 字段。
6. `handle_json_config_v7.js` 汇总双端结果并交给 CLI warning 输出。

### 阶段 B：Semantic canonicalization

1. 更新 `semanticKeyAliases.js` 的 list/create/update/tab 映射。
2. 增加 fields 结构迁移器，单独处理 `column/search/form/createForm/updateForm`。
3. 增加 `includeList.target -> targets` 和 `page.template` 迁移。
4. 增加 search 移动端平铺 key 到嵌套结构的迁移。
5. 规范化完成后再执行 `validateCrudSemantic()` 与 action 校验。
6. `compileListView/compileCreateView/compileUpdateView` 只读 canonical key。

### 阶段 C：Builder 与 runtime descriptor

1. 更新 `compile*View` 输出的 IR key。
2. 更新 `expandCrudPage.js`，删除长期 defensive fallback，只保留边界断言。
3. 更新 `builders.js`，输出 canonical component props。
4. 更新 `componentDescriptors.js` 的 `compat/propRenames/bindings`。
5. `descriptorRuleApplicators.js` 接入 diagnostics 和冲突检测。
6. 修复 `page.helpDoc/page.id -> showHelp/helpSrc/pageId` 映射。
7. 确认 `keywordFieldList/keywordHeaders` 的绑定仍保留，但生成器默认不输出。

### 阶段 D：Vue 组件

逐个修改并回归以下文件：

- `jhTableV6.html`
- `jhListV6.html`
- `jhFormV6.html`
- `jhDrawerV6.html`
- `jhSheetV6.html`
- `jhSearchV6.html`
- `jhMobileSearchSheetV6.html`
- `jhPageTitleV6.html`
- `jhPageHeaderV6.html`
- `jhTextBtnV6.html`
- `jhLayoutV6.html`

实施要求：

1. 模板和 computed 只使用 canonical prop。
2. 为手写旧 HTML 保留 legacy prop，并通过 computed 统一取值。
3. canonical prop 显式配置时优先于 legacy prop。
4. 兼容逻辑集中在组件顶部的 resolved computed，不散落到模板条件中。
5. 组件不在浏览器控制台重复输出 warning；配置文件 warning 由 CLI/IDE 负责。

## 8. Schema 改动

### 8.1 V7 semantic Schema

修改：`vscode-extension/src/schemas/v7/jianghu-config-v7.schema.json`

1. properties 和 required 使用 canonical key。
2. 旧 key 仍声明为可接受属性，并添加：

```json
{
  "deprecated": true,
  "x-jianghu-replacement": "fieldList"
}
```

3. 旧 key 不触发 `additionalProperties` Error。
4. 自定义 validator 将 deprecated metadata 转为 Warning。
5. action 项继续要求 `label + uiAction`；旧 `intent/id/actionId` 的兼容不降低 canonical 校验要求。
6. 补齐 fields 分组、list/create/update 新结构和 `mobileSheet`。
7. `page.helpDoc` 支持 boolean 或 string，并写清两种语义。

### 8.2 Component tree Schema

修改：`vscode-extension/src/schemas/components/v6-page-tree.schema.json`

1. canonical props 使用新名称。
2. legacy props 标记 deprecated，不直接报结构错误。
3. 对齐 runtime descriptors 可选择的组件枚举。
4. 补齐当前 descriptor 已有但 pageNode enum 缺失的组件：
   - `PageTitle`
   - `Search`
   - `List`
   - `MobileFilterBtn`
   - `MobileActions`
   - `VSpacer`
5. `Form`、`TextBtn` 是否作为直接 Schema 节点开放，在正式实施前做一次最终确认；未确认前不加入 enum。

## 9. VSCode 扩展改动

### 9.1 Hover 文档

修改：`vscode-extension/src/v7ConfigHoverProvider.ts`

1. `V7_PATH_DOCS` 只把 canonical key 列入“支持的子属性”。
2. 为旧 key 保留独立 Hover，但明确显示：

```text
已废弃，仍兼容：fields → fieldList
```

3. 扩展 `DocEntry`：

```ts
interface DocEntry {
  description: string;
  type?: string;
  example?: string;
  deprecated?: boolean;
  replacement?: string;
}
```

4. Hover 渲染顺序：名称和类型、deprecated 提示、简短职责、示例、canonical 子属性。
5. 更新 `V7_LIST_CONTEXT/V7_LIST_ALIASES/V7_COMPONENT_ALIASES`，识别 `columnList/mobileColumnList/fieldList/tabList/actionList`。
6. 修正 `page.helpDoc` Hover：boolean 使用默认 pageDoc，string 使用自定义 URL。
7. 修正 PageTitle/PageHeader Hover：`showHelp/helpSrc` 为公开 prop，`pageId` 标明“编译器根据 page.id 注入”。
8. 搜索 Hover 使用 `fieldList/showBtn/btnText/btnIcon`；保留并标明 `keywordFieldList/keywordHeaders` 为后续完善能力。
9. Sheet Hover 只推荐 `maxBodyHeight/bodyHeightMode`；旧高度 key 显示迁移说明。

### 9.2 补全

1. canonical key 才进入默认补全列表。
2. deprecated key 不主动补全。
3. 现有 `blocks.*` 补全保持。
4. 分阶段扩展对象 key 补全：`views.list/search/create/update`、`fields.*.form`、component props。
5. 补全说明复用 Hover 文档对象，避免两套文案。

### 9.3 IDE Warning 与快速修复

修改：`vscode-extension/src/validators/jianghuSchemaValidator.ts`

1. AJV 先做结构 Error 校验。
2. AST 再扫描旧 key，生成 `DiagnosticSeverity.Warning`。
3. warning 文案保持单行：`旧 key：fields，请改用 fieldList`。
4. warning 精确标在属性 key，不标红整个父对象。
5. 新旧 key 冲突使用 Error。
6. 增加 CodeAction：简单 rename 可一键替换；跨层 move 暂只提示，不自动改写。
7. 快速修复不能覆盖已有 canonical key。

### 9.4 扩展构建与发布

1. 执行迁移清单同步脚本。
2. `npm run compile`。
3. `npm run lint`。
4. 运行 Hover/validator 单元测试。
5. 使用 Extension Host 打开新旧两个 V7 fixture 做人工检查。
6. 升级扩展版本。
7. 生成新 `.vsix`，`prebuilt` 只保留最新版本。
8. 安装本地 `.vsix` 再做一次真实 Hover、Warning、补全验证。

## 10. 生成器、示例、文档与 AI rules

### 10.1 生成器

修改 `generateInitJsonContent.js` 及 table 生成入口：

- 只生成 canonical semantic key。
- 不生成 deprecated key。
- 暂不生成 `keywordFieldList/keywordHeaders`。
- `page.helpDoc` 默认省略。
- Sheet 高度只生成新模型。

### 10.2 示例与正式文档

按顺序更新：

1. `fullCrudPage.v7.example.js`
2. 其他 `pages/examples/*.js`
3. `docs/config-reference.md`
4. `docs/authoring-guide.md`
5. `docs/semantic-to-component-mapping.md`
6. `docs/bind-slots-and-targets.md`
7. `pages/examples/README.md`

设计草案在正式示例和测试全部通过后标记“已实施”，但暂不删除，保留决策记录。

### 10.3 Dev Rules / Skill

更新 init-json authoring、migration、review Skill：

- Authoring 只展示 canonical key。
- Migration 明确旧 key 会兼容运行并产生 warning。
- Review 检查 deprecated key、warning、source/generated 一致性。
- Skill 不重复保存完整映射表，引用正式 config reference，减少 token 和规则漂移。

## 11. 测试计划

### 11.1 Semantic alias 单元测试

每个映射至少覆盖：

1. 仅旧 key。
2. 仅新 key。
3. 新旧同值。
4. 新旧冲突。
5. 输入对象不被原地修改。
6. warning 路径与 replacement 正确。

### 11.2 等价输出测试

为同一页面准备 old/canonical 两份配置，分别编译 PC 与 Mobile：

```text
old semantic -> normalize -> standardConfig
new semantic -> normalize -> standardConfig
```

除 diagnostics 外，两个 `standardConfig` 必须深度相等。

覆盖：

- 标准 CRUD
- create/update 单表单
- update tabList
- PC Table + Mobile List
- Search + SearchSheet
- FormDrawer + FormSheet
- 自定义 page template/include targets
- page helpDoc

### 11.3 Runtime props 测试

- 旧 props 与 canonical props 渲染结果一致。
- canonical 优先级正确。
- Drawer/Sheet 的 value/input 和旧 shown/update:shown 均可开关。
- FormSheet actionList 位于标题栏。
- Sheet `content/fill` 高度模式符合预期。
- Table/List 分页与 action 行为无回归。

### 11.4 Warning 测试

- 新配置 0 warning。
- 旧配置正常生成且 warning 数量正确。
- 双端构建 warning 不重复。
- 重复 tab alias 使用 `×N` 压缩。
- warning 不包含绝对路径和大边框。
- 冲突必须是 Error，不允许降级为 warning。

### 11.5 VSCode 扩展测试

- Schema 接受 canonical key。
- Schema 接受受支持的旧 key。
- 旧 key 产生 Warning，不产生 `additionalProperties` Error。
- Hover canonical 文案和子属性正确。
- Hover 旧 key 显示 replacement。
- 默认补全不出现旧 key。
- 简单 rename CodeAction 修改正确。
- TypeScript compile 与 ESLint 通过。

### 11.6 真实生成验收

至少选择一个真实 JianghuJS 应用执行：

1. 用旧 V7 配置生成，确认 warning 紧凑且页面可运行。
2. 用 canonical 配置生成，确认无 warning。
3. 对比生成 HTML、`_page`、`_resource` 和页面交互。
4. 检查 PC/Mobile 列表、搜索、新增、编辑、删除。
5. 安装新 VSIX，在同一配置上验证 Hover 和 IDE Warning。

## 12. 实施批次与提交边界

建议拆为六个可独立回归的批次：

1. **迁移清单与 diagnostics**：只建立基础设施，不改 canonical 输出。
2. **Semantic key 迁移**：aliases、fields 分组、views compiler、warning。
3. **Runtime props 迁移**：descriptors、schemaPipeline、Vue 组件兼容。
4. **Schema 与 VSCode**：AJV、Hover、补全、Warning、CodeAction。
5. **生成器与文档**：新生成内容、示例、正式规范、Skill。
6. **真实项目验证与发布**：CLI 包、VSIX、旧项目回归。

每个批次完成后都必须保证：

- canonical 配置可生成。
- 旧配置仍可生成。
- 新旧冲突可识别。
- 不提前删除兼容逻辑。

## 13. 发布与兼容周期

1. 第一版：新 key 成为 canonical，旧 key 兼容并 warning。
2. 至少经过一个完整发布周期和真实项目验证后，再评估移除 legacy props。
3. 移除前统计实际 warning 使用情况，不按时间机械删除。
4. 本次不自动批量改写业务仓库；业务配置在实际维护时逐步消除 warning。
5. CLI 与 VSCode 扩展应同期发布，避免命令可运行但 IDE 报错，或 IDE 推荐新 key但 CLI 不识别。

## 14. 完成标准

满足以下条件才可标记完成：

- 两份设计草案中的已确认 key 全部落地。
- 旧配置与 canonical 配置生成结果等价。
- CLI warning 紧凑、去重、可定位。
- 所有正式示例只使用 canonical key。
- Schema、Hover、补全、诊断与 CLI 映射一致。
- VSCode 新旧 fixture 验证通过。
- 真实项目 PC/Mobile 页面运行通过。
- 文档和 Skill 已更新。
- 未决 key 仍保持原名，没有被顺手改动。

## 15. 风险与回退

- 风险：结构迁移覆盖已有 canonical 值。措施：冲突立即报错，不自动 merge 不同值。
- 风险：PC/Mobile 双编译重复 warning。措施：文件级 diagnostics 去重后再打印。
- 风险：Schema 与 CLI 支持范围不一致。措施：迁移清单生成扩展 artifact，并增加一致性测试。
- 风险：Vue 手写旧 props 失效。措施：组件兼容 computed 保留一个发布周期。
- 风险：高度模型改变视觉表现。措施：为旧高度 props 建立等价快照和实际 viewport 测试。
- 风险：Hover 上下文识别错误。措施：为 semantic path 和 component props 分别建立 fixture。

出现回归时优先回退 canonical 输出开关，保留 alias 与 diagnostics 基础设施；禁止通过删除旧配置或静默忽略旧 key 解决。
