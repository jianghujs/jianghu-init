
# demo演示

- data-repository: https://demo.jianghujs.org/data-repository
- base-system:     https://demo.jianghujs.org/system   
- base-directory:  https://demo.jianghujs.org/directory
- base-task:       https://demo.jianghujs.org/task 
- hr:              https://demo.jianghujs.org/hr
- bi:              https://demo.jianghujs.org/bi
- finance:         https://demo.jianghujs.org/jh-finance


## system

```sql
CREATE TABLE `view01_hr_user_org` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) DEFAULT NULL COMMENT '职员Id;',
  `hrOrgId` varchar(255) DEFAULT NULL COMMENT '组织Id;',
  `hrOrgName` varchar(255) DEFAULT NULL COMMENT '组织名',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色Id; 负责人、成员'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```