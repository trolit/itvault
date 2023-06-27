import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1687880944635 implements MigrationInterface {
    name = 'UpdateUsersTable1687880944635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`fullName\` varchar(255) AS (CONCAT(firstName, ' ', lastName)) VIRTUAL NOT NULL`);
        await queryRunner.query(`INSERT INTO \`itvault\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["itvault","users","GENERATED_COLUMN","fullName","CONCAT(firstName, ' ', lastName)"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM \`itvault\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","fullName","itvault","users"]);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fullName\``);
    }

}
