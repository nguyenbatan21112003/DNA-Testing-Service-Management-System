-- ===================== CREATE & USE DATABASE =====================
--USE master;
--ALTER DATABASE DNATestingSystem_V4 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--DROP DATABASE DNATestingSystem_V4;

IF DB_ID('DNATestingSystem_V4') IS NULL
BEGIN
  CREATE DATABASE DNATestingSystem_V4;
END;
GO

USE DNATestingSystem_V4;
GO

-- ===================== ROLES & FEATURES =====================
CREATE TABLE Roles (
  RoleID INT PRIMARY KEY IDENTITY(1,1),
  RoleName NVARCHAR(50)
);

CREATE TABLE Features (
  FeatureID INT PRIMARY KEY IDENTITY(1,1),
  Name VARCHAR(100),
  Description TEXT
);

CREATE TABLE RoleFeatures (
  RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
  FeatureID INT FOREIGN KEY REFERENCES Features(FeatureID),
  PRIMARY KEY (RoleID, FeatureID)
);

-- ===================== USERS =====================
CREATE TABLE Users (
  UserID INT PRIMARY KEY IDENTITY(1,1),
  FullName NVARCHAR(100),
  Phone NVARCHAR(20),
  Email NVARCHAR(40),
  Password NVARCHAR(255),
  RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
  CreatedAt DATETIME,
  UpdatedAt DATETIME,
  Status int
);

CREATE TABLE UserProfiles (
  ProfileID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Gender NVARCHAR(10),
  Address NVARCHAR(255),
  DateOfBirth DATETIME,
  IdentityFile VARCHAR(100),
  Fingerfile VARCHAR(100),
  UpdatedAt DATETIME
);

-- ===================== BLOG POSTS =====================
CREATE TABLE BlogPosts (
  PostID INT PRIMARY KEY IDENTITY(1,1),
  Title NVARCHAR(255),
  Slug NVARCHAR(100) UNIQUE,
  Summary NVARCHAR(500),
  Content TEXT,
  AuthorID INT FOREIGN KEY REFERENCES Users(UserID),
  IsPublished BIT DEFAULT 1,
  CreatedAt DATETIME,
  UpdatedAt DATETIME
);

-- ===================== SYSTEM LOGS =====================
CREATE TABLE SystemLogs (
  LogID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
  ActionType VARCHAR(50),
  Description TEXT,
  CreatedAt DATETIME DEFAULT GETDATE()
);

-- ===================== SERVICES =====================
CREATE TABLE Services (
  ServiceID INT PRIMARY KEY IDENTITY(1,1),
  ServiceName NVARCHAR(100),
  Description NVARCHAR(255),
  Category NVARCHAR(50),
  NumberSample TINYINT DEFAULT 1,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME
);


CREATE TABLE PriceDetails (
  PriceID INT PRIMARY KEY IDENTITY(1,1),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  Price2Samples DECIMAL(18,2),
  Price3Samples DECIMAL(18,2),
  TimeToResult NVARCHAR(50),
  CreatedAt DATETIME,
  UpdatedAt DATETIME
);

-- ===================== SERVICE REGISTRATION =====================
CREATE TABLE UserSelectedServices (
  ID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  SelectedAt DATETIME,
  Note TEXT,
  ConvertedToRequest BIT DEFAULT 0
);

-- ===================== TEST REQUESTS =====================
CREATE TABLE TestType (
  TypeID INT PRIMARY KEY IDENTITY(1,1),
  TypeName VARCHAR(20)
);

CREATE TABLE TestRequests (
  RequestID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  TypeID INT FOREIGN KEY REFERENCES TestType(TypeID),
  ScheduleDate DATE,
  Address NVARCHAR(255),
  Status NVARCHAR(50),
  CreatedAt DATETIME
);

CREATE TABLE TestProcesses (
  ProcessID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  StaffID INT FOREIGN KEY REFERENCES Users(UserID),
  ClaimedAt DATETIME,
  KitCode VARCHAR(20),
  CurrentStatus NVARCHAR(50),
  ProcessState NVARCHAR(50),
  Notes TEXT,
  UpdatedAt DATETIME
);

-- ===================== SAMPLE DATA =====================
CREATE TABLE TestSamples (
  SampleID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  ProcessID INT FOREIGN KEY REFERENCES TestProcesses(ProcessID),
  OwnerName NVARCHAR(100),
  Gender VARCHAR(10),
  Relationship NVARCHAR(30),
  SampleType NVARCHAR(50),
  YOB INT
);

CREATE TABLE SampleCollectionRecords (
  RecordID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  ProcessID INT FOREIGN KEY REFERENCES TestProcesses(ProcessID),
  CollectedBy INT FOREIGN KEY REFERENCES Users(UserID),
  Location NVARCHAR(255),
  CollectedAt DATETIME,
  ConfirmedBy NVARCHAR(100),
  Note TEXT
);

CREATE TABLE SampleCollectionSamples (
  CollectedSampleID INT PRIMARY KEY IDENTITY(1,1),
  RecordID INT FOREIGN KEY REFERENCES SampleCollectionRecords(RecordID),
  FullName NVARCHAR(100),
  YOB INT,
  Gender NVARCHAR(10),
  IDType NVARCHAR(30),
  IDNumber NVARCHAR(50),
  IDIssuedDate DATE,
  IDIssuedPlace NVARCHAR(100),
  Address NVARCHAR(255),
  SampleType NVARCHAR(50),
  Quantity VARCHAR(20),
  Relationship NVARCHAR(30),
  CollectedBy NVARCHAR(100),
  HasGeneticDiseaseHistory BIT
);

-- ===================== TEST RESULTS =====================
CREATE TABLE TestResults (
  ResultID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  EnteredBy INT FOREIGN KEY REFERENCES Users(UserID),
  VerifiedBy INT FOREIGN KEY REFERENCES Users(UserID),
  ResultData TEXT,
  Status NVARCHAR(50),
  EnteredAt DATETIME,
  VerifiedAt DATETIME
);

-- ===================== PAYMENTS =====================
CREATE TABLE Payments (
  PaymentID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  Amount DECIMAL(18,2),
  PaymentMethod NVARCHAR(50),
  PaidAt DATETIME
);

-- ===================== FEEDBACK & CONSULT =====================
CREATE TABLE Feedbacks (
  FeedbackID INT PRIMARY KEY IDENTITY(1,1),
  ResultID INT FOREIGN KEY REFERENCES TestResults(ResultID),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Rating INT,
  Comment NVARCHAR(1000),
  CreatedAt DATETIME
);

CREATE TABLE ConsultRequests (
  ConsultID INT PRIMARY KEY IDENTITY(1,1),
  CustomerID INT FOREIGN KEY REFERENCES Users(UserID),
  StaffID INT FOREIGN KEY REFERENCES Users(UserID),
  Subject NVARCHAR(255),
  Message TEXT,
  ReplyMessage TEXT,
  Status NVARCHAR(50),
  CreatedAt DATETIME,
  RepliedAt DATETIME
);

-- ===================== TOKENS =====================
CREATE TABLE RefreshTokens (
  TokenID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Token NVARCHAR(500),
  ExpiresAt DATETIME,
  CreatedAt DATETIME,
  Revoked BIT
);
