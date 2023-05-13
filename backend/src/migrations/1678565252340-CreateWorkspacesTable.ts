import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkspacesTable1678565252340 implements MigrationInterface {
    name = 'CreateWorkspacesTable1678565252340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` int NOT NULL, \`workspaceId\` int NOT NULL, \`access\` enum ('1', '2') NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_workspaces\` ADD CONSTRAINT \`FK_1a9367232a3056f4a700819e316\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_workspaces\` ADD CONSTRAINT \`FK_a1e67451083e224ce47fa27d2dd\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_workspaces\` DROP FOREIGN KEY \`FK_a1e67451083e224ce47fa27d2dd\``);
        await queryRunner.query(`ALTER TABLE \`users_workspaces\` DROP FOREIGN KEY \`FK_1a9367232a3056f4a700819e316\``);
        await queryRunner.query(`DROP TABLE \`users_workspaces\``);
        await queryRunner.query(`DROP TABLE \`workspaces\``);
    }

}
