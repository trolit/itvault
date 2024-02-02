import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsTable1688323160526 implements MigrationInterface {
  name = "CreatePermissionsTable1688323160526";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`signature\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e89ffea3a5fd8f54d8990e7de8\` (\`signature\`), \`group\` enum ('Blueprints', 'Bundles', 'Files', 'Notes', 'Roles', 'Users', 'Variants', 'Workspaces') NOT NULL, UNIQUE INDEX \`IDX_f3fd0fd7450378041bf4395b3c\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_f3fd0fd7450378041bf4395b3c\` ON \`permissions\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e89ffea3a5fd8f54d8990e7de8\` ON \`permissions\``
    );
    await queryRunner.query(`DROP TABLE \`permissions\``);
  }
}
