import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTagsToWorkspacesTable1689352576911
  implements MigrationInterface
{
  name = "CreateTagsToWorkspacesTable1689352576911";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tags\` DROP FOREIGN KEY \`FK_d31ad143044deb9e8e8a19a72f0\``
    );
    await queryRunner.query(
      `CREATE TABLE \`tags_workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tagId\` int NULL, \`workspaceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`tags\` DROP COLUMN \`workspaceId\``);
    await queryRunner.query(
      `ALTER TABLE \`tags_workspaces\` ADD CONSTRAINT \`FK_686838464d3ddde3c8769a49a38\` FOREIGN KEY (\`tagId\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`tags_workspaces\` ADD CONSTRAINT \`FK_1e3cf86730f28ce0b4ad9727fa9\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tags_workspaces\` DROP FOREIGN KEY \`FK_1e3cf86730f28ce0b4ad9727fa9\``
    );
    await queryRunner.query(
      `ALTER TABLE \`tags_workspaces\` DROP FOREIGN KEY \`FK_686838464d3ddde3c8769a49a38\``
    );
    await queryRunner.query(
      `ALTER TABLE \`tags\` ADD \`workspaceId\` int NULL`
    );
    await queryRunner.query(`DROP TABLE \`tags_workspaces\``);
    await queryRunner.query(
      `ALTER TABLE \`tags\` ADD CONSTRAINT \`FK_d31ad143044deb9e8e8a19a72f0\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
