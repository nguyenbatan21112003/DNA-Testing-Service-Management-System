-- ===================== CREATE & USE DATABASE =====================
IF DB_ID('DNATestingSystem_V4') IS NULL
BEGIN
  CREATE DATABASE DNATestingSystem_V4;
END;
GO
DROP DATABASE DNATestingSystem_V4
USE DNATestingSystem_V4;
GO

-- ===================== ROLES & FEATURES =====================
CREATE TABLE Roles (
  RoleID INT PRIMARY KEY IDENTITY(1,1),
  RoleName NVARCHAR(50)
);
GO

CREATE TABLE Features (
  FeatureID INT PRIMARY KEY IDENTITY(1,1),
  Name VARCHAR(100),
  Description TEXT
);
GO

CREATE TABLE RoleFeatures (
  RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
  FeatureID INT FOREIGN KEY REFERENCES Features(FeatureID),
  PRIMARY KEY (RoleID, FeatureID)
);
GO

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
  Status INT
);
GO

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
GO

-- ===================== BLOG POSTS =====================
CREATE TABLE BlogPosts (
  PostID INT PRIMARY KEY IDENTITY(1,1),
  Title NVARCHAR(255),
  Slug NVARCHAR(100) UNIQUE,
  Summary NVARCHAR(500),
  Content NVARCHAR(500),
  AuthorID INT FOREIGN KEY REFERENCES Users(UserID),
  IsPublished BIT DEFAULT 1,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME,
  ThumbnailURL NVARCHAR(255)
);
GO

--ALTER TABLE BlogPosts ADD ThumbnailURL NVARCHAR(255);
GO

-- ===================== SYSTEM LOGS =====================
CREATE TABLE SystemLogs (
  LogID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
  ActionType VARCHAR(50),
  Description TEXT,
  CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- ===================== SERVICES =====================
CREATE TABLE Services (
  ServiceID INT PRIMARY KEY IDENTITY(1,1),
  ServiceName NVARCHAR(100),
  Description NVARCHAR(255),
  Slug NVARCHAR(100),
  Category NVARCHAR(50),
  NumberSample TINYINT DEFAULT 1,
  IsUrgent BIT DEFAULT 0,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME,
  IsPublished BIT DEFAULT 0
);
GO
--ALTER TABLE Services ADD Slug NVARCHAR(100);
--ALTER TABLE Services ADD IsUrgent BIT DEFAULT 0;
--AlTER TABLE Services ADD IsPublished BIT DEFAULT 0 ;
GO

CREATE TABLE PriceDetails (
  PriceID INT PRIMARY KEY IDENTITY(1,1),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  Price2Samples DECIMAL(18,2),
  Price3Samples DECIMAL(18,2),
  TimeToResult NVARCHAR(50),
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME,
  IncludeVAT BIT DEFAULT 0
);
GO

ALTER TABLE PriceDetails ADD IncludeVAT BIT DEFAULT 0;
GO

-- ===================== SERVICE REGISTRATION =====================
CREATE TABLE UserSelectedServices (
  ID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  SelectedAt DATETIME,
  Note TEXT,
  ConvertedToRequest BIT DEFAULT 0,
  IncludeVAT BIT DEFAULT 0
);
GO

-- ===================== TEST REQUESTS =====================
CREATE TABLE CollectType (
  CollectID INT PRIMARY KEY IDENTITY(1,1),
  CollectName NVARCHAR(20)
);
GO
DROP TABLE CollectType

CREATE TABLE TestRequests (
  RequestID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  TypeID INT FOREIGN KEY REFERENCES CollectType(CollectID),
  ScheduleDate DATE,
  Address NVARCHAR(255),
  Status NVARCHAR(50),
  CreatedAt DATETIME
);
GO

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
  YOB INT
);
GO

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
GO

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
GO

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
GO

-- ===================== PAYMENTS =====================
CREATE TABLE Payments (
  PaymentID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  Amount DECIMAL(18,2),
  PaymentMethod NVARCHAR(50),
  PaidAt DATETIME
);
GO

-- ===================== FEEDBACK & CONSULT =====================
CREATE TABLE Feedbacks (
  FeedbackID INT PRIMARY KEY IDENTITY(1,1),
  ResultID INT FOREIGN KEY REFERENCES TestResults(ResultID),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Rating INT,
  Comment NVARCHAR(1000),
  CreatedAt DATETIME
);
GO

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
GO

