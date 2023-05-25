import { MigrationInterface, QueryRunner } from "typeorm";

export class SetOneToManyRelationBetweenFileAndVariant1685030994778 implements MigrationInterface {
    name = 'SetOneToManyRelationBetweenFileAndVariant1685030994778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`variants\` ADD \`fileId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_dff75863a46790f3fa899c96839\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_dff75863a46790f3fa899c96839\``);
        await queryRunner.query(`ALTER TABLE \`variants\` DROP COLUMN \`fileId\``);
    }

}
