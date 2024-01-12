-- 删除 resource
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='{{component}}-selectItemList';
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='{{component}}-updateItem';
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='{{component}}-insertItem';
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='{{component}}-deleteItem';