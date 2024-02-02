import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTagsTable1689180061786 implements MigrationInterface {
  name = "CreateTagsTable1689180061786";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`workspaceId\` int NULL, UNIQUE INDEX \`IDX_d090e09fe86ebe2ec0aec27b45\` (\`value\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`tags\` ADD CONSTRAINT \`FK_d31ad143044deb9e8e8a19a72f0\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tags\` DROP FOREIGN KEY \`FK_d31ad143044deb9e8e8a19a72f0\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d090e09fe86ebe2ec0aec27b45\` ON \`tags\``
    );
    await queryRunner.query(`DROP TABLE \`tags\``);
  }
}
