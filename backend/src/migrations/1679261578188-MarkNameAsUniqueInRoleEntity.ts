import { MigrationInterface, QueryRunner } from "typeorm";

export class MarkNameAsUniqueInRoleEntity1679261578188 implements MigrationInterface {
    name = 'MarkNameAsUniqueInRoleEntity1679261578188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles\` ADD UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles\` DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\``);
    }

}
