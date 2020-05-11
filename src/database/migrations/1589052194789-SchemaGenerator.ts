import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaGenerator1589052194789 implements MigrationInterface {
    name = 'SchemaGenerator1589052194789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `scopes` (`id` varchar(36) NOT NULL, `name` varchar(64) NOT NULL, `revokedAt` datetime(6) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_1029065e5c13f582d843d73dee` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `access_tokens` (`id` varchar(36) NOT NULL, `clientId` varchar(36) NOT NULL, `applicationId` varchar(36) NOT NULL, `credentialsId` varchar(36) NOT NULL, `signature` varchar(255) NOT NULL, `revokedAt` datetime(6) NULL, `expiresIn` bigint(10) NOT NULL, `expiresAt` datetime(6) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `applications` (`id` varchar(36) NOT NULL, `clientId` varchar(36) NOT NULL, `name` varchar(128) NOT NULL, `revokedAt` datetime(6) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `credentials` (`id` varchar(36) NOT NULL, `clientId` varchar(36) NOT NULL, `applicationId` varchar(36) NOT NULL, `publicKey` text NOT NULL, `privateKey` text NOT NULL, `hmacSignature` text NOT NULL, `active` tinyint NOT NULL, `revokedAt` datetime(6) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `partners` (`clientId` varchar(36) NOT NULL, `name` varchar(128) NOT NULL, `secret` varchar(60) NOT NULL, `revokedAt` datetime(6) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_fdd1a3983cfb9eef42a7e1e4a4` (`clientId`), PRIMARY KEY (`clientId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `access_tokens_scopes_scopes` (`accessTokensId` varchar(36) NOT NULL, `scopesId` varchar(36) NOT NULL, INDEX `IDX_1500ab4bce4e26279fb41a7b37` (`accessTokensId`), INDEX `IDX_d340b2e0ccf6ba14d277458076` (`scopesId`), PRIMARY KEY (`accessTokensId`, `scopesId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `applications_scopes_scopes` (`applicationsId` varchar(36) NOT NULL, `scopesId` varchar(36) NOT NULL, INDEX `IDX_bbe008b4dd235f197bc4265280` (`applicationsId`), INDEX `IDX_c601b15e99b0662de669b5fc9f` (`scopesId`), PRIMARY KEY (`applicationsId`, `scopesId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `access_tokens_scopes_scopes` ADD CONSTRAINT `FK_1500ab4bce4e26279fb41a7b374` FOREIGN KEY (`accessTokensId`) REFERENCES `access_tokens`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `access_tokens_scopes_scopes` ADD CONSTRAINT `FK_d340b2e0ccf6ba14d2774580766` FOREIGN KEY (`scopesId`) REFERENCES `scopes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `applications_scopes_scopes` ADD CONSTRAINT `FK_bbe008b4dd235f197bc42652801` FOREIGN KEY (`applicationsId`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `applications_scopes_scopes` ADD CONSTRAINT `FK_c601b15e99b0662de669b5fc9f1` FOREIGN KEY (`scopesId`) REFERENCES `scopes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `applications_scopes_scopes` DROP FOREIGN KEY `FK_c601b15e99b0662de669b5fc9f1`", undefined);
        await queryRunner.query("ALTER TABLE `applications_scopes_scopes` DROP FOREIGN KEY `FK_bbe008b4dd235f197bc42652801`", undefined);
        await queryRunner.query("ALTER TABLE `access_tokens_scopes_scopes` DROP FOREIGN KEY `FK_d340b2e0ccf6ba14d2774580766`", undefined);
        await queryRunner.query("ALTER TABLE `access_tokens_scopes_scopes` DROP FOREIGN KEY `FK_1500ab4bce4e26279fb41a7b374`", undefined);
        await queryRunner.query("DROP INDEX `IDX_c601b15e99b0662de669b5fc9f` ON `applications_scopes_scopes`", undefined);
        await queryRunner.query("DROP INDEX `IDX_bbe008b4dd235f197bc4265280` ON `applications_scopes_scopes`", undefined);
        await queryRunner.query("DROP TABLE `applications_scopes_scopes`", undefined);
        await queryRunner.query("DROP INDEX `IDX_d340b2e0ccf6ba14d277458076` ON `access_tokens_scopes_scopes`", undefined);
        await queryRunner.query("DROP INDEX `IDX_1500ab4bce4e26279fb41a7b37` ON `access_tokens_scopes_scopes`", undefined);
        await queryRunner.query("DROP TABLE `access_tokens_scopes_scopes`", undefined);
        await queryRunner.query("DROP INDEX `IDX_fdd1a3983cfb9eef42a7e1e4a4` ON `partners`", undefined);
        await queryRunner.query("DROP TABLE `partners`", undefined);
        await queryRunner.query("DROP TABLE `credentials`", undefined);
        await queryRunner.query("DROP TABLE `applications`", undefined);
        await queryRunner.query("DROP TABLE `access_tokens`", undefined);
        await queryRunner.query("DROP INDEX `IDX_1029065e5c13f582d843d73dee` ON `scopes`", undefined);
        await queryRunner.query("DROP TABLE `scopes`", undefined);
    }

}
