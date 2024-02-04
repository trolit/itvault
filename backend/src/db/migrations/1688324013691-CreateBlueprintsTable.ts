import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlueprintsTable1688324013691 implements MigrationInterface {
  name = "CreateBlueprintsTable1688324013691";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blueprints\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`pinnedAt\` datetime NULL, \`description\` varchar(255) NULL, \`color\` varchar(7) NOT NULL, \`createdById\` int NULL, \`updatedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `ALTER TABLE \`blueprints\` ADD CONSTRAINT \`FK_231e27c3c29c4ab201f658f3d30\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE \`blueprints\` ADD CONSTRAINT \`FK_46d18d472abc88bb23ab63a05ab\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blueprints\` DROP FOREIGN KEY \`FK_46d18d472abc88bb23ab63a05ab\``
    );

    await queryRunner.query(
      `ALTER TABLE \`blueprints\` DROP FOREIGN KEY \`FK_231e27c3c29c4ab201f658f3d30\``
    );

    await queryRunner.query(`DROP TABLE \`blueprints\``);
  }
}