-- ===================== TOKENS =====================
CREATE TABLE RefreshTokens (
  TokenID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  Token NVARCHAR(500),
  ExpiresAt DATETIME,
  CreatedAt DATETIME,
  Revoked BIT
);
GO

-- ===================== SEED DATA =====================

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

-- Users
INSERT INTO Users (FullName, Phone, Email, Password, RoleID, CreatedAt, UpdatedAt, Status)
VALUES 
(N'Nguyễn Văn A', '0909123456', 'admin@adn.vn', 'hashed_password_1', 1, GETDATE(), GETDATE(), 1),
(N'Lê Thị B', '0911123456', 'staff@adn.vn', 'hashed_password_2', 2, GETDATE(), GETDATE(), 1),
(N'Trần Văn C', '0922123456', 'khachhang1@gmail.com', 'hashed_password_3', 3, GETDATE(), GETDATE(), 1),
(N'Phạm Thị D', '0933123456', 'khachhang2@gmail.com', 'hashed_password_4', 3, GETDATE(), GETDATE(), 0);
GO
SELECT * FROM Users
INSERT INTO UserProfiles (UserID, Gender, Address, DateOfBirth, IdentityFile, Fingerfile, UpdatedAt)
VALUES 
(1, N'Nam', N'12 Nguyễn Huệ, Quận 1, TP.HCM', '1985-05-15', '/uploads/identity/nguyenvana.png', '/uploads/fingerprint/nguyenvana.fgp', GETDATE()),
(2, N'Nữ', N'34 Hai Bà Trưng, Quận 3, TP.HCM', '1990-08-20', '/uploads/identity/lethib.png', '/uploads/fingerprint/lethib.fgp', GETDATE()),
(3, N'Nam', N'56 Lý Thường Kiệt, Quận 10, TP.HCM', '1992-11-10', '/uploads/identity/tranvanc.png', '/uploads/fingerprint/tranvanc.fgp', GETDATE());

SELECT * FROM Users
-- Services
INSERT INTO Services (ServiceName, Description, Slug, Category, NumberSample, IsUrgent)
VALUES
(N'Xét nghiệm ADN cha con', N'Xác định quan hệ huyết thống giữa cha và con', 'xet-nghiem-adn-cha-con', N'Dân sự', 2, 0),
(N'Xét nghiệm ADN mẹ con', N'Xác định quan hệ giữa mẹ và con', 'xet-nghiem-adn-me-con', N'Dân sự', 2, 0),
(N'Xét nghiệm ADN anh/chị em', N'Xác định quan hệ giữa anh/chị và em', 'xet-nghiem-adn-anh-chi-em', N'Dân sự', 2, 0),
(N'Xét nghiệm ADN họ hàng', N'Xác định quan hệ giữa các thành viên trong gia đình', 'xet-nghiem-adn-ho-hang', N'Dân sự', 2, 0),
(N'Xét nghiệm ADN làm giấy khai sinh', N'Dùng cho thủ tục khai sinh', 'xet-nghiem-adn-lam-giay-khai-sinh', N'Hành chính', 2, 0),
(N'Xét nghiệm ADN thẻ ADN cá nhân', N'Dùng làm thẻ ADN cá nhân', 'xet-nghiem-adn-the-ca-nhan', N'Hành chính', 2, 0),
(N'Xét nghiệm ADN nhanh (dân sự)', N'Dịch vụ xét nghiệm nhanh trong 24-48 giờ', 'xet-nghiem-adn-nhanh-dan-su', N'Dân sự', 2, 1),
(N'Xét nghiệm ADN hành chính nhanh', N'Dịch vụ hành chính trả kết quả nhanh 48-72 giờ', 'xet-nghiem-adn-hanh-chinh-nhanh', N'Hành chính', 2, 1);
GO

SELECT * FROM Services
--SELECT * FROM Services
--DROP TABLE Services
SELECT * FROM PriceDetails

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

