import { MigrationInterface, QueryRunner } from "typeorm";

export class MarkWorkspacesTablePasswordColumnAsNullable1678578647291 implements MigrationInterface {
    name = 'MarkWorkspacesTablePasswordColumnAsNullable1678578647291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` CHANGE \`password\` \`password\` varchar(255) NOT NULL DEFAULT ''`);
    }

}
