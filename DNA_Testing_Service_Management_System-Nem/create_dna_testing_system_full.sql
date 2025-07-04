﻿-- ===================== CREATE & USE DATABASE =====================
IF DB_ID('DNATestingSystem_V4') IS NULL
BEGIN
  CREATE DATABASE DNATestingSystem_V4;
END;
GO
DROP DATABASE DNATestingSystem_V4

USE master;
GO

ALTER DATABASE DNATestingSystem_V4 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE DNATestingSystem_V4
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
  IdentityID VARCHAR(100),
  Fingerfile VARCHAR(100),
  UpdatedAt DATETIME
);
GO

EXEC sp_rename 'UserProfiles.IdentityFile', 'IdentityID', 'COLUMN';
SELECT * FROM UserProfiles

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
  CollectTypeId INT PRIMARY KEY IDENTITY(1,1),
  CollectName NVARCHAR(20)
);
GO
DROP TABLE CollectType
-- Đổi tên cột CollectID thành CollectTypeId
EXEC sp_rename 'CollectType.CollectID', 'CollectTypeId', 'COLUMN';

INSERT INTO CollectType (CollectName) VALUES
(N'At Center'),
(N'At Home');

CREATE TABLE TestRequests (
  RequestID INT PRIMARY KEY IDENTITY(1,1),
  UserID INT FOREIGN KEY REFERENCES Users(UserID),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
  TypeID INT FOREIGN KEY REFERENCES CollectType(CollectTypeId),
  Category NVARCHAR(50),
  -- thêm bảng
  ScheduleDate DATE,
  Address NVARCHAR(255),
  Status NVARCHAR(50),
  CreatedAt DATETIME DEFAULT GETDATE() 
);
GO

CREATE TABLE TestProcesses (
  ProcessID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  StaffID INT FOREIGN KEY REFERENCES Users(UserID),
  ClaimedAt DATETIME,
  KitCode VARCHAR(50),
  CurrentStatus NVARCHAR(50),
--  ProcessState NVARCHAR(50),
-- bỏ
  Notes TEXT,
  UpdatedAt DATETIME
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

-- ===================== SAMPLE DATA =====================
CREATE TABLE TestSamples (
  SampleID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
 -- ProcessID INT FOREIGN KEY REFERENCES TestProcesses(ProcessID),
 --bỏ
  OwnerName NVARCHAR(100),
  Gender VARCHAR(10),
  Relationship NVARCHAR(30),
  SampleType NVARCHAR(50), -- staff có thể cập nhật sau, customer có thể nhập hoặc ko nhập
  -- Không cần ProcessID (lấy gián tiếp qua Request)
  YOB INT,
  CollectedAt DATETIME
);
GO
ALTER TABLE TestSamples ADD CollectedAt DATETIME;

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'TestRequests';
DROP TABLE CollectType;
DROP TABLE TestType;

-- bỏ bảng ỏ bảng SampleCollectionRecords, SampleCollectionSamples
--hợp thành bảng SampleCollectionForms

CREATE TABLE SampleCollectionForms (
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
  FingerprintImage NVARCHAR(255),

  -- Xác nhận
  ConfirmedBy NVARCHAR(100),
  Note NVARCHAR(1000)
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
  VerifiedAt DATETIME,
 -- CollectedAt DATETIME, bỏ
);
GO
ALTER TABLE TestResults ADD CollectedAt DATETIME;

-- ===================== PAYMENTS =====================
--CREATE TABLE Payments (
 -- PaymentID INT PRIMARY KEY IDENTITY(1,1),
 -- RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
 -- Amount DECIMAL(18,2),
--  PaymentMethod NVARCHAR(50),
 -- PaidAt DATETIME
--);
--GO
CREATE TABLE Invoice (
  InvoiceID INT PRIMARY KEY IDENTITY(1,1),
  RequestID INT FOREIGN KEY REFERENCES TestRequests(RequestID),
  PaidAt DATE Default GetDATE()
);
GO
-- đổi bảng payments thành bảng invoice
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
--  CustomerID INT FOREIGN KEY REFERENCES Users(UserID),
  StaffID INT FOREIGN KEY REFERENCES Users(UserID),
  FullName NVARCHAR(100),
  Phone NVARCHAR(20),
  Category NVARCHAR(50),
  ServiceID INT FOREIGN KEY REFERENCES Services(ServiceID),
--  Subject NVARCHAR(255),
  Message TEXT,
--  ReplyMessage TEXT,
  Status NVARCHAR(50),
  CreatedAt DATETIME,
  RepliedAt DATETIME
);
GO
SELECT * FROM ConsultRequests
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
INSERT INTO UserProfiles (UserID, Gender, Address, DateOfBirth, IdentityId, Fingerfile, UpdatedAt)
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
SELECT * FROM ConsultRequests
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

