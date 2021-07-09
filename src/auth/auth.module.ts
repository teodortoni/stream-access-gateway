import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { PartnersService } from "../partners/partners.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PartnersRepository } from "../partners/partners.repository"
import { PassportModule } from "@nestjs/passport"
import { JwtModule, JwtSecretRequestType } from "@nestjs/jwt"
import { ApplicationsService } from "../applications/applications.service"
import { ApplicationRepository } from "../applications/application.repository"
import { CredentialsService } from "../credentials/credentials.service"
import { CredentialsRepository } from "../credentials/credentials.repository"
import { CredentialsModule } from "../credentials/credentials.module"
import { ScopesModule } from "../scopes/scopes.module"
import { ScopesRepository } from "../scopes/scopes.repository"
import { AccessTokenService } from "../access-token/access-token.service"
import { AccessTokenRepository } from "../access-token/access-token.repository"
import { JwtStrategy } from "./jwt.strategy"
import configs from "../../config/defaultconfigs"
import * as jwt from "jsonwebtoken"
import { EncryptionKeypairModule } from "../encryptionkeypair/encryptionkeypair.module"

const expiresIn = `${configs().app.jwt.expiresIn}s`
const algorithm: jwt.Algorithm = configs().app.jwt.algorithm as jwt.Algorithm

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secretOrKeyProvider: (
        requestType: JwtSecretRequestType,
        tokenOrPayload: string | object | Buffer
      ) => {
        switch (requestType) {
          case JwtSecretRequestType.SIGN:
            // retrieve signing key dynamically
            const key = tokenOrPayload["key"]
            const passphrase = tokenOrPayload["passphrase"]
            delete tokenOrPayload["key"]
            delete tokenOrPayload["passphrase"]
            // In case of a private key with passphrase an object { key, passphrase } can be used (based on crypto documentation),
            // In this case be sure you pass the algorithm option.
            return { key, passphrase }
          case JwtSecretRequestType.VERIFY:
            // retrieve verify key dynamically
            return null
          default:
            // retrieve secret dynamically
            return null
        }
      },
      signOptions: {
        expiresIn,
        algorithm
      },
      verifyOptions: {
        algorithms: [algorithm]
      }
    }),
    TypeOrmModule.forFeature([PartnersRepository, CredentialsRepository]),
    CredentialsModule,
    ScopesModule,
    EncryptionKeypairModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PartnersService,
    ApplicationsService,
    ApplicationRepository,
    CredentialsService,
    CredentialsRepository,
    ScopesRepository,
    AccessTokenService,
    AccessTokenRepository,
    JwtStrategy
  ],
  exports: [PassportModule]
})
export class AuthModule {}
