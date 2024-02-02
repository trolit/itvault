import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkspacesTable1688324097095 implements MigrationInterface {
  name = "CreateWorkspacesTable1688324097095";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`pinnedAt\` datetime NULL, UNIQUE INDEX \`IDX_de659ece27e93d8fe29339d0a4\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints\` ADD \`workspaceId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD \`workspaceId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints\` ADD CONSTRAINT \`FK_0754ff2b3e2eb3a6c05c7878270\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD CONSTRAINT \`FK_734c779fc5d891b8572f7ff9c5e\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_734c779fc5d891b8572f7ff9c5e\``
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints\` DROP FOREIGN KEY \`FK_0754ff2b3e2eb3a6c05c7878270\``
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` DROP COLUMN \`workspaceId\``
    );
    await queryRunner.query(
      `ALTER TABLE \`blueprints\` DROP COLUMN \`workspaceId\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_de659ece27e93d8fe29339d0a4\` ON \`workspaces\``
    );
    await queryRunner.query(`DROP TABLE \`workspaces\``);
  }
}
