import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDirectoriesTableAndItsRelations1691785926540 implements MigrationInterface {
    name = 'CreateDirectoriesTableAndItsRelations1691785926540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`relativePath\` \`directoryId\` varchar(255) NOT NULL DEFAULT '.'`);
        await queryRunner.query(`CREATE TABLE \`directories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`relativePath\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_18fa2cd883b0c64bb61b71248f\` (\`relativePath\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`directoryId\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`directoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_b6c20a0ad410e90398cba624358\` FOREIGN KEY (\`directoryId\`) REFERENCES \`directories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_b6c20a0ad410e90398cba624358\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`directoryId\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`directoryId\` varchar(255) NOT NULL DEFAULT '.'`);
        await queryRunner.query(`DROP INDEX \`IDX_18fa2cd883b0c64bb61b71248f\` ON \`directories\``);
        await queryRunner.query(`DROP TABLE \`directories\``);
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`directoryId\` \`relativePath\` varchar(255) NOT NULL DEFAULT '.'`);
    }

}
