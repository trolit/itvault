import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNameAttributeInPermissionEntity1679260617325 implements MigrationInterface {
    name = 'UpdateNameAttributeInPermissionEntity1679260617325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP INDEX \`IDX_48ce552495d14eae9b187bb671\``);
    }

}
