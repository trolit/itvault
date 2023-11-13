import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1688323621217 implements MigrationInterface {
  name = "CreateUsersTable1688323621217";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`fullName\` varchar(255) AS (CONCAT(firstName,' ',lastName)) VIRTUAL NOT NULL, \`roleId\` int NOT NULL, \`createdById\` int NULL, \`signUpCode\` varchar(255) NULL, \`isSignedUp\` tinyint(1) NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `INSERT INTO \`itvault\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        "itvault",
        "users",
        "GENERATED_COLUMN",
        "fullName",
        "CONCAT(firstName,' ',lastName)",
      ]
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_51d635f1d983d505fb5a2f44c52\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_51d635f1d983d505fb5a2f44c52\``
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``
    );
    await queryRunner.query(
      `DELETE FROM \`itvault\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ["GENERATED_COLUMN", "fullName", "itvault", "users"]
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
