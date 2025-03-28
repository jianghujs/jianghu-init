DROP VIEW IF EXISTS _group;
DROP VIEW IF EXISTS _role;
DROP VIEW IF EXISTS _user_group_role;
DROP VIEW IF EXISTS _user_group_role_page;
DROP VIEW IF EXISTS _user_group_role_resource;
DROP VIEW IF EXISTS _view01_user;
DROP VIEW IF EXISTS _view02_user_app;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _group AS SELECT * FROM {{dbPrefix}}data_repository.enterprise_group;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _role AS SELECT * FROM {{dbPrefix}}data_repository.enterprise_role;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role AS SELECT * FROM {{dbPrefix}}data_repository.enterprise_user_group_role;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_page AS SELECT * FROM {{dbPrefix}}data_repository.enterprise_user_group_role_page WHERE {{dbPrefix}}data_repository.enterprise_user_group_role_page.appId = '${appId}' OR {{dbPrefix}}data_repository.enterprise_user_group_role_page.appId = '*';
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_resource AS SELECT * FROM {{dbPrefix}}data_repository.enterprise_user_group_role_resource WHERE {{dbPrefix}}data_repository.enterprise_user_group_role_resource.appId = '${appId}' OR {{dbPrefix}}data_repository.enterprise_user_group_role_resource.appId = '*';
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view01_user AS SELECT * FROM {{dbPrefix}}data_repository.enterprise_user;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view02_user_app AS SELECT * FROM {{dbPrefix}}data_repository.enterprise_user_app;