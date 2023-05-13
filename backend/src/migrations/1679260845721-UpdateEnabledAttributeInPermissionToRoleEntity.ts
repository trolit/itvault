import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnabledAttributeInPermissionToRoleEntity1679260845721 implements MigrationInterface {
    name = 'UpdateEnabledAttributeInPermissionToRoleEntity1679260845721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` CHANGE \`enabled\` \`enabled\` tinyint(1) NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` CHANGE \`enabled\` \`enabled\` tinyint(1) NOT NULL`);
    }

}
