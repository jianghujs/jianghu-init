'use strict';

/** 取第一个 > 0 的 pageSize，否则默认 50 */
const resolvePositivePageSize = (...candidates) => {
  for (const raw of candidates) {
    const n = Number(raw);
    if (n > 0) return n;
  }
  return 50;
};

/**
 * blocks.table.pageSize：list.table.pageSize（views.list 经 expandCrudPage）优先于 pageContent 节点 props。
 */
const resolveBlocksTablePageSize = (listTableMeta, tableProps, listNodeProps) =>
  resolvePositivePageSize(
    listTableMeta && listTableMeta.pageSize,
    tableProps && tableProps.pageSize,
    listNodeProps && listNodeProps.pageSize,
  );

const resolveBlocksTableOrderBy = (listTableMeta, tableProps) => {
  if (listTableMeta && listTableMeta.orderBy != null) return listTableMeta.orderBy;
  if (tableProps && tableProps.orderBy != null) return tableProps.orderBy;
  return null;
};

module.exports = {
  resolvePositivePageSize,
  resolveBlocksTablePageSize,
  resolveBlocksTableOrderBy,
};
