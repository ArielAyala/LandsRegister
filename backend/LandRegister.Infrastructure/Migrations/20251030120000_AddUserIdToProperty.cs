using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandRegister.Infrastructure.Migrations
{
    public partial class AddUserIdToProperty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1) Add nullable UserId so we can backfill from the existing 'User' text column
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Properties",
                type: "uuid",
                nullable: true);

            // 2) Backfill: try to map string username stored in the old User column to Users.Username
            // If your old user values were emails instead, change the join to match on Email instead.
            migrationBuilder.Sql(@"
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'Properties' AND column_name = 'User'
    ) THEN
        UPDATE ""Properties"" p
        SET ""UserId"" = u.""Id""
        FROM ""Users"" u
        WHERE u.""Username"" = p.""User"";
    END IF;
END
$$;
");

            // 3) For any remaining properties that couldn't be matched, assign a fallback user (first user)
            migrationBuilder.Sql(@"
DO $$
BEGIN
    -- If there are still properties without a UserId, assign the first user as fallback
    IF EXISTS (SELECT 1 FROM ""Properties"" WHERE ""UserId"" IS NULL) THEN
        UPDATE ""Properties"" p
        SET ""UserId"" = (SELECT ""Id"" FROM ""Users"" LIMIT 1)
        WHERE ""UserId"" IS NULL;
    END IF;
END
$$;
");

            // 4) Now it's safe to drop the old textual User column
            migrationBuilder.DropColumn(
                name: "User",
                table: "Properties");

            // 5) Make UserId non-nullable now that every row has a value
            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Properties",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Properties_UserId",
                table: "Properties",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Users_UserId",
                table: "Properties",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse: remove FK/index, make UserId nullable, recreate the textual User column and
            // attempt to populate it from the Users table (Username) where possible.
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Users_UserId",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_UserId",
                table: "Properties");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Properties",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "Properties",
                type: "text",
                nullable: true);

            // Populate the textual User column where possible
            migrationBuilder.Sql(@"
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'Properties' AND column_name = 'User'
    ) THEN
        UPDATE ""Properties"" p
        SET ""User"" = u.""Username""
        FROM ""Users"" u
        WHERE p.""UserId"" = u.""Id"";
    END IF;
END
$$;
");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Properties");
        }
    }
}
