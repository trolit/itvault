import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBucketsTable1688324598160 implements MigrationInterface {
  name = "CreateBucketsTable1688324598160";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`buckets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` json NOT NULL, \`blueprintId\` int NULL, \`variantId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_08a2d0cbef661ccc688874cc0e4\` FOREIGN KEY (\`blueprintId\`) REFERENCES \`blueprints\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_fd80e09408ec205979b9b76d387\` FOREIGN KEY (\`variantId\`) REFERENCES \`variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_fd80e09408ec205979b9b76d387\``
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_08a2d0cbef661ccc688874cc0e4\``
    );
    await queryRunner.query(`DROP TABLE \`buckets\``);
  }
}
