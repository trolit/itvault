import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandRoleWithCreatedAndUpdatedInformation1699633161211
  implements MigrationInterface
{
  name = "ExpandRoleWithCreatedAndUpdatedInformation1699633161211";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`createdById\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`updatedById\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_cec119ce18936c7b6c24142be3e\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_5de46381983d514c100aaceb542\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_5de46381983d514c100aaceb542\``
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_cec119ce18936c7b6c24142be3e\``
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP COLUMN \`updatedById\``
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP COLUMN \`createdById\``
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`updatedAt\``);
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`createdAt\``);
  }
}
