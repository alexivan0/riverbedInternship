using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrudEF.Migrations
{
    public partial class Add_Column_Director_In_Table_Movie : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Director",
                table: "Movie",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Director",
                table: "Movie");
        }
    }
}
