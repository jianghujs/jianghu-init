'use strict';

const { getPageContentRoot } = require('./compiler/semantic/pageContentShape');

/**
 * V7 platform 策略：端判定 + token 映射 + 策略合并 + adapt
 *
 * 语义 → 组件「选型」层（不填 fieldList/headers 等业务参数，那在 expandCrudPage）。
 * 映射表：docs/semantic-to-component-mapping.md §1；常量：semantic-mapping.js PLATFORM_COMPONENT
 *
 * platform.pc ≡ platform.pc；platform.mobile 独立。
 *
 * | 配置 | 语义块 | → Schema 组件 |
 * | platform.pc.list: 'Table' | views.list | Table |
 * | platform.mobile.list: 'List' | views.list | List |
 * | platform.pc.create: 'CreateDrawer' | views.create | CreateDrawer |
 * | platform.mobile.create: 'CreateSheet' | views.create | FormSheet |
 * | platform.*.update: 'UpdateDrawer'/'UpdateSheet' | views.update | UpdateDrawer/FormSheet |
 */

// ─── 端判定 ────────────────────────────────────────────────────────────────────

const platformKeyForTarget = target => (target === 'mobile' ? 'mobile' : 'pc');

/** 读取 platform 分端配置：支持 platform.pc 与 platform.pc（同义） */
const resolvePlatformSlice = (semantic, target) => {
  const plat = semantic.platform && typeof semantic.platform === 'object' ? semantic.platform : null;
  if (!plat) return null;
  if (target === 'mobile') return plat.mobile && typeof plat.mobile === 'object' ? plat.mobile : null;
  return (plat.pc && typeof plat.pc === 'object' ? plat.pc : null)
    || (plat.pc && typeof plat.pc === 'object' ? plat.pc : null);
};

/**
 * platform 字符串 token → expandCrudPage 使用的 Schema 组件名
 * （与 TOKEN_MAP 中 layout 副作用配套，见 expandPlatformToken）
 */
const LIST_COMPONENT_TOKEN = {
  Table: 'Table',
  List: 'List',
};

const FORM_COMPONENT_TOKEN = {
  CreateDrawer: 'CreateDrawer',
  UpdateDrawer: 'UpdateDrawer',
  CreateSheet: 'FormSheet',
  UpdateSheet: 'FormSheet',
};

const resolveViewListComponent = (listToken, listLayout) => {
  if (typeof listToken === 'string' && LIST_COMPONENT_TOKEN[listToken]) {
    return LIST_COMPONENT_TOKEN[listToken];
  }
  return listLayout === 'card' ? 'List' : 'Table';
};

const resolveViewFormComponent = (formToken, policyLayout, role) => {
  if (typeof formToken === 'string' && FORM_COMPONENT_TOKEN[formToken]) {
    return FORM_COMPONENT_TOKEN[formToken];
  }
  if (policyLayout === 'sheet') return 'FormSheet';
  return role === 'create' ? 'CreateDrawer' : 'UpdateDrawer';
};

const resolveTargetPlatform = semantic => {
  const tp = semantic.targetPlatform;
  if (tp === 'mobile' || tp === 'pc') return tp;
  const pageType = semantic.pageType || 'jh-page';
  return pageType === 'jh-mobile-page' ? 'mobile' : 'pc';
};

const resolvePageType = (semantic, target) => {
  if (semantic.pageType === 'jh-component') return 'jh-component';
  if (semantic.pageType) return semantic.pageType;
  return target === 'mobile' ? 'jh-mobile-page' : 'jh-page';
};

// ─── token 映射 ────────────────────────────────────────────────────────────────

const TOKEN_MAP = {
  'Table':        { layout: 'table', filter: 'inline' },
  'List':         { layout: 'card',  filter: 'sheet'  },
  'Drawer':       { layout: 'drawer' },
  'Sheet':        { layout: 'sheet'  },
  'CreateDrawer': { layout: 'drawer' },
  'UpdateDrawer': { layout: 'drawer' },
  'CreateSheet':  { layout: 'sheet'  },
  'UpdateSheet':  { layout: 'sheet'  },
};

const expandPlatformToken = val => {
  if (val && typeof val === 'object') return val;
  if (typeof val === 'string' && TOKEN_MAP[val]) return { ...TOKEN_MAP[val] };
  return {};
};

// ─── 策略合并 ──────────────────────────────────────────────────────────────────

/** 未写 platform 时的组件 token（与常见 CRUD 页一致） */
const DEFAULT_PLATFORM_TOKENS = {
  pc: {
    list: 'Table',
    create: 'CreateDrawer',
    update: 'UpdateDrawer',
  },
  mobile: {
    list: 'List',
    create: 'CreateSheet',
    update: 'UpdateSheet',
  },
};

