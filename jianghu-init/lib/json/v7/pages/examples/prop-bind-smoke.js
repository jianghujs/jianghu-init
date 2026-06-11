'use strict';

const { applyPropBindOverrides, collectReservedBaseProps } = require('../../../shared/applyPropBind');

const props1 = { titleBind: 'computedTitle', title: '静态' };
const o1 = applyPropBindOverrides(props1, { component: 'Sheet', bindingOverrides: {} });
console.assert(o1[':title'] === 'computedTitle', 'titleBind');
console.assert(props1.title === undefined && props1.titleBind === undefined, 'strip plain');

const props2 = { minCardHeightBind: "'200px'" };
const o2 = applyPropBindOverrides(props2, { component: 'Sheet', bindingOverrides: {} });
console.assert(o2[':min-card-height'] === "'200px'", 'kebab-case binding attr');

const reserved = collectReservedBaseProps('FormSheet', { ':shown.sync': 'isCreateDrawerShown' });
console.assert(reserved.has('shown'), 'shown reserved from :shown.sync');

const props3 = { shownBind: 'hack' };
const o3 = applyPropBindOverrides(props3, {
  component: 'FormSheet',
  bindingOverrides: { ':shown.sync': 'isCreateDrawerShown' },
});
console.assert(Object.keys(o3).length === 0, 'shownBind skipped');

console.log('prop-bind smoke ok');
