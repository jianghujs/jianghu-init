'use strict';

// jianghu init 时需要的字段
module.exports = {
  name: {
    desc: 'project name',
  },
  keys: {
    desc: 'cookie security keys',
    default: Date.now() + '_' + random(100, 10000),
  },
};

function random(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}
