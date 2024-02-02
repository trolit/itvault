import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBundlesTable1688324413752 implements MigrationInterface {
  name = "CreateBundlesTable1688324413752";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bundles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NULL, \`note\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expire\` enum ('1-day', '2-days', '3-days', '1-week', '2-weeks', '1-month', 'never') NOT NULL, \`expiresAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('enqueued', 'building', 'ready', 'failed') NOT NULL, \`size\` int NOT NULL, \`workspaceId\` int NULL, \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_1acd04c0ff0966005978d0a7c3e\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_07b4f7c6e07686faf15e75f49f2\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_07b4f7c6e07686faf15e75f49f2\``
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_1acd04c0ff0966005978d0a7c3e\``
    );
    await queryRunner.query(`DROP TABLE \`bundles\``);
  }
}
