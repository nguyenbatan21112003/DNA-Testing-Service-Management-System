using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class updatedeatils : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CollectedAt",
                table: "TestResults");

            migrationBuilder.DropColumn(
                name: "ProcessState",
                table: "TestProcesses");

            migrationBuilder.RenameColumn(
                name: "ProcessID",
                table: "TestSamples",
                newName: "ProcessId");

            migrationBuilder.RenameIndex(
                name: "IX_TestSamples_ProcessID",
                table: "TestSamples",
                newName: "IX_TestSamples_ProcessId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProcessId",
                table: "TestSamples",
                newName: "ProcessID");

            migrationBuilder.RenameIndex(
                name: "IX_TestSamples_ProcessId",
                table: "TestSamples",
                newName: "IX_TestSamples_ProcessID");

            migrationBuilder.AddColumn<DateTime>(
                name: "CollectedAt",
                table: "TestResults",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProcessState",
                table: "TestProcesses",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
