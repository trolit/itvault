import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFilesTable1688323799964 implements MigrationInterface {
  name = "CreateFilesTable1688323799964";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`files\` (\`id\` int NOT NULL AUTO_INCREMENT, \`originalFilename\` varchar(255) NOT NULL, \`relativePath\` varchar(255) NOT NULL DEFAULT '.', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`files\``);
  }
}
