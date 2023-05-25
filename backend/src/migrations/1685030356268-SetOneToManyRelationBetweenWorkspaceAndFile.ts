import { MigrationInterface, QueryRunner } from "typeorm";

export class SetOneToManyRelationBetweenWorkspaceAndFile1685030356268 implements MigrationInterface {
    name = 'SetOneToManyRelationBetweenWorkspaceAndFile1685030356268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`workspaceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_734c779fc5d891b8572f7ff9c5e\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_734c779fc5d891b8572f7ff9c5e\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`workspaceId\``);
    }

}
