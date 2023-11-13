import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotesTable1688324664250 implements MigrationInterface {
  name = "CreateNotesTable1688324664250";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`value\` longtext NOT NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`fileId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`notes\` ADD CONSTRAINT \`FK_f2a1f6264b833a0b7db37757952\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`notes\` ADD CONSTRAINT \`FK_70f92760c51ade86f64d3a691ca\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`notes\` ADD CONSTRAINT \`FK_794b51afaa569cb9e30490916d5\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notes\` DROP FOREIGN KEY \`FK_794b51afaa569cb9e30490916d5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`notes\` DROP FOREIGN KEY \`FK_70f92760c51ade86f64d3a691ca\``
    );
    await queryRunner.query(
      `ALTER TABLE \`notes\` DROP FOREIGN KEY \`FK_f2a1f6264b833a0b7db37757952\``
    );
    await queryRunner.query(`DROP TABLE \`notes\``);
  }
}
