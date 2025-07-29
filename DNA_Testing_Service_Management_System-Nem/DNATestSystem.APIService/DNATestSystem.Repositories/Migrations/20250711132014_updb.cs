using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class updb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestRequests_CollectType_CollectID",
                table: "TestRequests");

            migrationBuilder.DropIndex(
                name: "IX_TestRequests_CollectID",
                table: "TestRequests");

            migrationBuilder.DropColumn(
                name: "CollectID",
                table: "TestRequests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CollectID",
                table: "TestRequests",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestRequests_CollectID",
                table: "TestRequests",
                column: "CollectID");

            migrationBuilder.AddForeignKey(
                name: "FK_TestRequests_CollectType_CollectID",
                table: "TestRequests",
                column: "CollectID",
                principalTable: "CollectType",
                principalColumn: "CollectID");
        }
    }
}
