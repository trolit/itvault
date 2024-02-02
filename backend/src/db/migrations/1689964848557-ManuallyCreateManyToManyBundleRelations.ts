import { MigrationInterface, QueryRunner } from "typeorm";

export class ManuallyCreateManyToManyBundleRelations1689964848557
  implements MigrationInterface
{
  name = "ManuallyCreateManyToManyBundleRelations1689964848557";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blueprints_bundles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`blueprintId\` int NULL, \`bundleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`variants_bundles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`variantId\` varchar(36) NULL, \`bundleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints_bundles\` ADD CONSTRAINT \`FK_6c319ebdb94eab3e77d0282a71c\` FOREIGN KEY (\`blueprintId\`) REFERENCES \`blueprints\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints_bundles\` ADD CONSTRAINT \`FK_f62ea7cb05e5ab33b964233982b\` FOREIGN KEY (\`bundleId\`) REFERENCES \`bundles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`variants_bundles\` ADD CONSTRAINT \`FK_f32957e8950ae7657944b6f54db\` FOREIGN KEY (\`variantId\`) REFERENCES \`variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`variants_bundles\` ADD CONSTRAINT \`FK_21a51b0402e741af48bd6abff5b\` FOREIGN KEY (\`bundleId\`) REFERENCES \`bundles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`variants_bundles\` DROP FOREIGN KEY \`FK_21a51b0402e741af48bd6abff5b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`variants_bundles\` DROP FOREIGN KEY \`FK_f32957e8950ae7657944b6f54db\``
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints_bundles\` DROP FOREIGN KEY \`FK_f62ea7cb05e5ab33b964233982b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints_bundles\` DROP FOREIGN KEY \`FK_6c319ebdb94eab3e77d0282a71c\``
    );
    await queryRunner.query(`DROP TABLE \`variants_bundles\``);
    await queryRunner.query(`DROP TABLE \`blueprints_bundles\``);
  }
}