-- Blog Posts
INSERT INTO BlogPosts (Title, Slug, Summary, Content, AuthorID, ThumbnailURL) VALUES
(N'Quy trình xét nghiệm ADN tại ADNVietnam', N'quy-trinh-xet-nghiem-adn', 
N'Chi tiết từng bước trong quy trình xét nghiệm ADN tại ADNVietnam, đảm bảo độ chính xác và bảo mật cao.',
N'Quy trình xét nghiệm ADN tại ADNVietnam gồm 4 bước: Đăng ký, lấy mẫu, phân tích mẫu và trả kết quả.', 
2, N'https://adnvietnam.vn/wp-content/uploads/2021/08/quy-trinh-xet-nghiem.jpg'),
(N'Câu hỏi thường gặp khi xét nghiệm ADN', N'cau-hoi-thuong-gap',
N'Tổng hợp các thắc mắc phổ biến về quy trình, thời gian, chi phí và tính pháp lý của xét nghiệm ADN.',
N'Câu hỏi: Xét nghiệm ADN mất bao lâu? – Thường từ 3-5 ngày làm việc. Có chính xác không? – Độ chính xác đến 99.999%.',
3, N'https://adnvietnam.vn/wp-content/uploads/2022/06/faq-xet-nghiem.jpg'),
(N'Các trường hợp nên xét nghiệm ADN', N'cac-truong-hop-xet-nghiem-adn',
N'Xét nghiệm ADN cần thiết trong các trường hợp cha/mẹ con nghi ngờ huyết thống, làm giấy khai sinh, nhập tịch...',
N'Các trường hợp thường gặp: Nghi ngờ huyết thống, xác minh thân nhân trong pháp lý, nhập tịch, thừa kế tài sản,...',
3, N'https://adnvietnam.vn/wp-content/uploads/2023/02/doi-tuong-xet-nghiem.jpg'),
(N'Thẻ ADN cá nhân là gì?', N'the-adn-ca-nhan',
N'Thẻ ADN là một dạng xác thực sinh học cá nhân hóa, giúp lưu trữ và xác minh danh tính qua phân tích gen.',
N'Thẻ ADN cá nhân do ADNVietnam cung cấp được mã hóa và lưu trữ an toàn.',
2, N'https://adnvietnam.vn/wp-content/uploads/2022/04/the-adn.jpg');
GO
SELECT * FROM CollectType
SET IDENTITY_INSERT CollectType ON;

INSERT INTO CollectType  (CollectID , CollectName  ) VALUES
(1, 'Cha - Con'),
(2, 'Mẹ - Con'),
(3, 'Anh - Em'),
(4, 'Họ hàng'),
(5, 'Khai sinh'),
(6, 'Thẻ ADN cá nhân'),
(7, 'Hành chính nhanh');

SET IDENTITY_INSERT CollectType OFF;


--TestRequest
-- Ví dụ: UserID = 3, ServiceID = 1, TypeID = 1 (Cha - Con)
INSERT INTO TestRequests (UserID, ServiceID, TypeID, ScheduleDate, Address, Status, CreatedAt)
VALUES 
(3, 1, 1, '2025-06-20', N'123 Đường Lê Lợi, Hà Nội', N'Pending', GETDATE()),
(3, 2, 2, '2025-06-21', N'456 Nguyễn Huệ, Huế', N'Pending', GETDATE()),
(4, 3, 3, '2025-06-22', N'789 Trần Hưng Đạo, TP.HCM', N'Pending', GETDATE()),
(3, 4, 4, '2025-06-23', N'88 Lý Thường Kiệt, Đà Nẵng', N'Pending', GETDATE()),  -- RequestID = 4
(3, 5, 5, '2025-06-24', N'99 Nguyễn Trãi, Hà Nội', N'Pending', GETDATE());      -- RequestID = 5
SELECT * FROM TestRequests
--TestResult
-- Thêm 2 request để khớp với TestResults
INSERT INTO TestResults (RequestID, EnteredBy, VerifiedBy, ResultData, Status, EnteredAt, VerifiedAt)
VALUES
-- Yêu cầu 1: Chưa xác nhận
(3, 2, NULL, N'Kết quả xét nghiệm đang được xử lý...', N'Pending', GETDATE(), NULL),

-- Yêu cầu 2: Đang phân tích
(4, 2, NULL, N'Đang phân tích mẫu...', N'Pending', GETDATE(), NULL),

-- Yêu cầu 3: Đã xác minh huyết thống
(5, 2, 3, N'Quan hệ huyết thống: Cha - Con (99.99%)', N'Verified', DATEADD(DAY, -2, GETDATE()), GETDATE());

SELECT * FROM UserProfiles
SELECT * FROM TestResults
SELECT * FROM Users
SELECT * FROM TestResults
WHERE Status = 'Pending' AND (RequestId IS NULL OR EnteredBy IS NULL)
SELECT * FROM TestRequests
WHERE UserId IS NULL OR ServiceId IS NULL

SELECT * FROM TestResults WHERE RequestId IS NOT NULL AND RequestId NOT IN (SELECT RequestId FROM TestRequests);
