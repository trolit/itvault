import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePasswordAttributeInWorkspaceEntity1678578515028 implements MigrationInterface {
    name = 'UpdatePasswordAttributeInWorkspaceEntity1678578515028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` CHANGE \`password\` \`password\` varchar(255) NOT NULL DEFAULT ''`);
    }

}
