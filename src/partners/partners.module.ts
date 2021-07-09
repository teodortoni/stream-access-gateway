import { Module } from "@nestjs/common"
import { PartnersController } from "./partners.controller"
import { PartnersService } from "./partners.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PartnersRepository } from "./partners.repository"
import { ApplicationsModule } from "../applications/applications.module"
import { ApplicationsService } from "../applications/applications.service"
import { CredentialsService } from "../credentials/credentials.service"
import { CredentialsModule } from "../credentials/credentials.module"
import { ScopesRepository } from "../scopes/scopes.repository"
import { EncryptionKeypairService } from "../encryptionkeypair/encryptionkeypair.service"
import { EncryptionKeypairModule } from "../encryptionkeypair/encryptionkeypair.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnersRepository]),
    ApplicationsModule,
    CredentialsModule,
    EncryptionKeypairModule
  ],
  controllers: [PartnersController],
  providers: [
    PartnersService,
    ApplicationsService,
    CredentialsService,
    ScopesRepository,
    EncryptionKeypairService
  ]
})
export class PartnersModule {}
