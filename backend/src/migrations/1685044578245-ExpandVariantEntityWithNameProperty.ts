import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandVariantEntityWithNameProperty1685044578245 implements MigrationInterface {
    name = 'ExpandVariantEntityWithNameProperty1685044578245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`variants\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`variants\` DROP COLUMN \`name\``);
    }

}
