import { MigrationInterface, QueryRunner } from "typeorm";

export class MarkNameAsUniqueInWorkspaceEntity1683571095013 implements MigrationInterface {
    name = 'MarkNameAsUniqueInWorkspaceEntity1683571095013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` ADD UNIQUE INDEX \`IDX_de659ece27e93d8fe29339d0a4\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` DROP INDEX \`IDX_de659ece27e93d8fe29339d0a4\``);
    }

}
