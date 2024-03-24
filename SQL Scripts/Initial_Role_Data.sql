 use dragonvstudio
 
         
INSERT INTO `dragonvstudio`.`role`
(`Id`,
`Name`,
`Description`,
`IsActive`,
`IsSystemRole`, 
`CreatedDate`)
VALUES
( UUID()
           ,'Administrator'
           ,'Administrator role has full permission'
           , true
		   , true
           , SYSDATE());
		    
INSERT INTO `dragonvstudio`.`role`
(`Id`,
`Name`,
`Description`,
`IsActive`,
`IsSystemRole`, 
`CreatedDate`)
VALUES
( UUID()
           ,'Moderator'
           ,'Moderator role has some permissions'
           , true
		   , true
           , SYSDATE());
		    
 

