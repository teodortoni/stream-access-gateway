import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";

export class SeedScopes1589168272935 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const ScopesSeeds = [
            'video_stream_get',
            'content_meta_get',
            'series_meta_get',
            'season_meta_get',
            'controlled_vocab_meta_get',
            'platform_meta_all'
        ];
        ScopesSeeds.forEach(async (scope) => { 
            await queryRunner.query(`INSERT INTO scopes (id, name) VALUES ('${uuid()}', '${scope}')`);
        });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("SET FOREIGN_KEY_CHECKS=0");
        await queryRunner.clearTable("scopes");
        await queryRunner.query("SET FOREIGN_KEY_CHECKS=1");
    }

}
