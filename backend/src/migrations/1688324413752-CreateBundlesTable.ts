import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBundlesTable1688324413752 implements MigrationInterface {
    name = 'CreateBundlesTable1688324413752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`bundles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NULL, \`note\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expire\` enum ('1-day', '2-days', '3-days', '1-week', '2-weeks', '1-month', 'never') NOT NULL, \`expiresAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('queried', 'building', 'ready', 'failed') NOT NULL, \`size\` int NOT NULL, \`workspaceId\` int NULL, \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_1acd04c0ff0966005978d0a7c3e\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_07b4f7c6e07686faf15e75f49f2\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE \`bundles_blueprints\` (\`bundlesId\` int NOT NULL, \`blueprintsId\` int NOT NULL, INDEX \`IDX_eeb7b53932ef0c54179dc2e2df\` (\`bundlesId\`), INDEX \`IDX_cf8fcc8418d854135401e0ecc3\` (\`blueprintsId\`), PRIMARY KEY (\`bundlesId\`, \`blueprintsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bundles_blueprints\` ADD CONSTRAINT \`FK_eeb7b53932ef0c54179dc2e2df2\` FOREIGN KEY (\`bundlesId\`) REFERENCES \`bundles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`bundles_blueprints\` ADD CONSTRAINT \`FK_cf8fcc8418d854135401e0ecc34\` FOREIGN KEY (\`blueprintsId\`) REFERENCES \`blueprints\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);

        await queryRunner.query(`CREATE TABLE \`bundles_variants\` (\`bundlesId\` int NOT NULL, \`variantsId\` varchar(36) NOT NULL, INDEX \`IDX_0632e06d564dbfd2697017bd8b\` (\`bundlesId\`), INDEX \`IDX_fde46b5ead165a32f8e3dcf9d6\` (\`variantsId\`), PRIMARY KEY (\`bundlesId\`, \`variantsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bundles_variants\` ADD CONSTRAINT \`FK_0632e06d564dbfd2697017bd8b2\` FOREIGN KEY (\`bundlesId\`) REFERENCES \`bundles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`bundles_variants\` ADD CONSTRAINT \`FK_fde46b5ead165a32f8e3dcf9d68\` FOREIGN KEY (\`variantsId\`) REFERENCES \`variants\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bundles_blueprints\` DROP FOREIGN KEY \`FK_cf8fcc8418d854135401e0ecc34\``);
        await queryRunner.query(`ALTER TABLE \`bundles_blueprints\` DROP FOREIGN KEY \`FK_eeb7b53932ef0c54179dc2e2df2\``);
        await queryRunner.query(`ALTER TABLE \`bundles_variants\` DROP FOREIGN KEY \`FK_fde46b5ead165a32f8e3dcf9d68\``);
        await queryRunner.query(`ALTER TABLE \`bundles_variants\` DROP FOREIGN KEY \`FK_0632e06d564dbfd2697017bd8b2\``);
        await queryRunner.query(`ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_07b4f7c6e07686faf15e75f49f2\``);
        await queryRunner.query(`ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_1acd04c0ff0966005978d0a7c3e\``);

        await queryRunner.query(`DROP INDEX \`IDX_cf8fcc8418d854135401e0ecc3\` ON \`bundles_blueprints\``);
        await queryRunner.query(`DROP INDEX \`IDX_eeb7b53932ef0c54179dc2e2df\` ON \`bundles_blueprints\``);
        await queryRunner.query(`DROP INDEX \`IDX_fde46b5ead165a32f8e3dcf9d6\` ON \`bundles_variants\``);
        await queryRunner.query(`DROP INDEX \`IDX_0632e06d564dbfd2697017bd8b\` ON \`bundles_variants\``);

        await queryRunner.query(`DROP TABLE \`bundles_blueprints\``);
        await queryRunner.query(`DROP TABLE \`bundles_variants\``);
        await queryRunner.query(`DROP TABLE \`bundles\``);
    }

}