INSERT INTO CollectType  (  CollectName  ) VALUES
(N'At Center'),
(N'At Home'),
( 'Cha - Con'),
('Mẹ - Con'),
( 'Anh - Em'),
( 'Họ hàng'),
( 'Khai sinh'),
( 'Thẻ ADN cá nhân'),
( 'Hành chính nhanh');

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
INSERT INTO TestRequests (UserID, ServiceID, TypeID, Category, ScheduleDate, Address, Status, CreatedAt)
VALUES 
(3, 1, 3, N'Dân sự', '2025-07-01', N'12 Trần Phú, Hà Nội', N'Pending', GETDATE()),
(3, 2, 4, N'Dân sự', '2025-07-02', N'34 Hùng Vương, Huế', N'Pending', GETDATE());
INSERT INTO TestProcesses (RequestID, StaffID, ClaimedAt, KitCode, CurrentStatus, ProcessState, Notes, UpdatedAt)
VALUES 
(6, 2, GETDATE(), 'KIT001', N'Chờ lấy mẫu', N'Mới', NULL, GETDATE()),
(7, 2, GETDATE(), 'KIT002', N'Chờ lấy mẫu', N'Mới', NULL, GETDATE());

INSERT INTO TestSamples (RequestID, ProcessID, OwnerName, Gender, Relationship, SampleType, YOB, CollectedAt)
VALUES 
-- Cha - Con
(6, 1, N'Nguyễn Văn A', 'Nam', N'Cha', N'Nước bọt', 1980, GETDATE()),
(6, 1, N'Nguyễn Văn B', 'Nam', N'Con', N'Nước bọt', 2012, GETDATE()),

-- Mẹ - Con
(7, 2, N'Lê Thị C', 'Nữ', N'Mẹ', N'Tóc có chân tóc', 1985, GETDATE()),
(7, 2, N'Lê Thị D', 'Nữ', N'Con', N'Máu', 2015, GETDATE());

-- Giả sử bạn đã có các RequestID tồn tại trong bảng TestRequests

INSERT INTO RequestDeclarants (
  RequestID, FullName, Gender, Address, IdentityNumber, IdentityIssuedDate, 
  IdentityIssuedPlace, Phone, Email
) VALUES
(1, N'Nguyễn Văn A', N'Nam', N'123 Đường ABC, Quận 1, TP.HCM', '123456789', '2015-06-15', N'CA TP.HCM', '0909123456', 'a.nguyen@example.com'),
(2, N'Lê Thị B', N'Nữ', N'45 Đường XYZ, Quận 3, TP.HCM', '987654321', '2017-09-20', N'CA TP.HCM', '0912233445', 'b.le@example.com'),
(3, N'Trần Văn C', N'Nam', N'789 Đường DEF, Quận 5, TP.HCM', '135792468', '2018-11-10', N'CA TP.HCM', '0987654321', 'c.tran@example.com');


