import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBundlesTable1687686325797 implements MigrationInterface {
    name = 'UpdateBundlesTable1687686325797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_113463d56bd0b736d6c89139ef7\``);
        await queryRunner.query(`ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_f11cdfeb697bee5e0b8e7e7c043\``);
        await queryRunner.query(`ALTER TABLE \`bundles\` ADD \`status\` enum ('queried', 'building', 'ready', 'failed') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bundles\` CHANGE \`filename\` \`filename\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_08a2d0cbef661ccc688874cc0e4\` FOREIGN KEY (\`blueprintId\`) REFERENCES \`blueprints\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_fd80e09408ec205979b9b76d387\` FOREIGN KEY (\`variantId\`) REFERENCES \`variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_fd80e09408ec205979b9b76d387\``);
        await queryRunner.query(`ALTER TABLE \`buckets\` DROP FOREIGN KEY \`FK_08a2d0cbef661ccc688874cc0e4\``);
        await queryRunner.query(`ALTER TABLE \`bundles\` CHANGE \`filename\` \`filename\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bundles\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_f11cdfeb697bee5e0b8e7e7c043\` FOREIGN KEY (\`variantId\`) REFERENCES \`variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`buckets\` ADD CONSTRAINT \`FK_113463d56bd0b736d6c89139ef7\` FOREIGN KEY (\`blueprintId\`) REFERENCES \`blueprints\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
