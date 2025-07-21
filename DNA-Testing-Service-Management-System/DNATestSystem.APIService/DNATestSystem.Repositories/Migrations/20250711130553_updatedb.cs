using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class updatedb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SampleCollectionForm_TestProcesses_ProcessId",
                table: "SampleCollectionForm");

            migrationBuilder.DropForeignKey(
                name: "FK_SampleCollectionForm_TestRequests_RequestId",
                table: "SampleCollectionForm");

            migrationBuilder.DropForeignKey(
                name: "FK_TestRequest_CollectType",
                table: "TestRequests");

            migrationBuilder.DropIndex(
                name: "IX_TestRequests_TypeID",
                table: "TestRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SampleCollectionForm",
                table: "SampleCollectionForm");

            migrationBuilder.RenameColumn(
                name: "Yob",
                table: "SampleCollectionForm",
                newName: "YOB");

            migrationBuilder.RenameColumn(
                name: "RequestId",
                table: "SampleCollectionForm",
                newName: "RequestID");

            migrationBuilder.RenameColumn(
                name: "ProcessId",
                table: "SampleCollectionForm",
                newName: "ProcessID");

            migrationBuilder.RenameColumn(
                name: "Idtype",
                table: "SampleCollectionForm",
                newName: "IDType");

            migrationBuilder.RenameColumn(
                name: "Idnumber",
                table: "SampleCollectionForm",
                newName: "IDNumber");

            migrationBuilder.RenameColumn(
                name: "IdissuedPlace",
                table: "SampleCollectionForm",
                newName: "IDIssuedPlace");

            migrationBuilder.RenameColumn(
                name: "IdissuedDate",
                table: "SampleCollectionForm",
                newName: "IDIssuedDate");

            migrationBuilder.RenameColumn(
                name: "CollectionId",
                table: "SampleCollectionForm",
                newName: "CollectionID");

            migrationBuilder.RenameIndex(
                name: "IX_SampleCollectionForm_RequestId",
                table: "SampleCollectionForm",
                newName: "IX_SampleCollectionForm_RequestID");

            migrationBuilder.RenameIndex(
                name: "IX_SampleCollectionForm_ProcessId",
                table: "SampleCollectionForm",
                newName: "IX_SampleCollectionForm_ProcessID");

            migrationBuilder.AddColumn<int>(
                name: "CollectTypeId",
                table: "TestRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SampleType",
                table: "SampleCollectionForm",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Relationship",
                table: "SampleCollectionForm",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Quantity",
                table: "SampleCollectionForm",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "SampleCollectionForm",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "SampleCollectionForm",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IDType",
                table: "SampleCollectionForm",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IDNumber",
                table: "SampleCollectionForm",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IDIssuedPlace",
                table: "SampleCollectionForm",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "SampleCollectionForm",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "SampleCollectionForm",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FingerprintImage",
                table: "SampleCollectionForm",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ConfirmedBy",
                table: "SampleCollectionForm",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "SampleCollectionForm",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK__SampleCo__7DE6BC24DD0B0FC3",
                table: "SampleCollectionForm",
                column: "CollectionID");

            migrationBuilder.CreateIndex(
                name: "IX_TestRequests_CollectID",
                table: "TestRequests",
                column: "CollectID");

            migrationBuilder.CreateIndex(
                name: "IX_TestRequests_CollectTypeId",
                table: "TestRequests",
                column: "CollectTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK__SampleCol__Proce__7D439ABD",
                table: "SampleCollectionForm",
                column: "ProcessID",
                principalTable: "TestProcesses",
                principalColumn: "ProcessID");

            migrationBuilder.AddForeignKey(
                name: "FK__SampleCol__Reque__7C4F7684",
                table: "SampleCollectionForm",
                column: "RequestID",
                principalTable: "TestRequests",
                principalColumn: "RequestID");

            migrationBuilder.AddForeignKey(
                name: "FK_TestRequests_CollectType_CollectID",
                table: "TestRequests",
                column: "CollectID",
                principalTable: "CollectType",
                principalColumn: "CollectID");

            migrationBuilder.AddForeignKey(
                name: "FK_TestRequests_CollectType_CollectTypeId",
                table: "TestRequests",
                column: "CollectTypeId",
                principalTable: "CollectType",
                principalColumn: "CollectID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__SampleCol__Proce__7D439ABD",
                table: "SampleCollectionForm");

            migrationBuilder.DropForeignKey(
                name: "FK__SampleCol__Reque__7C4F7684",
                table: "SampleCollectionForm");

            migrationBuilder.DropForeignKey(
                name: "FK_TestRequests_CollectType_CollectID",
                table: "TestRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TestRequests_CollectType_CollectTypeId",
                table: "TestRequests");

            migrationBuilder.DropIndex(
                name: "IX_TestRequests_CollectID",
                table: "TestRequests");

            migrationBuilder.DropIndex(
                name: "IX_TestRequests_CollectTypeId",
                table: "TestRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK__SampleCo__7DE6BC24DD0B0FC3",
                table: "SampleCollectionForm");

            migrationBuilder.DropColumn(
                name: "CollectTypeId",
                table: "TestRequests");

            migrationBuilder.RenameColumn(
                name: "YOB",
                table: "SampleCollectionForm",
                newName: "Yob");

            migrationBuilder.RenameColumn(
                name: "RequestID",
                table: "SampleCollectionForm",
                newName: "RequestId");

            migrationBuilder.RenameColumn(
                name: "ProcessID",
                table: "SampleCollectionForm",
                newName: "ProcessId");

            migrationBuilder.RenameColumn(
                name: "IDType",
                table: "SampleCollectionForm",
                newName: "Idtype");

            migrationBuilder.RenameColumn(
                name: "IDNumber",
                table: "SampleCollectionForm",
                newName: "Idnumber");

            migrationBuilder.RenameColumn(
                name: "IDIssuedPlace",
                table: "SampleCollectionForm",
                newName: "IdissuedPlace");

            migrationBuilder.RenameColumn(
                name: "IDIssuedDate",
                table: "SampleCollectionForm",
                newName: "IdissuedDate");

            migrationBuilder.RenameColumn(
                name: "CollectionID",
                table: "SampleCollectionForm",
                newName: "CollectionId");

            migrationBuilder.RenameIndex(
                name: "IX_SampleCollectionForm_RequestID",
                table: "SampleCollectionForm",
                newName: "IX_SampleCollectionForm_RequestId");

            migrationBuilder.RenameIndex(
                name: "IX_SampleCollectionForm_ProcessID",
                table: "SampleCollectionForm",
                newName: "IX_SampleCollectionForm_ProcessId");

            migrationBuilder.AlterColumn<string>(
                name: "SampleType",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Relationship",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Quantity",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Idtype",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Idnumber",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IdissuedPlace",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FingerprintImage",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ConfirmedBy",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "SampleCollectionForm",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SampleCollectionForm",
                table: "SampleCollectionForm",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TestRequests_TypeID",
                table: "TestRequests",
                column: "TypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_SampleCollectionForm_TestProcesses_ProcessId",
                table: "SampleCollectionForm",
                column: "ProcessId",
                principalTable: "TestProcesses",
                principalColumn: "ProcessID");

            migrationBuilder.AddForeignKey(
                name: "FK_SampleCollectionForm_TestRequests_RequestId",
                table: "SampleCollectionForm",
                column: "RequestId",
                principalTable: "TestRequests",
                principalColumn: "RequestID");

            migrationBuilder.AddForeignKey(
                name: "FK_TestRequest_CollectType",
                table: "TestRequests",
                column: "TypeID",
                principalTable: "CollectType",
                principalColumn: "CollectID");
        }
    }
}
