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
,'Add/Remove/Update Game Item'
,'AddRemoveUpdateGameItem'
,'Add/Remove/Update Game Item permission'
, true 
, SYSDATE())


INSERT INTO `dragonvstudio`.`permission`
(`Id`,
`Name`,
`Code`,
`Description`,
`IsActive`, 
`CreatedDate`)
VALUES
( UUID()
,'Member'
,'Member'
,'Member permission'
, true 
, SYSDATE())

INSERT INTO `dragonvstudio`.`permission`
(`Id`,
`Name`,
`Code`,
`Description`,
`IsActive`, 
`CreatedDate`)
VALUES
( UUID()
,'ManagePlayerCREATE TABLE `battleeventplayer` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `GameUrl` varchar(250) DEFAULT NULL,
  `PlayerId` varchar(250) DEFAULT NULL,
  `DiscordId` varchar(250) DEFAULT NULL,
  `Name` varchar(250) DEFAULT NULL,
  `Class` varchar(250) DEFAULT NULL,
  `FactionIndex` int(11) NOT NULL,
  `CreatedBy` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `CreatedDate` datetime(6) DEFAULT NULL,
  `UpdatedDate` datetime(6) DEFAULT NULL,
  `UpdatedBy` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
'
,'ManagePlayer'
,'ManagePlayer permission'
, true 
, SYSDATE())


 
 

 


