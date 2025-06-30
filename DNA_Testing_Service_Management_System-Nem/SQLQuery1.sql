SELECT TOP (1000) [MemberID]
      ,[MemberPassword]
      ,[FullName]
      ,[EmailAddress]
      ,[MemberRole]
  FROM [MyStore].[dbo].[AccountMember]

  SELECT * FROM SERVICES
  SELECT * FROM TestRequests 
  SELECT * FROM RequestDeclarants
  SELECT * FROM TestSamples 
  SELECT * FROM CollectType
  EXEC sp_rename 'CollectType.CollectTypeId', 'CollectID', 'COLUMN';
  EXEC sp_rename 'CollectType.Name', 'CollectName', 'COLUMN';
  SELECT RequestId, CollectId FROM TestRequests;
  EXEC sp_columns TestRequest;
  sp_help TestRequests
