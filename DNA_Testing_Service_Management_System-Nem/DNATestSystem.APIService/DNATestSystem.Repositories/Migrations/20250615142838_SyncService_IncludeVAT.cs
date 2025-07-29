using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class SyncService_IncludeVAT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUrgent",
                table: "PriceDetails");

            migrationBuilder.AddColumn<bool>(
                name: "IncludeVAT",
                table: "PriceDetails",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IncludeVAT",
                table: "PriceDetails");

            migrationBuilder.AddColumn<bool>(
                name: "IsUrgent",
                table: "PriceDetails",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
