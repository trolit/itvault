import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteOptionToWorkspaceRelatedEntities1689510774041
  implements MigrationInterface
{
  name = "AddSoftDeleteOptionToWorkspaceRelatedEntities1689510774041";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`buckets\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` ADD \`deletedAt\` datetime(6) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` ADD \`deletedAt\` datetime(6) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD \`deletedAt\` datetime(6) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD \`deletedAt\` datetime(6) NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`deletedAt\``);
    await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`updatedAt\``);
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP COLUMN \`deletedAt\``
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` DROP COLUMN \`deletedAt\``
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` DROP COLUMN \`deletedAt\``
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` DROP COLUMN \`updatedAt\``
    );
    await queryRunner.query(
      `ALTER TABLE \`buckets\` DROP COLUMN \`createdAt\``
    );
  }
}
