import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandVariantEntityWithCreatedByProperty1687872465293 implements MigrationInterface {
    name = 'ExpandVariantEntityWithCreatedByProperty1687872465293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`variants\` ADD \`createdById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_6af7e68c28e5c90b2036fec7157\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_6af7e68c28e5c90b2036fec7157\``);
        await queryRunner.query(`ALTER TABLE \`variants\` DROP COLUMN \`createdById\``);
    }

}
