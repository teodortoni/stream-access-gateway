import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccessTokenModule } from "src/access-token/access-token.module"
import { AccessTokenService } from "src/access-token/access-token.service"
import { ApplicationsModule } from "src/applications/applications.module"
import { ApplicationsService } from "src/applications/applications.service"
import { CredentialsModule } from "src/credentials/credentials.module"
import { CredentialsService } from "src/credentials/credentials.service"
import { EncryptionKeypairModule } from "src/encryptionkeypair/encryptionkeypair.module"
import { EncryptionKeypairService } from "src/encryptionkeypair/encryptionkeypair.service"
import { PartnersModule } from "src/partners/partners.module"
import { PartnersRepository } from "src/partners/partners.repository"
import { PartnersService } from "src/partners/partners.service"
import { DashboardController } from "./dashboard.controller"
import { DashboardService } from "./dashboard.service"

@Module({
  imports: [
    PartnersModule,
    ApplicationsModule,
    CredentialsModule,
    EncryptionKeypairModule,
    AccessTokenModule
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    PartnersService,
    ApplicationsService,
    CredentialsService,
    EncryptionKeypairService,
    AccessTokenService,
    PartnersRepository
  ]
})
export class DashboardModule {}
