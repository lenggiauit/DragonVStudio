

IF NOT Exists( Select Top 1 * from [dbo].[Permission] where [Code] = 'ManageFileSharing')
BEGIN

	INSERT INTO [dbo].[Permission]
           ([Id]
           ,[Name]
           ,[Code]
           ,[Description]
           ,[IsActive]
           ,[CreatedDate] )
     VALUES
           (
		   NEWID()
           ,'ManageFileSharing'
           ,'ManageFileSharing'
			,'ManageFileSharing'
			,1
			,GETDATE()
          )
END
