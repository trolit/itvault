import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBlueprintsTable1678578515028 implements MigrationInterface {
    name = 'InitBlueprintsTable1678578515028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`blueprints\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`color\` varchar(255) NOT NULL, \`workspaceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blueprints\` ADD CONSTRAINT \`FK_0754ff2b3e2eb3a6c05c7878270\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blueprints\` DROP FOREIGN KEY \`FK_0754ff2b3e2eb3a6c05c7878270\``);
        await queryRunner.query(`DROP TABLE \`blueprints\``);
    }

}
