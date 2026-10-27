import { MigrationInterface, QueryRunner } from "typeorm"

export class VideoStreams1596035410059 implements MigrationInterface {
  name = "VideoStreams1596035410059"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `video_streams` (`id` varchar(36) NOT NULL, `clientId` varchar(36) NOT NULL, `applicationId` varchar(36) NOT NULL, `contentVersionId` varchar(36) NOT NULL, `token` text NOT NULL, `path` text NOT NULL, `tokenizedPath` text NULL, `expiresAt` datetime(6) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `video_streams`", undefined)
  }
}
