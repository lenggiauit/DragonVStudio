
 
INSERT INTO `dragonvstudio`.`permissioninrole`
(`Id`,
`PermissionId`,
`RoleId` ) 
SELECT UUID(), Id, (Select Id from  `dragonvstudio`.`role` where Name = 'Administrator') from `dragonvstudio`.`permission` where code in ( 'ManagePlayer', 'KickPlayer', 'BanPlayer', 'Member') 


INSERT INTO `dragonvstudio`.`permissioninrole`
(`Id`,
`PermissionId`,
`RoleId` ) 
SELECT UUID(), Id, (Select Id from  `dragonvstudio`.`role` where Name = 'Moderator') from `dragonvstudio`.`permission` where code in ( 'ManagePlayer', 'KickPlayer', 'BanPlayer', 'Member') 


INSERT INTO `dragonvstudio`.`permissioninrole`
(`Id`,
`PermissionId`,
`RoleId` ) 
SELECT UUID(), Id, (Select Id from  `dragonvstudio`.`role` where Name = 'Member') from `dragonvstudio`.`permission` where Name = 'Member' 




 



 
 

