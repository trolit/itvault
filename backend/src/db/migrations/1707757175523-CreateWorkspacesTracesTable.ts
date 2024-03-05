import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkspacesTracesTable1707757175523
  implements MigrationInterface
{
  name = "CreateWorkspacesTracesTable1707757175523";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`workspaces_traces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entity\` varchar(255) NOT NULL, \`targetId\` varchar(255) NOT NULL, \`action\` enum ('create', 'update', 'delete', 'soft-delete') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`workspaceId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`workspaces_traces\` ADD CONSTRAINT \`FK_bcb1588fb1131527f97d1ffe3db\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`workspaces_traces\` ADD CONSTRAINT \`FK_c9f39d1ec0507b6306a1d461448\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`workspaces_traces\` DROP FOREIGN KEY \`FK_c9f39d1ec0507b6306a1d461448\``
    );
    await queryRunner.query(
      `ALTER TABLE \`workspaces_traces\` DROP FOREIGN KEY \`FK_bcb1588fb1131527f97d1ffe3db\``
    );
    await queryRunner.query(`DROP TABLE \`workspaces_traces\``);
  }
}
