import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsToRolesTable1688323459863
  implements MigrationInterface
{
  name = "CreatePermissionsToRolesTable1688323459863";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e89ffea3a5fd8f54d8990e7de8\` ON \`permissions\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f3fd0fd7450378041bf4395b3c\` ON \`permissions\``
    );
    await queryRunner.query(
      `CREATE TABLE \`permissions_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`enabled\` tinyint(1) NOT NULL DEFAULT 0, \`permissionId\` int NULL, \`roleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_379d6448e4c61af062a56ae890\` (\`signature\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions_roles\` ADD CONSTRAINT \`FK_ae4dee84c7755a208c573830568\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions_roles\` ADD CONSTRAINT \`FK_311a0cfca3df2b16719b6cdb723\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions_roles\` DROP FOREIGN KEY \`FK_311a0cfca3df2b16719b6cdb723\``
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions_roles\` DROP FOREIGN KEY \`FK_ae4dee84c7755a208c573830568\``
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` DROP INDEX \`IDX_48ce552495d14eae9b187bb671\``
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` DROP INDEX \`IDX_379d6448e4c61af062a56ae890\``
    );
    await queryRunner.query(`DROP TABLE \`permissions_roles\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_f3fd0fd7450378041bf4395b3c\` ON \`permissions\` (\`name\`)`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_e89ffea3a5fd8f54d8990e7de8\` ON \`permissions\` (\`signature\`)`
    );
  }
}
