import { MigrationInterface, QueryRunner } from "typeorm";

// @ARCH Before working on "variant coloring", I gave myself a while to elaborate whether to keep [many-many] relation between `Workspace` and `Blueprint` or turn it into [1-many]. [many-many] was applied first due to assumption that I wanted each workspace to have "common" blueprint when it is created and - that way - reduce amount of records in database. The other feature [many-many] would allow for, would be ability to share blueprints between workspaces... but after considering it few times, I've came up to conclusion that I want each workspace to be independent area and [many-many] breaks it in that case. If user would like to create another blueprint with e.g. same name but with different color we would have repetition anyway. Another thing - I think if I'd like to update blueprint, I'd prefer it to be applied only in particular workspace. At this moment [1-many] sounds more "reasonable" to me.

export class ChangeRelationBetweenBlueprintAndWorkspaceToOneToMany1686304172406 implements MigrationInterface {
    name = 'ChangeRelationBetweenBlueprintAndWorkspaceToOneToMany1686304172406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`palettes\` DROP FOREIGN KEY \`FK_211e1689e015a0463e635268425\``);
        await queryRunner.query(`ALTER TABLE \`palettes\` CHANGE \`blueprintToWorkspaceId\` \`blueprintId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`blueprints\` ADD \`workspaceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`blueprints\` ADD CONSTRAINT \`FK_0754ff2b3e2eb3a6c05c7878270\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`palettes\` ADD CONSTRAINT \`FK_113463d56bd0b736d6c89139ef7\` FOREIGN KEY (\`blueprintId\`) REFERENCES \`blueprints\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`palettes\` DROP FOREIGN KEY \`FK_113463d56bd0b736d6c89139ef7\``);
        await queryRunner.query(`ALTER TABLE \`blueprints\` DROP FOREIGN KEY \`FK_0754ff2b3e2eb3a6c05c7878270\``);
        await queryRunner.query(`ALTER TABLE \`blueprints\` DROP COLUMN \`workspaceId\``);
        await queryRunner.query(`ALTER TABLE \`palettes\` CHANGE \`blueprintId\` \`blueprintToWorkspaceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`palettes\` ADD CONSTRAINT \`FK_211e1689e015a0463e635268425\` FOREIGN KEY (\`blueprintToWorkspaceId\`) REFERENCES \`blueprints_workspaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
