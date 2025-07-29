using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DNATestSystem.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class delete_UserSelection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSelectedServices");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserSelectedServices",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceID = table.Column<int>(type: "int", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    ConvertedToRequest = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    IncludeVat = table.Column<bool>(type: "bit", nullable: true),
                    Note = table.Column<string>(type: "text", nullable: true),
                    SelectedAt = table.Column<DateTime>(type: "datetime", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_UserSelectedServices_ServiceID",
                table: "UserSelectedServices",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_UserSelectedServices_UserID",
                table: "UserSelectedServices",
                column: "UserID");
        }
    }
}
