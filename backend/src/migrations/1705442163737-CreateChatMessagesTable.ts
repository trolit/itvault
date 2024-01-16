import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatMessagesTable1705442163737
  implements MigrationInterface
{
  name = "CreateChatMessagesTable1705442163737";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chat_messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`value\` longtext NOT NULL, \`repliesCount\` int NOT NULL DEFAULT '0', \`workspaceId\` int NULL, \`createdById\` int NULL, \`replyToId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_af9f7aa7aafd85f11cb9df9e5b0\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_5bcea85525fc4290894ba6d96b5\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_17a42899ce72cd55dc25fb33139\` FOREIGN KEY (\`replyToId\`) REFERENCES \`chat_messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_17a42899ce72cd55dc25fb33139\``
    );

    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_5bcea85525fc4290894ba6d96b5\``
    );

    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_af9f7aa7aafd85f11cb9df9e5b0\``
    );

    await queryRunner.query(`DROP TABLE \`chat_messages\``);
  }
}
