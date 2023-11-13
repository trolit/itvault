import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVariantsTable1688323924425 implements MigrationInterface {
  name = "CreateVariantsTable1688323924425";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`variants\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`filename\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdById\` int NULL, \`fileId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_6af7e68c28e5c90b2036fec7157\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_dff75863a46790f3fa899c96839\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_dff75863a46790f3fa899c96839\``
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_6af7e68c28e5c90b2036fec7157\``
    );
    await queryRunner.query(`DROP TABLE \`variants\``);
  }
}