const DEFAULT_POLICY = {
  pc: {
    list: { layout: 'table', filter: 'inline' },
    create: { layout: 'drawer' },
    update: { layout: 'drawer' },
  },
  mobile: {
    list: { layout: 'card', filter: 'sheet' },
    create: { layout: 'sheet' },
    update: { layout: 'sheet' },
  },
};

/**
 * 解析当前端的 list/create/update 组件 token（用户 platform 覆盖默认）
 */
const resolvePlatformComponentTokens = (semantic, target) => {
  const pk = platformKeyForTarget(target);
  const defs = DEFAULT_PLATFORM_TOKENS[pk] || DEFAULT_PLATFORM_TOKENS.pc;
  const slice = resolvePlatformSlice(semantic, target) || {};
  const pick = (key, fallback) => (typeof slice[key] === 'string' && slice[key].trim() ? slice[key].trim() : fallback);
  return {
    list: pick('list', defs.list),
    create: pick('create', defs.create),
    update: pick('update', defs.update),
  };
};

const deepMerge = (base, override) => {
  if (!override || typeof override !== 'object') return { ...base };
  const out = { ...base };
  for (const k of Object.keys(override)) {
    const v = override[k];
    const b = base[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b)) {
      out[k] = deepMerge(b, v);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
};

const resolveListLayoutFilter = (semantic, target, listView) => {
  const pk = platformKeyForTarget(target);
  const def = DEFAULT_POLICY[pk].list;
  const platSlice = resolvePlatformSlice(semantic, target);
  const rawUserList = platSlice ? platSlice.list : null;

  const tokenExpanded = expandPlatformToken(rawUserList);
  const userList =
    rawUserList && typeof rawUserList === 'object'
      ? deepMerge(tokenExpanded, rawUserList)
      : (Object.keys(tokenExpanded).length ? tokenExpanded : null);

  const layout = userList && userList.layout != null && userList.layout !== ''
    ? userList.layout
    : (listView.layout && listView.layout.type) || def.layout;
  // views.list.filter 为对象时表示「表格二次筛选」配置；为字符串时才是 inline|sheet 布局模式
  const viewFilterMode =
    typeof listView.filter === 'string' ? listView.filter
    : (typeof listView.filterMode === 'string' ? listView.filterMode : null);
  const filter = userList && userList.filter != null && userList.filter !== ''
    ? userList.filter
    : viewFilterMode || def.filter;

  return { layout, filter };
};

const getEffectivePlatformPolicy = (semantic, target) => {
  const pk = platformKeyForTarget(target);
  const base = DEFAULT_POLICY[pk] || DEFAULT_POLICY.pc;
  const rawUserSlice = resolvePlatformSlice(semantic, target);

  let userSlice = null;
  if (rawUserSlice && typeof rawUserSlice === 'object') {
    userSlice = {};
    for (const viewKey of Object.keys(rawUserSlice)) {
      const val = rawUserSlice[viewKey];
      userSlice[viewKey] = typeof val === 'string' ? expandPlatformToken(val) : val;
    }
  }
  return deepMerge(base, userSlice || {});
};

// ─── adapt（端差异化）──────────────────────────────────────────────────────────

const adaptCrudPagePc = payload => {
  if (!payload.pageType) payload.pageType = 'jh-page';
  const rootVStack = getPageContentRoot(payload.pageContent);
  if (rootVStack && rootVStack.component === 'VStack') {
    rootVStack.props = Object.assign({}, rootVStack.props, { gap: 0 });
    const hasMenu = payload.page.hasOwnProperty('menu') ? payload.page.menu : true;
    const fixedHeight = hasMenu ? 'h-[calc(100vh-52px)]' : 'h-screen';
    mergeNodeClass(rootVStack, `px-[12px] md:px-8 flex flex-col min-h-0 overflow-hidden ${fixedHeight}`);
  }
  return payload;
};

const mergeNodeClass = (node, extra) => {
  if (!node || !extra) return;
  node.attrs = Object.assign({}, node.attrs || {});
  const prev = node.attrs.class ? String(node.attrs.class) : '';
  const tokens = prev.split(/\s+/).filter(Boolean);
  extra.split(/\s+/).filter(Boolean).forEach(t => {
    if (!tokens.includes(t)) tokens.push(t);
  });
  node.attrs.class = tokens.join(' ');
};

const nodeClassStr = node => {
  if (!node) return '';
  const bag = node.resolvedAttrs || node.attrs || {};
  return bag.class ? String(bag.class) : '';
};

const hasFlexNoneOrShrink = node => /\b(flex-none|flex-shrink-0)\b/.test(nodeClassStr(node));

const containsListDescendant = node => {
  if (!node || typeof node !== 'object') return false;
  if (node.component === 'List') return true;
  return (node.children || []).some(containsListDescendant);
};

/** pageContent 树内是否含 List / Table（需 flex 高度链时才加 h-full） */
const containsCollectionComponent = node => {
  if (!node || typeof node !== 'object') return false;
  if (node.component === 'List' || node.component === 'Table') return true;
  return (node.children || []).some(containsCollectionComponent);
};

/** pageContent flex 高度链：根 VStack 占满 + List/Table 区 flex-1 滚动 */
const applyPageContentFlexLayout = (payload, { rootHeightClass = 'h-full' } = {}) => {
  const root = getPageContentRoot(payload.pageContent);
  if (!root || root.component !== 'VStack') return;

  mergeNodeClass(root, `flex flex-col min-h-0 overflow-hidden ${rootHeightClass}`);

  const walk = nodes => {
    for (const node of nodes || []) {
      if (!node || typeof node !== 'object') continue;
      if (node.component === 'List') {
        mergeNodeClass(node, 'flex-1 min-h-0 flex flex-col');
      } else if (node.component === 'Table') {
        mergeNodeClass(node, 'flex-1 min-h-0 min-w-0');
      } else if (node.component === 'HStack' && node !== root) {
        // 顶栏 composeToolbar / pageHeader 已有 flex-none：仅 flex-shrink-0，禁止 flex-1
        if (hasFlexNoneOrShrink(node) || !containsListDescendant(node)) {
          mergeNodeClass(node, 'flex-shrink-0 flex flex-row min-w-0');
        } else {
          // 树表等：HStack 行容器包住 List，需占满剩余高度
          mergeNodeClass(node, 'flex-1 min-h-0 flex flex-row min-w-0');
        }
      } else if (node.component === 'Box') {
        mergeNodeClass(node, 'flex-shrink-0');
      } else if (node.component !== 'VStack') {
        mergeNodeClass(node, 'flex-shrink-0');
      }
      if (Array.isArray(node.children)) walk(node.children);
    }
  };
  if (Array.isArray(root.children)) walk(root.children);
};

/** 移动端 pageContent：VStack 满屏高 + List 区 flex-1 滚动（顶栏 HStack 不抢 flex-1） */
const applyMobilePageFlexLayout = payload => {
  const hasMenu = Object.prototype.hasOwnProperty.call(payload.page || {}, 'menu')
    ? payload.page.menu
    : true;
  const hClass = hasMenu ? 'h-[calc(100dvh-52px)]' : 'h-[100dvh]';
  applyPageContentFlexLayout(payload, { rootHeightClass: hClass });
};

const adaptCrudPageMobile = payload => {
  if (payload.pageType === 'jh-component') return adaptCrudComponent(payload);
  if (!payload.pageType || payload.pageType === 'jh-page') payload.pageType = 'jh-mobile-page';
  if (payload.page && !payload.page.template) {
    payload.page = Object.assign({}, payload.page, { template: 'jhMobileTemplateV6' });
  }
  applyMobilePageFlexLayout(payload);
  return payload;
};

/** jh-component：无菜单壳；仅含 List/Table 时根 VStack h-full + flex-1 滚动（UI 子组件勿撑满占位） */
const adaptCrudComponent = payload => {
  if (!payload.pageType) payload.pageType = 'jh-component';
  if (payload.page) {
    payload.page = Object.assign({}, payload.page, { menu: false });
  }
  const root = getPageContentRoot(payload.pageContent);
  if (root && containsCollectionComponent(root)) {
    applyPageContentFlexLayout(payload, { rootHeightClass: 'h-full' });
  }
  return payload;
};

module.exports = {
  resolveTargetPlatform,
  resolvePageType,
  getEffectivePlatformPolicy,
  resolveListLayoutFilter,
  resolvePlatformSlice,
  resolvePlatformComponentTokens,
  resolveViewListComponent,
  resolveViewFormComponent,
  adaptCrudPagePc,
  adaptCrudPageMobile,
  adaptCrudComponent,
  TOKEN_MAP,
  expandPlatformToken,
  DEFAULT_POLICY,
  DEFAULT_PLATFORM_TOKENS,
  platformKeyForTarget,
  LIST_COMPONENT_TOKEN,
  FORM_COMPONENT_TOKEN,
};
