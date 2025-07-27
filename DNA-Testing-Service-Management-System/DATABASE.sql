USE master;
Go
IF DB_ID('DNATestingSystem_V4') IS NULL
BEGIN
  CREATE DATABASE DNATestingSystem_V4;
END;
GO
--ALTER DATABASE DNATestingSystem_V4 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
USE DNATestingSystem_V4;
GO

-- ===================== ROLES & FEATURES =====================
CREATE TABLE Roles (
  RoleID INT PRIMARY KEY IDENTITY(1,1),
  RoleName NVARCHAR(50)
);
GO
-- ===================== USERS =====================
CREATE TABLE Users (
  UserID INT PRIMARY KEY IDENTITY(1,1),
  FullName NVARCHAR(100),
  Phone NVARCHAR(20),
  Email NVARCHAR(50),
  [Password] NVARCHAR(255),
  RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE()),
  UpdatedAt DATE,
  Status INT
);
GO
CREATE TABLE UserProfiles (
  ProfileID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Gender NVARCHAR(10),
  Address NVARCHAR(255),
  DateOfBirth DATE,
  IdentityID VARCHAR(100),
  Fingerfile VARCHAR(MAX),
  UpdatedAt DATE
);
GO
-- ===================== BLOG POSTS =====================
CREATE TABLE BlogPosts (
  PostID INT PRIMARY KEY IDENTITY(1,1),
  Title NVARCHAR(255),
  Slug NVARCHAR(100) UNIQUE,
  Summary NVARCHAR(500),
  Content NVARCHAR(MAX),
  AuthorID INT FOREIGN KEY REFERENCES Users(UserID),
  IsPublished BIT DEFAULT 1,
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE()),
  UpdatedAt DATE,
  ThumbnailURL NVARCHAR(MAX)
);
GO
-- ===================== SYSTEM LOGS =====================
CREATE TABLE SystemLogs (
  LogID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
  ActionType VARCHAR(50),
  Description NVARCHAR(MAX) ,
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE())
);
GO
-- ===================== SERVICES =====================
CREATE TABLE Services (
  ServiceID INT PRIMARY KEY IDENTITY(1,1),
  ServiceName NVARCHAR(200),
  Description NVARCHAR(MAX),
  Slug NVARCHAR(200),
  Category NVARCHAR(50),
  NumberSample TINYINT DEFAULT 1,
  IsUrgent BIT DEFAULT 0,
  IsPublished BIT DEFAULT 1,
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE()),
  UpdatedAt DATE
);
GO
CREATE TABLE PriceDetails (
  PriceID INT PRIMARY KEY IDENTITY(1,1),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  Price2Samples DECIMAL(18,2),
  Price3Samples DECIMAL(18,2),
  TimeToResult NVARCHAR(50),
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE()),
  UpdatedAt DATE,
  IncludeVAT BIT DEFAULT 1
);
GO
-- ===================== TEST REQUESTS =====================
CREATE TABLE CollectType (
  CollectID INT PRIMARY KEY IDENTITY(1,1),
  CollectName NVARCHAR(20)
);
GO
CREATE TABLE TestRequests (
  RequestID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  TypeID INT FOREIGN KEY REFERENCES CollectType(CollectID),
  Category NVARCHAR(50),
  ScheduleDate DATE,
  Address NVARCHAR(255),
  Status NVARCHAR(50),
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE()) ,
  CollectID int
);
GO
CREATE TABLE TestProcesses (
  ProcessID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  StaffID INT FOREIGN KEY REFERENCES Users(UserID),
  ClaimedAt DATE DEFAULT CONVERT(DATE, GETDATE()),
  KitCode VARCHAR(100),
  CurrentStatus NVARCHAR(50),
  Notes Nvarchar(MAX),
  UpdatedAt DATE
);
GO
CREATE TABLE RequestDeclarants (
  DeclarantID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  FullName NVARCHAR(100),
  Gender NVARCHAR(10),
  Address NVARCHAR(255),
  IdentityNumber NVARCHAR(50),
  IdentityIssuedDate DATE,
  IdentityIssuedPlace NVARCHAR(100),
  Phone NVARCHAR(20),
  Email NVARCHAR(100)
);
GO
-- ===================== SAMPLE DATA =====================
CREATE TABLE TestSamples (
  SampleID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  ProcessID INT FOREIGN KEY REFERENCES TestProcesses(ProcessID),
  OwnerName NVARCHAR(100),
  Gender VARCHAR(10),
  Relationship NVARCHAR(30),
  SampleType NVARCHAR(50),
  YOB INT,
  CollectedAt DATE 
);
GO
CREATE TABLE SampleCollectionForm (
  CollectionID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  ProcessID INT FOREIGN KEY REFERENCES TestProcesses(ProcessID),

  -- Nơi thu mẫu
  Location NVARCHAR(255), -- Có thể khác địa chỉ ban đầu

  -- Thông tin người cung cấp mẫu
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
  HasGeneticDiseaseHistory BIT,
  FingerprintImage NVARCHAR(MAX),

  -- Xác nhận
  ConfirmedBy NVARCHAR(100),
  Note NVARCHAR(MAX)
);
GO
-- ===================== TEST RESULTS =====================
CREATE TABLE TestResults (
  ResultID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  EnteredBy INT FOREIGN KEY REFERENCES Users(UserID),
  VerifiedBy INT FOREIGN KEY REFERENCES Users(UserID),
  ResultData Nvarchar(MAX),
  Status NVARCHAR(50),
  EnteredAt DATE DEFAULT CONVERT(DATE, GETDATE()),
  VerifiedAt DATE,
);
GO
-- ===================== PAYMENTS =====================
CREATE TABLE Invoice (
  InvoiceID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  PaidAt DATE DEFAULT CONVERT(DATE, GETDATE())
);
GO
-- ===================== FEEDBACK & CONSULT =====================
CREATE TABLE Feedbacks (
  FeedbackID INT PRIMARY KEY IDENTITY(1,1),
  ResultID INT FOREIGN KEY REFERENCES TestResults(ResultID),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Rating INT,
  Comment NVARCHAR(1000),
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE())
);
GO
CREATE TABLE ConsultRequests (
  ConsultID INT PRIMARY KEY IDENTITY(1,1),
  StaffID INT FOREIGN KEY REFERENCES Users(UserID),
  FullName NVARCHAR(100),
  Phone NVARCHAR(20),
  Category NVARCHAR(50),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  Message NVARCHAR(1000),
  Status NVARCHAR(50),
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE()) ,
  RepliedAt DATE
);
GO
-- ===================== TOKENS =====================
CREATE TABLE RefreshTokens (
  TokenID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Token NVARCHAR(500),
  ExpiresAt DATE,
  CreatedAt DATE DEFAULT CONVERT(DATE, GETDATE()),
  Revoked BIT
);
GO
------------Bảng ko dùng------------
CREATE TABLE UserSelectedServices (
  ID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  SelectedAt DATE,
  Note Nvarchar(MAX),
  ConvertedToRequest BIT DEFAULT 0,
  IncludeVAT BIT DEFAULT 0
);
GO

