using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class SyncService_ThumbnailURL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbnailURL",
                table: "BlogPosts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailURL",
                table: "BlogPosts");
        }
    }
}