SELECT * FROM UserProfiles
SELECT * FROM TestResults
SELECT * FROM Users
SELECT * FROM TestResults
WHERE Status = 'Pending' AND (RequestId IS NULL OR EnteredBy IS NULL)
SELECT * FROM TestRequests
WHERE UserId IS NULL OR ServiceId IS NULL

SELECT * FROM TestResults WHERE RequestId IS NOT NULL AND RequestId NOT IN (SELECT RequestId FROM TestRequests);

-- Insert TestRequest
INSERT INTO TestRequests (UserID, ServiceID, TypeID, Category, ScheduleDate, Address, Status, CreatedAt)
VALUES
(3, 3, 2, N'Voluntary', '2025-06-28', N'123 Đường ABC, Hà Nội', N'Pending', '2025-06-24T17:00:00'),
(3, 3, 2, N'Voluntary', '2025-06-28', N'123 Đường ABC, Hà Nội', N'Pending', '2025-06-24T17:00:00'),
(3, 3, 2, N'Voluntary', '2025-06-28', N'123 Đường ABC, Hà Nội', N'Pending', '2025-06-24T17:00:00'),
(3, 3, 2, N'Voluntary', '2025-06-28', N'123 Đường ABC, Hà Nội', N'Pending', '2025-06-24T17:00:00'),
(3, 3, 2, N'Voluntary', '2025-06-28', N'123 Đường ABC, Hà Nội', N'Pending', '2025-06-24T17:00:00');

-- Insert RequestDeclarant (example)
INSERT INTO RequestDeclarants (
  RequestID, FullName, Gender, Address, IdentityNumber, IdentityIssuedDate,
  IdentityIssuedPlace, Phone, Email
)
VALUES
(1, N'Nguyễn Văn A', N'Nam', N'123 Đường ABC', '0123456789', '2020-01-01', N'Hà Nội', '0901234567', 'abc@example.com'),
(2, N'Nguyễn Văn A', N'Nam', N'123 Đường ABC', '0123456789', '2020-01-01', N'Hà Nội', '0901234567', 'abc@example.com'),
(3, N'Nguyễn Văn A', N'Nam', N'123 Đường ABC', '0123456789', '2020-01-01', N'Hà Nội', '0901234567', 'abc@example.com'),
(4, N'Nguyễn Văn A', N'Nam', N'123 Đường ABC', '0123456789', '2020-01-01', N'Hà Nội', '0901234567', 'abc@example.com'),
(5, N'Nguyễn Văn A', N'Nam', N'123 Đường ABC', '0123456789', '2020-01-01', N'Hà Nội', '0901234567', 'abc@example.com');

-- Insert TestSamples
INSERT INTO TestSamples (RequestID, ProcessID, OwnerName, Gender, Relationship, SampleType, YOB, CollectedAt)
VALUES
(1, NULL, N'Nguyễn Văn A', 'Nam', N'Cha', N'Tế bào niêm mạc', 1985, NULL),
(1, NULL, N'Nguyễn Văn B', 'Nam', N'Con', N'Máu', 2015, NULL),
(2, NULL, N'Nguyễn Văn A', 'Nam', N'Cha', N'Tế bào niêm mạc', 1985, NULL),
(2, NULL, N'Nguyễn Văn B', 'Nam', N'Con', N'Máu', 2015, NULL),
(3, NULL, N'Nguyễn Văn A', 'Nam', N'Cha', N'Tế bào niêm mạc', 1985, NULL),
(3, NULL, N'Nguyễn Văn B', 'Nam', N'Con', N'Máu', 2015, NULL),
(4, NULL, N'Nguyễn Văn A', 'Nam', N'Cha', N'Tế bào niêm mạc', 1985, NULL),
(4, NULL, N'Nguyễn Văn B', 'Nam', N'Con', N'Máu', 2015, NULL),
(5, NULL, N'Nguyễn Văn A', 'Nam', N'Cha', N'Tế bào niêm mạc', 1985, NULL),
(5, NULL, N'Nguyễn Văn B', 'Nam', N'Con', N'Máu', 2015, NULL);