-- ===================== INSERT DATA =====================
-- Roles
SET IDENTITY_INSERT Roles ON;
INSERT INTO Roles (RoleID, RoleName) VALUES
(0, 'Guest'),
(1, 'Customer'),
(2, 'Staff'),
(3, 'Manager'),
(4, 'Admin');
SET IDENTITY_INSERT Roles OFF;
GO
-- Services
INSERT INTO Services (ServiceName, Description, Slug, Category, NumberSample, IsUrgent, IsPublished)
VALUES
(N'Xét nghiệm ADN cha con', N'Xác định quan hệ huyết thống giữa cha và con', 'xet-nghiem-adn-cha-con', N'Voluntary', 2, 0, 1),
(N'Xét nghiệm ADN mẹ con', N'Xác định quan hệ giữa mẹ và con', 'xet-nghiem-adn-me-con', N'Voluntary', 2, 0, 1),
(N'Xét nghiệm ADN anh/chị em', N'Xác định quan hệ giữa anh/chị và em', 'xet-nghiem-adn-anh-chi-em', N'Voluntary', 2,  0, 1),
(N'Xét nghiệm ADN họ hàng', N'Xác định quan hệ giữa các thành viên trong gia đình', 'xet-nghiem-adn-ho-hang', N'Voluntary', 2,  0, 1),
(N'Xét nghiệm ADN làm giấy khai sinh', N'Dùng cho thủ tục khai sinh', 'xet-nghiem-adn-lam-giay-khai-sinh', N'Administrative', 2,  0, 1),
(N'Xét nghiệm ADN thẻ ADN cá nhân', N'Dùng làm thẻ ADN cá nhân', 'xet-nghiem-adn-the-ca-nhan', N'Administrative', 2,  0, 1),
(N'Xét nghiệm ADN nhanh (dân sự)', N'Dịch vụ xét nghiệm nhanh trong 24-48 giờ', 'xet-nghiem-adn-nhanh-dan-su', N'Voluntary', 2,  0, 1),
(N'Xét nghiệm ADN hành chính nhanh', N'Dịch vụ hành chính trả kết quả nhanh 48-72 giờ', 'xet-nghiem-adn-hanh-chinh-nhanh', N'Administrative', 2,  0, 1);
GO
-- PriceDetails
INSERT INTO PriceDetails (ServiceID, Price2Samples, Price3Samples, TimeToResult, IncludeVAT)
VALUES
(1, 4500000, 1800000, N'3-5 ngày', 0),
(2, 4500000, 1800000, N'3-5 ngày', 0),
(3, 6000000, 2000000, N'5-7 ngày', 0),
(4, 7500000, 2000000, N'7-10 ngày', 0),
(5, 6500000, 2000000, N'5-7 ngày', 0),
(6, 10000000, 3000000, N'48-72 giờ', 0),
(7, 6500000, 3000000, N'24-48 giờ', 0),
(8, 10000000, 3000000, N'48-72 giờ', 0);
GO
--CollectType
INSERT INTO CollectType (CollectName) VALUES
(N'At Home'),
(N'At Center')
--USER
INSERT INTO Users (FullName, Phone, Email, Password, RoleID, CreatedAt, UpdatedAt, Status)
VALUES (N'ADMIN', '0399212733', 'admin@gmail.com', '$2a$11$uvgXw2oQAEOhf8THRs3GZekQ/NZGa.0qpvqw5/Kzt1HZNbQvz1NwG', 4, GETDATE(), GETDATE(), 1),
(N'MANAGER 1', '0399001122', 'manager1@gmail.com', '$2a$11$2FODff0l7TWJOFHT3Fgy0u9W.7tx8dSEmTgJhfYcvBBPiXx3e2SJS', 3, GETDATE(), GETDATE(), 1);
GO
INSERT INTO UserProfiles (UserID, Gender, Address, DateOfBirth, IdentityId, Fingerfile, UpdatedAt)
VALUES  (1, N'Nam', N'12 Nguyễn Huệ, Quận 1, TP.HCM', '1985-05-15', '/uploads/identity/nguyenvana.png', '/uploads/fingerprint/nguyenvana.fgp', GETDATE()),
(2, N'Nữ', N'34 Hai Bà Trưng, Quận 3, TP.HCM', '1990-08-20', '/uploads/identity/lethib.png', '/uploads/fingerprint/lethib.fgp', GETDATE());
--Blogs
GO
INSERT INTO BlogPosts (Title, Slug, Summary, Content, AuthorID, ThumbnailURL) VALUES
(N'Quy trình xét nghiệm ADN tại ADNVietnam', N'quy-trinh-xet-nghiem-adn', 
N'Chi tiết từng bước trong quy trình xét nghiệm ADN tại ADNVietnam, đảm bảo độ chính xác và bảo mật cao.',
N'Quy trình xét nghiệm ADN tại ADNVietnam gồm 4 bước: Đăng ký, lấy mẫu, phân tích mẫu và trả kết quả.', 
2, N'https://adnvietnam.vn/wp-content/uploads/2021/08/quy-trinh-xet-nghiem.jpg'),
(N'Câu hỏi thường gặp khi xét nghiệm ADN', N'cau-hoi-thuong-gap',
N'Tổng hợp các thắc mắc phổ biến về quy trình, thời gian, chi phí và tính pháp lý của xét nghiệm ADN.',
N'Câu hỏi: Xét nghiệm ADN mất bao lâu? – Thường từ 3-5 ngày làm việc. Có chính xác không? – Độ chính xác đến 99.999%.',
2, N'https://adnvietnam.vn/wp-content/uploads/2022/06/faq-xet-nghiem.jpg'),
(N'Các trường hợp nên xét nghiệm ADN', N'cac-truong-hop-xet-nghiem-adn',
N'Xét nghiệm ADN cần thiết trong các trường hợp cha/mẹ con nghi ngờ huyết thống, làm giấy khai sinh, nhập tịch...',
N'Các trường hợp thường gặp: Nghi ngờ huyết thống, xác minh thân nhân trong pháp lý, nhập tịch, thừa kế tài sản,...',
2, N'https://adnvietnam.vn/wp-content/uploads/2023/02/doi-tuong-xet-nghiem.jpg'),
(N'Thẻ ADN cá nhân là gì?', N'the-adn-ca-nhan',
N'Thẻ ADN là một dạng xác thực sinh học cá nhân hóa, giúp lưu trữ và xác minh danh tính qua phân tích gen.',
N'Thẻ ADN cá nhân do ADNVietnam cung cấp được mã hóa và lưu trữ an toàn.',
2, N'https://adnvietnam.vn/wp-content/uploads/2022/04/the-adn.jpg');
