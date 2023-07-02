import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsToRolesTable1688323459863 implements MigrationInterface {
    name = 'CreatePermissionsToRolesTable1688323459863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permissions_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`permissionId\` int NOT NULL, \`roleId\` int NOT NULL, \`enabled\` tinyint(1) NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` ADD CONSTRAINT \`FK_ae4dee84c7755a208c573830568\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` ADD CONSTRAINT \`FK_311a0cfca3df2b16719b6cdb723\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` DROP FOREIGN KEY \`FK_311a0cfca3df2b16719b6cdb723\``);
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` DROP FOREIGN KEY \`FK_ae4dee84c7755a208c573830568\``);
        await queryRunner.query(`DROP TABLE \`permissions_roles\``);
    }

}
