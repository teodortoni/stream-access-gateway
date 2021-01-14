import { MigrationInterface, QueryRunner } from "typeorm"

export class LiveVideoStream1600049272933 implements MigrationInterface {
  name = "LiveVideoStream1600049272933"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `live_video_streams` (`id` varchar(36) NOT NULL, `clientId` varchar(36) NOT NULL, `applicationId` varchar(36) NOT NULL, `contentVersionWweid` varchar(36) NULL, `token` text NULL, `path` text NULL, `tokenizedPath` text NULL,`isActive` tinyint NULL, `expiresAt` datetime(6) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `live_video_streams`", undefined)
  }
}
