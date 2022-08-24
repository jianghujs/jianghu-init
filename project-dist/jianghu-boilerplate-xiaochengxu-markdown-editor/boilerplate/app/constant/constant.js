"use strict";

module.exports.tableEnum = Object.freeze({
  // ========================江湖表============================
  _cache: "_cache",
  _constant: "_constant",
  _constant_ui: "_constant_ui",
  _app: "_app",
  _file: "_file",
  _group: "_group",
  _page: "_page",
  _resource: "_resource",
  _resource_request_log: "_resource_request_log",
  _record_history: "_record_history",
  _role: "_role",
  _user: "_user",
  _user_app: "_user_app",
  _view_user_app: "_view02_user_app",
  _user_group_role: "_user_group_role",
  _user_group_role_page: "_user_group_role_page",
  _user_group_role_resource: "_user_group_role_resource",
  _user_group_role_ui_level: "_user_group_role_ui_level",
  _user_session: "_user_session",
  // ========================业务表============================
  xf_page: 'xf_page',
  xf_page_history: 'xf_page_history',
  xf_page_tag: 'xf_page_tag',
  album: "album",
  article: "article",
  article_history: "article_history",
  article_tag: "article_tag",
  attachment: "attachment",
  category: "category",
  favorite: "favorite",
  history: "history",
  share: "share",
  tag: "tag",
  template: "template",
  user_category_role: "user_category_role",
  // ========================基础 View============================
  _view01_user: "_view01_user",
  view01_article: "view01_article",
  // ========================高级 View============================
});

module.exports.categoryPublishStatusEnum = Object.freeze({
  login: "login",
  draft: "draft",
  deleted: "deleted",
});

module.exports.articlePublishStatusEnum = Object.freeze({
  login: "login",
  draft: "draft",
  deleted: "deleted",
});

module.exports.xfPagePublishStatusEnum = Object.freeze({
  login: 'login',
  draft: 'draft',
  deleted: 'deleted',
});
