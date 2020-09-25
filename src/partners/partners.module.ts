import { Module } from "@nestjs/common"
import { PartnersController } from "./partners.controller"
import { PartnersService } from "./partners.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PartnersRepository } from "./partners.repository"
import { ApplicationsModule } from "src/applications/applications.module"
import { ApplicationsService } from "src/applications/applications.service"
import { CredentialsService } from "src/credentials/credentials.service"
import { CredentialsModule } from "src/credentials/credentials.module"
import { ScopesRepository } from "src/scopes/scopes.repository"
import { EncryptionKeypairService } from "src/encryptionkeypair/encryptionkeypair.service"
import { EncryptionKeypairModule } from "src/encryptionkeypair/encryptionkeypair.module"

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
