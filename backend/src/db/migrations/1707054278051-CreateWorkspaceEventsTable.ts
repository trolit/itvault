import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkspaceEventsTable1707054278051
  implements MigrationInterface
{
  name = "CreateWorkspaceEventsTable1707054278051";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`workspace_events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entity\` varchar(255) NOT NULL, \`targetId\` varchar(255) NOT NULL, \`action\` enum ('create', 'update', 'delete') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`workspaceId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_events\` ADD CONSTRAINT \`FK_bd31098999415c09f34522b4855\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_events\` ADD CONSTRAINT \`FK_d09fab8763132b00a028365dcfc\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`workspace_events\` DROP FOREIGN KEY \`FK_d09fab8763132b00a028365dcfc\``
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_events\` DROP FOREIGN KEY \`FK_bd31098999415c09f34522b4855\``
    );
    await queryRunner.query(`DROP TABLE \`workspace_events\``);
  }
}
