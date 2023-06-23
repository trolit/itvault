import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBucketsTable1686234793370 implements MigrationInterface {
  name = "CreateBucketsTable1686234793370";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`buckets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` json NOT NULL, \`variantId\` varchar(36) NULL, \`blueprintToWorkspaceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_f11cdfeb697bee5e0b8e7e7c043\` FOREIGN KEY (\`variantId\`) REFERENCES \`variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_211e1689e015a0463e635268425\` FOREIGN KEY (\`blueprintToWorkspaceId\`) REFERENCES \`blueprints_workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_211e1689e015a0463e635268425\``
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_f11cdfeb697bee5e0b8e7e7c043\``
    );
    await queryRunner.query(`DROP TABLE \`buckets\``);
  }
}
