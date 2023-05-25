import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVariantsTable1685024333420 implements MigrationInterface {
    name = 'CreateVariantsTable1685024333420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`variants\` (\`id\` varchar(36) NOT NULL, \`filename\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`variants\``);
    }

}
