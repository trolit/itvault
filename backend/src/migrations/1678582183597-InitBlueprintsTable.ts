import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBlueprintsTable1678582183597 implements MigrationInterface {
    name = 'InitBlueprintsTable1678582183597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`blueprints\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`color\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blueprints_workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`blueprintId\` int NOT NULL, \`workspaceId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blueprints_workspaces\` ADD CONSTRAINT \`FK_6f15b9822b8c1d1d4f5d65e31ca\` FOREIGN KEY (\`blueprintId\`) REFERENCES \`blueprints\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blueprints_workspaces\` ADD CONSTRAINT \`FK_b612e07ffe529f7e5641372efa6\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blueprints_workspaces\` DROP FOREIGN KEY \`FK_b612e07ffe529f7e5641372efa6\``);
        await queryRunner.query(`ALTER TABLE \`blueprints_workspaces\` DROP FOREIGN KEY \`FK_6f15b9822b8c1d1d4f5d65e31ca\``);
        await queryRunner.query(`DROP TABLE \`blueprints_workspaces\``);
        await queryRunner.query(`DROP TABLE \`blueprints\``);
    }

}
