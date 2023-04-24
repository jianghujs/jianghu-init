-- 删除 resource
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='selectItemList';
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='updateItem';
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='insertItem';
DELETE FROM `_resource` WHERE `pageId`='{{pageId}}' AND `actionId`='deleteItem';