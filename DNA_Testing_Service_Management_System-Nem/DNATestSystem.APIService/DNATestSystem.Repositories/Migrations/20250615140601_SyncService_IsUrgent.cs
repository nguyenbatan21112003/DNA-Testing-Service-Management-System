using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class SyncService_IsUrgent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Features",
                columns: table => new
                {
                    FeatureID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Features__82230A298C737335", x => x.FeatureID);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Roles__8AFACE3A99E52713", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NumberSample = table.Column<byte>(type: "tinyint", nullable: true, defaultValue: (byte)1),
                    IsUrgent = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Services__C51BB0EA5C24E25B", x => x.ServiceID);
                });

            migrationBuilder.CreateTable(
                name: "TestType",
                columns: table => new
                {
                    TypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestType__516F039541C8093B", x => x.TypeID);
                });

            migrationBuilder.CreateTable(
                name: "RoleFeatures",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    FeatureID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__RoleFeat__02D8FE984F43F664", x => new { x.RoleID, x.FeatureID });
                    table.ForeignKey(
                        name: "FK__RoleFeatu__Featu__29572725",
                        column: x => x.FeatureID,
                        principalTable: "Features",
                        principalColumn: "FeatureID");
                    table.ForeignKey(
                        name: "FK__RoleFeatu__RoleI__286302EC",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RoleID = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CCACB59AC285", x => x.UserID);
                    table.ForeignKey(
                        name: "FK__Users__RoleID__2C3393D0",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID");
                });

            migrationBuilder.CreateTable(
                name: "PriceDetails",
                columns: table => new
                {
                    PriceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceID = table.Column<int>(type: "int", nullable: true),
                    Price2Samples = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Price3Samples = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TimeToResult = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsUrgent = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PriceDet__4957584FE8D57CB9", x => x.PriceID);
                    table.ForeignKey(
                        name: "FK__PriceDeta__Servi__3E52440B",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateTable(
                name: "BlogPosts",
                columns: table => new
                {
                    PostID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Summary = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    AuthorID = table.Column<int>(type: "int", nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BlogPost__AA126038896BD978", x => x.PostID);
                    table.ForeignKey(
                        name: "FK__BlogPosts__Autho__32E0915F",
                        column: x => x.AuthorID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "ConsultRequests",
                columns: table => new
                {
                    ConsultID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    Subject = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Message = table.Column<string>(type: "text", nullable: true),
                    ReplyMessage = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    RepliedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ConsultR__28859B152268FA69", x => x.ConsultID);
                    table.ForeignKey(
                        name: "FK__ConsultRe__Custo__6754599E",
                        column: x => x.CustomerID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__ConsultRe__Staff__68487DD7",
                        column: x => x.StaffID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    TokenID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    Token = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    Revoked = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__RefreshT__658FEE8A6B49B744", x => x.TokenID);
                    table.ForeignKey(
                        name: "FK__RefreshTo__UserI__6B24EA82",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "SystemLogs",
                columns: table => new
                {
                    LogID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    ActionType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SystemLo__5E5499A8FD203F98", x => x.LogID);
                    table.ForeignKey(
                        name: "FK__SystemLog__UserI__36B12243",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "TestRequests",
                columns: table => new
                {
                    RequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    ServiceID = table.Column<int>(type: "int", nullable: true),
                    TypeID = table.Column<int>(type: "int", nullable: true),
                    ScheduleDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestRequ__33A8519A9426A80B", x => x.RequestID);
                    table.ForeignKey(
                        name: "FK__TestReque__Servi__48CFD27E",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID");
                    table.ForeignKey(
                        name: "FK__TestReque__TypeI__49C3F6B7",
                        column: x => x.TypeID,
                        principalTable: "TestType",
                        principalColumn: "TypeID");
                    table.ForeignKey(
                        name: "FK__TestReque__UserI__47DBAE45",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    ProfileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime", nullable: true),
                    IdentityFile = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Fingerfile = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserProf__290C888421913B3E", x => x.ProfileID);
                    table.ForeignKey(
                        name: "FK__UserProfi__UserI__2F10007B",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "UserSelectedServices",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    ServiceID = table.Column<int>(type: "int", nullable: true),
                    SelectedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    Note = table.Column<string>(type: "text", nullable: true),
                    ConvertedToRequest = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserSele__3214EC271BA82503", x => x.ID);
                    table.ForeignKey(
                        name: "FK__UserSelec__Servi__4222D4EF",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID");
                    table.ForeignKey(
                        name: "FK__UserSelec__UserI__412EB0B6",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PaidAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payments__9B556A58C62259D1", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK__Payments__Reques__60A75C0F",
                        column: x => x.RequestID,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                });

            migrationBuilder.CreateTable(
                name: "TestProcesses",
                columns: table => new
                {
                    ProcessID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    ClaimedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    KitCode = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    CurrentStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ProcessState = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestProc__1B39A9765173F1DE", x => x.ProcessID);
                    table.ForeignKey(
                        name: "FK__TestProce__Reque__4CA06362",
                        column: x => x.RequestID,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                    table.ForeignKey(
                        name: "FK__TestProce__Staff__4D94879B",
                        column: x => x.StaffID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "TestResults",
                columns: table => new
                {
                    ResultID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    EnteredBy = table.Column<int>(type: "int", nullable: true),
                    VerifiedBy = table.Column<int>(type: "int", nullable: true),
                    ResultData = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EnteredAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    VerifiedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestResu__97690228838146B3", x => x.ResultID);
                    table.ForeignKey(
                        name: "FK__TestResul__Enter__5CD6CB2B",
                        column: x => x.EnteredBy,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__TestResul__Reque__5BE2A6F2",
                        column: x => x.RequestID,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                    table.ForeignKey(
                        name: "FK__TestResul__Verif__5DCAEF64",
                        column: x => x.VerifiedBy,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "SampleCollectionRecords",
                columns: table => new
                {
                    RecordID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    ProcessID = table.Column<int>(type: "int", nullable: true),
                    CollectedBy = table.Column<int>(type: "int", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CollectedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    ConfirmedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Note = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SampleCo__FBDF78C9BC15D8F2", x => x.RecordID);
                    table.ForeignKey(
                        name: "FK__SampleCol__Colle__5629CD9C",
                        column: x => x.CollectedBy,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__SampleCol__Proce__5535A963",
                        column: x => x.ProcessID,
                        principalTable: "TestProcesses",
                        principalColumn: "ProcessID");
                    table.ForeignKey(
                        name: "FK__SampleCol__Reque__5441852A",
                        column: x => x.RequestID,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                });

            migrationBuilder.CreateTable(
                name: "TestSamples",
                columns: table => new
                {
                    SampleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    ProcessID = table.Column<int>(type: "int", nullable: true),
                    OwnerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Relationship = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    SampleType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    YOB = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestSamp__8B99EC0A3F1D96F0", x => x.SampleID);
                    table.ForeignKey(
                        name: "FK__TestSampl__Proce__5165187F",
                        column: x => x.ProcessID,
                        principalTable: "TestProcesses",
                        principalColumn: "ProcessID");
                    table.ForeignKey(
                        name: "FK__TestSampl__Reque__5070F446",
                        column: x => x.RequestID,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                });

            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    FeedbackID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ResultID = table.Column<int>(type: "int", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Feedback__6A4BEDF6DC5A65B1", x => x.FeedbackID);
                    table.ForeignKey(
                        name: "FK__Feedbacks__Resul__6383C8BA",
                        column: x => x.ResultID,
                        principalTable: "TestResults",
                        principalColumn: "ResultID");
                    table.ForeignKey(
                        name: "FK__Feedbacks__UserI__6477ECF3",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "SampleCollectionSamples",
                columns: table => new
                {
                    CollectedSampleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecordID = table.Column<int>(type: "int", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    YOB = table.Column<int>(type: "int", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    IDType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    IDNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IDIssuedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IDIssuedPlace = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    SampleType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Quantity = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Relationship = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    CollectedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    HasGeneticDiseaseHistory = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SampleCo__98BC8F30615E9963", x => x.CollectedSampleID);
                    table.ForeignKey(
                        name: "FK__SampleCol__Recor__59063A47",
                        column: x => x.RecordID,
                        principalTable: "SampleCollectionRecords",
                        principalColumn: "RecordID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_AuthorID",
                table: "BlogPosts",
                column: "AuthorID");

            migrationBuilder.CreateIndex(
                name: "UQ__BlogPost__BC7B5FB6628EBA0B",
                table: "BlogPosts",
                column: "Slug",
                unique: true,
                filter: "[Slug] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultRequests_CustomerID",
                table: "ConsultRequests",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultRequests_StaffID",
                table: "ConsultRequests",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_ResultID",
                table: "Feedbacks",
                column: "ResultID");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_UserID",
                table: "Feedbacks",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_RequestID",
                table: "Payments",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_PriceDetails_ServiceID",
                table: "PriceDetails",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserID",
                table: "RefreshTokens",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_RoleFeatures_FeatureID",
                table: "RoleFeatures",
                column: "FeatureID");

            migrationBuilder.CreateIndex(
                name: "IX_SampleCollectionRecords_CollectedBy",
                table: "SampleCollectionRecords",
                column: "CollectedBy");

            migrationBuilder.CreateIndex(
                name: "IX_SampleCollectionRecords_ProcessID",
                table: "SampleCollectionRecords",
                column: "ProcessID");

            migrationBuilder.CreateIndex(
                name: "IX_SampleCollectionRecords_RequestID",
                table: "SampleCollectionRecords",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_SampleCollectionSamples_RecordID",
                table: "SampleCollectionSamples",
                column: "RecordID");

            migrationBuilder.CreateIndex(
                name: "IX_SystemLogs_UserID",
                table: "SystemLogs",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_TestProcesses_RequestID",
                table: "TestProcesses",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_TestProcesses_StaffID",
                table: "TestProcesses",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_TestRequests_ServiceID",
                table: "TestRequests",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_TestRequests_TypeID",
                table: "TestRequests",
                column: "TypeID");

            migrationBuilder.CreateIndex(
                name: "IX_TestRequests_UserID",
                table: "TestRequests",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_EnteredBy",
                table: "TestResults",
                column: "EnteredBy");

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_RequestID",
                table: "TestResults",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_VerifiedBy",
                table: "TestResults",
                column: "VerifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_TestSamples_ProcessID",
                table: "TestSamples",
                column: "ProcessID");

            migrationBuilder.CreateIndex(
                name: "IX_TestSamples_RequestID",
                table: "TestSamples",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserID",
                table: "UserProfiles",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleID",
                table: "Users",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_UserSelectedServices_ServiceID",
                table: "UserSelectedServices",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_UserSelectedServices_UserID",
                table: "UserSelectedServices",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogPosts");

            migrationBuilder.DropTable(
                name: "ConsultRequests");

            migrationBuilder.DropTable(
                name: "Feedbacks");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "PriceDetails");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "RoleFeatures");

            migrationBuilder.DropTable(
                name: "SampleCollectionSamples");

            migrationBuilder.DropTable(
                name: "SystemLogs");

            migrationBuilder.DropTable(
                name: "TestSamples");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "UserSelectedServices");

            migrationBuilder.DropTable(
                name: "TestResults");

            migrationBuilder.DropTable(
                name: "Features");

            migrationBuilder.DropTable(
                name: "SampleCollectionRecords");

            migrationBuilder.DropTable(
                name: "TestProcesses");

            migrationBuilder.DropTable(
                name: "TestRequests");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "TestType");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
