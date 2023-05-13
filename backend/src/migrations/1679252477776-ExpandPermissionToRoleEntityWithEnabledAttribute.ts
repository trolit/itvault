import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandPermissionToRoleEntityWithEnabledAttribute1679252477776 implements MigrationInterface {
    name = 'ExpandPermissionToRoleEntityWithEnabledAttribute1679252477776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` ADD \`enabled\` tinyint(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` DROP COLUMN \`enabled\``);
    }

}
