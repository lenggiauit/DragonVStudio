INSERT INTO `dragonvstudio`.`permission`
(`Id`,
`Name`,
`Code`,
`Description`,
`IsActive`, 
`CreatedDate`)
VALUES
( UUID()
,'Admin'
,'Admin'
,'Administrator permission'
, true 
, SYSDATE()),

( UUID()
,'Kick Player'
,'KickPlayer'
,'Kick Player permission'
, true 
, SYSDATE()),

( UUID()
,'Ban Player'
,'BanPlayer'
,'Ban Player permission'
, true 
, SYSDATE()),

( UUID()
,'ManagePlayer'
,'ManagePlayer'
,'ManagePlayer permission'
, true 
, SYSDATE()),

( UUID()
,'Add/Remove/Update Game Item'
,'AddRemoveUpdateGameItem'
,'Add/Remove/Update Game Item permission'
, true 
, SYSDATE()),

( UUID()
,'Member'
,'Member'
,'Member permission'
, true 
, SYSDATE()),

( UUID()
,'Moderator'
,'Moderator'
,'Moderator permission'
, true 
, SYSDATE())




 
 

 


