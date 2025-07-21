using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class FixCollectMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ConsultRe__Custo__6754599E",
                table: "ConsultRequests");

            migrationBuilder.DropForeignKey(
                name: "FK__TestReque__TypeI__49C3F6B7",
                table: "TestRequests");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "RoleFeatures");

            migrationBuilder.DropTable(
                name: "SampleCollectionSamples");

            migrationBuilder.DropTable(
                name: "TestType");

            migrationBuilder.DropTable(
                name: "SampleCollectionRecords");

            migrationBuilder.DropColumn(
                name: "ReplyMessage",
                table: "ConsultRequests");

            migrationBuilder.DropColumn(
                name: "Subject",
                table: "ConsultRequests");

            migrationBuilder.RenameColumn(
                name: "IdentityFile",
                table: "UserProfiles",
                newName: "IdentityId");

            migrationBuilder.RenameColumn(
                name: "IncludeVAT",
                table: "PriceDetails",
                newName: "IncludeVat");

            migrationBuilder.RenameColumn(
                name: "CustomerID",
                table: "ConsultRequests",
                newName: "ServiceID");

            migrationBuilder.RenameIndex(
                name: "IX_ConsultRequests_CustomerID",
                table: "ConsultRequests",
                newName: "IX_ConsultRequests_ServiceID");

            migrationBuilder.RenameColumn(
                name: "ThumbnailURL",
                table: "BlogPosts",
                newName: "ThumbnailUrl");

            migrationBuilder.AddColumn<bool>(
                name: "IncludeVat",
                table: "UserSelectedServices",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CollectedAt",
                table: "TestSamples",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CollectedAt",
                table: "TestResults",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ScheduleDate",
                table: "TestRequests",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "TestRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CollectID",
                table: "TestRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsUrgent",
                table: "Services",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Services",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FeatureId",
                table: "Roles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "ConsultRequests",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "ConsultRequests",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "ConsultRequests",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ThumbnailUrl",
                table: "BlogPosts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "CollectType",
                columns: table => new
                {
                    CollectID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CollectName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CollectType", x => x.CollectID);
                });

            migrationBuilder.CreateTable(
                name: "Invoice",
                columns: table => new
                {
                    InvoiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Invoice__D796AAD5A8ABCEEA", x => x.InvoiceID);
                    table.ForeignKey(
                        name: "FK__Invoice__Request__04E4BC85",
                        column: x => x.RequestID,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                });

            migrationBuilder.CreateTable(
                name: "RequestDeclarants",
                columns: table => new
                {
                    DeclarantID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IdentityNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IdentityIssuedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IdentityIssuedPlace = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__RequestD__761301B7886F2E3A", x => x.DeclarantID);
                    table.ForeignKey(
                        name: "FK__RequestDe__Reque__75A278F5",
                        column: x => x.RequestID,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                });

            migrationBuilder.CreateTable(
                name: "SampleCollectionForm",
                columns: table => new
                {
                    CollectionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestId = table.Column<int>(type: "int", nullable: true),
                    ProcessId = table.Column<int>(type: "int", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yob = table.Column<int>(type: "int", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Idtype = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Idnumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdissuedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IdissuedPlace = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SampleType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Quantity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Relationship = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasGeneticDiseaseHistory = table.Column<bool>(type: "bit", nullable: true),
                    FingerprintImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConfirmedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SampleCollectionForm", x => x.CollectionId);
                    table.ForeignKey(
                        name: "FK_SampleCollectionForm_TestProcesses_ProcessId",
                        column: x => x.ProcessId,
                        principalTable: "TestProcesses",
                        principalColumn: "ProcessID");
                    table.ForeignKey(
                        name: "FK_SampleCollectionForm_TestRequests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "TestRequests",
                        principalColumn: "RequestID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Roles_FeatureId",
                table: "Roles",
                column: "FeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_RequestID",
                table: "Invoice",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestDeclarants_RequestID",
                table: "RequestDeclarants",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "IX_SampleCollectionForm_ProcessId",
                table: "SampleCollectionForm",
                column: "ProcessId");

            migrationBuilder.CreateIndex(
                name: "IX_SampleCollectionForm_RequestId",
                table: "SampleCollectionForm",
                column: "RequestId");

            migrationBuilder.AddForeignKey(
                name: "FK__ConsultRe__Servi__XXXXXXX",
                table: "ConsultRequests",
                column: "ServiceID",
                principalTable: "Services",
                principalColumn: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_Features_FeatureId",
                table: "Roles",
                column: "FeatureId",
                principalTable: "Features",
                principalColumn: "FeatureID");

            migrationBuilder.AddForeignKey(
                name: "FK_TestRequest_CollectType",
                table: "TestRequests",
                column: "TypeID",
                principalTable: "CollectType",
                principalColumn: "CollectID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ConsultRe__Servi__XXXXXXX",
                table: "ConsultRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Roles_Features_FeatureId",
                table: "Roles");

            migrationBuilder.DropForeignKey(
                name: "FK_TestRequest_CollectType",
                table: "TestRequests");

            migrationBuilder.DropTable(
                name: "CollectType");

            migrationBuilder.DropTable(
                name: "Invoice");

            migrationBuilder.DropTable(
                name: "RequestDeclarants");

            migrationBuilder.DropTable(
                name: "SampleCollectionForm");

            migrationBuilder.DropIndex(
                name: "IX_Roles_FeatureId",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "IncludeVat",
                table: "UserSelectedServices");

            migrationBuilder.DropColumn(
                name: "CollectedAt",
                table: "TestSamples");

            migrationBuilder.DropColumn(
                name: "CollectedAt",
                table: "TestResults");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "TestRequests");

            migrationBuilder.DropColumn(
                name: "CollectID",
                table: "TestRequests");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "FeatureId",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "ConsultRequests");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "ConsultRequests");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "ConsultRequests");

            migrationBuilder.RenameColumn(
                name: "IdentityId",
                table: "UserProfiles",
                newName: "IdentityFile");

            migrationBuilder.RenameColumn(
                name: "IncludeVat",
                table: "PriceDetails",
                newName: "IncludeVAT");

            migrationBuilder.RenameColumn(
                name: "ServiceID",
                table: "ConsultRequests",
                newName: "CustomerID");

            migrationBuilder.RenameIndex(
                name: "IX_ConsultRequests_ServiceID",
                table: "ConsultRequests",
                newName: "IX_ConsultRequests_CustomerID");

            migrationBuilder.RenameColumn(
                name: "ThumbnailUrl",
                table: "BlogPosts",
                newName: "ThumbnailURL");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "ScheduleDate",
                table: "TestRequests",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsUrgent",
                table: "Services",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReplyMessage",
                table: "ConsultRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "ConsultRequests",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ThumbnailURL",
                table: "BlogPosts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaidAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
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
                name: "SampleCollectionRecords",
                columns: table => new
                {
                    RecordID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CollectedBy = table.Column<int>(type: "int", nullable: true),
                    ProcessID = table.Column<int>(type: "int", nullable: true),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    CollectedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    ConfirmedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                name: "SampleCollectionSamples",
                columns: table => new
                {
                    CollectedSampleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecordID = table.Column<int>(type: "int", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CollectedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    HasGeneticDiseaseHistory = table.Column<bool>(type: "bit", nullable: true),
                    IDIssuedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IDIssuedPlace = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IDNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IDType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Quantity = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Relationship = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    SampleType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    YOB = table.Column<int>(type: "int", nullable: true)
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
                name: "IX_Payments_RequestID",
                table: "Payments",
                column: "RequestID");

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

            migrationBuilder.AddForeignKey(
                name: "FK__ConsultRe__Custo__6754599E",
                table: "ConsultRequests",
                column: "CustomerID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK__TestReque__TypeI__49C3F6B7",
                table: "TestRequests",
                column: "TypeID",
                principalTable: "TestType",
                principalColumn: "TypeID");
        }
    }
}
