'use strict';

/**
 * V7 authoring 默认值（layout / platform token）
 * 手写 semantic 可省略 layout、platform；expand 前由 normalizeSchema 合并 layout。
 */

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

/** 列表 / 表单布局默认（仅覆盖未写字段） */
const DEFAULT_LAYOUT = {
  list: {
    cols: 2,
    treeWidth: '280px',
    variants: {
      mobile: {},
      pc: {},
    },
  },
  create: {
    cols: 3,
    variants: {
      pc: {},
      mobile: {},
    },
  },
  update: {
    cols: 3,
    variants: {
      pc: {},
      mobile: {},
    },
  },
};

/** create / update 未写字段 span 时的分端默认（由 expandCrudPage.applyVariants 注入） */
const DEFAULT_FORM_FIELD_SPAN = {
  pc: 1,
  mobileByCols: true,
};

const getEffectiveLayout = semantic => {
  const user = semantic && semantic.layout && typeof semantic.layout === 'object' ? semantic.layout : {};
  return deepMerge(DEFAULT_LAYOUT, user);
};

module.exports = {
  DEFAULT_LAYOUT,
  DEFAULT_FORM_FIELD_SPAN,
  getEffectiveLayout,
  deepMerge,
};
