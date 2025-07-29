using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class updb1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestRequests_CollectType_CollectTypeId",
                table: "TestRequests");

            migrationBuilder.RenameColumn(
                name: "CollectTypeId",
                table: "TestRequests",
                newName: "CollectID");

            migrationBuilder.RenameIndex(
                name: "IX_TestRequests_CollectTypeId",
                table: "TestRequests",
                newName: "IX_TestRequests_CollectID");

            migrationBuilder.AddForeignKey(
                name: "FK_TestRequests_CollectType_CollectID",
                table: "TestRequests",
                column: "CollectID",
                principalTable: "CollectType",
                principalColumn: "CollectID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestRequests_CollectType_CollectID",
                table: "TestRequests");

            migrationBuilder.RenameColumn(
                name: "CollectID",
                table: "TestRequests",
                newName: "CollectTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_TestRequests_CollectID",
                table: "TestRequests",
                newName: "IX_TestRequests_CollectTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TestRequests_CollectType_CollectTypeId",
                table: "TestRequests",
                column: "CollectTypeId",
                principalTable: "CollectType",
                principalColumn: "CollectID");
        }
    }
}
