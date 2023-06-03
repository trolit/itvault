import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAccessPropertyFromUserToWorkspaceEntity1685798752314 implements MigrationInterface {
    name = 'RemoveAccessPropertyFromUserToWorkspaceEntity1685798752314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_workspaces\` DROP COLUMN \`access\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_workspaces\` ADD \`access\` enum ('1', '2') NOT NULL DEFAULT '1'`);
    }

}
