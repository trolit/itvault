import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsToRolesTable1688323459863 implements MigrationInterface {
    name = 'CreatePermissionsToRolesTable1688323459863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permissions_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`enabled\` tinyint(1) NOT NULL DEFAULT 0, \`permissionSignature\` varchar(255) NULL, \`roleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` ADD CONSTRAINT \`FK_703cb1de164e1ff8d392ec471cf\` FOREIGN KEY (\`permissionSignature\`) REFERENCES \`permissions\`(\`signature\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` ADD CONSTRAINT \`FK_311a0cfca3df2b16719b6cdb723\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` DROP FOREIGN KEY \`FK_311a0cfca3df2b16719b6cdb723\``);
        await queryRunner.query(`ALTER TABLE \`permissions_roles\` DROP FOREIGN KEY \`FK_703cb1de164e1ff8d392ec471cf\``);
        await queryRunner.query(`DROP TABLE \`permissions_roles\``);
    }

}
