import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePasswordPropertyFromWorkspaceEntity1687018579892 implements MigrationInterface {
    name = 'RemovePasswordPropertyFromWorkspaceEntity1687018579892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` DROP COLUMN \`password\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` ADD \`password\` varchar(255) NULL`);
    }

}
