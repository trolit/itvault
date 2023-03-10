import { MigrationInterface, QueryRunner } from "typeorm";

export class InitWorkflowTable1678488304819 implements MigrationInterface {
    name = 'InitWorkflowTable1678488304819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`workflows\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_workflows\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` int NOT NULL, \`workflowId\` int NOT NULL, \`access\` enum ('1', '2') NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_workflows\` ADD CONSTRAINT \`FK_c7b86735ef9956ede50e1d2dcc3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_workflows\` ADD CONSTRAINT \`FK_23c03dbf33df0af153cb0850d83\` FOREIGN KEY (\`workflowId\`) REFERENCES \`workflows\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_workflows\` DROP FOREIGN KEY \`FK_23c03dbf33df0af153cb0850d83\``);
        await queryRunner.query(`ALTER TABLE \`users_workflows\` DROP FOREIGN KEY \`FK_c7b86735ef9956ede50e1d2dcc3\``);
        await queryRunner.query(`DROP TABLE \`users_workflows\``);
        await queryRunner.query(`DROP TABLE \`workflows\``);
    }

}
