import { Injectable, UnauthorizedException, Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PartnersRepository } from "src/partners/partners.repository"
import { CredentialsRepository } from "src/credentials/credentials.repository"
import { InjectRepository } from "@nestjs/typeorm"
import * as jwt from "jsonwebtoken"
import { Connection } from "typeorm"
import { ReplicatePartnerJwtDto } from "./dto/replicate-partner-jwt.dto"
import { ApplicationRepository } from "src/applications/application.repository"
import { AccessTokenService } from "src/access-token/access-token.service"
import { AccessTokenDataDto } from "src/access-token/dto/access-token.data.dto"
import { ConfigService } from "@nestjs/config"
import { EncryptionKeypairRepository } from "src/encryptionkeypair/encryptionkeypair.repository"

@Injectable()
export class AuthService {
  logger = new Logger("AuthService")

  private credRepo: CredentialsRepository
  private applicationRepo: ApplicationRepository
  private encryptionKeypairRepo: EncryptionKeypairRepository

  constructor(
    private configService: ConfigService,
    @InjectRepository(PartnersRepository)
    private partnersRepository: PartnersRepository,
    private accessTokenService: AccessTokenService,
    private jwtService: JwtService,
    private readonly connection: Connection
  ) {
    /**
     * Defined like so to avoid the Repository.findOne undefined issue
     * that gets thrown if injected the same way as PartnersRepository
     */
    this.credRepo = this.connection.getCustomRepository(CredentialsRepository)
    this.applicationRepo = this.connection.getCustomRepository(ApplicationRepository)
    this.encryptionKeypairRepo = this.connection.getCustomRepository(EncryptionKeypairRepository)
  }

  async handleAuthorization(req): Promise<object> {
    // Get JWT from Bearer
    const bearerArray = req.headers.authorization.split("Bearer")
    const signedJwt = bearerArray[1].trim()
    const decoded = jwt.decode(signedJwt, { json: true })
    const { clientId, applicationId, scopes } = decoded

    // Validate Partner
    const partner = await this.partnersRepository.findOne({ clientId })
    if (!partner) {
      this.logger.debug(
        `Method: handleAuthorization, Partner not found, decoded data: ${JSON.stringify(decoded)}`
      )
      throw new UnauthorizedException()
    }

    // Validate Credentials
    const credentials = await this.credRepo.find({
      where: { clientId, applicationId }
    })
    if (credentials.length < 1) {
      this.logger.debug(
        `Method: handleAuthorization, credentials not found, decoded data: ${JSON.stringify(
          decoded
        )}`
      )
      throw new UnauthorizedException()
    }

    // Validate Scopes
    const scopeNames = await this.applicationRepo.getApplicationScopesNames(applicationId)
    scopes.split(",").forEach((inputScope) => {
      if (!scopeNames.includes(inputScope.trim())) {
        this.logger.debug(
          `Method: handleAuthorization, scopes do not match, decoded data: ${JSON.stringify(
            decoded
          )}, application scopes: ${JSON.stringify(scopeNames)}`
        )
        throw new UnauthorizedException()
      }
    })

    // Get encryption keypair
    const encryptionKeypair = await this.encryptionKeypairRepo.find({
      where: { clientId }
    })
    if (encryptionKeypair.length < 1) {
      this.logger.debug(
        `Method: handleAuthorization, encryption keypair not found, decoded data: ${JSON.stringify(
          decoded
        )}`
      )
      throw new UnauthorizedException()
    }

    // Verify JWT
    try {
      const options: jwt.VerifyOptions = {
        algorithms: [this.configService.get<string>("app.jwt.algorithm") as jwt.Algorithm]
      }

      const verified = await jwt.verify(signedJwt, credentials[0].publicKey, options)
      this.logger.log(
        `Partner with clientId (${verified["clientId"]}) has made a request for authorization. JWT verified successfully.`
      )

      // Create access token
      const accessTokenData: AccessTokenDataDto = {
        clientId: verified["clientId"],
        applicationId: verified["applicationId"],
        credentialsId: credentials[0].id,
        privateKey: encryptionKeypair[0].privateKey,
        passphrase: partner.secret,
        iat: verified["iat"],
        exp: verified["exp"],
        scopes: verified["scopes"]
      }
      const accessToken = await this.accessTokenService.createAccessToken(accessTokenData)

      // Return access token
      return {
        access_token: accessToken.signature,
        token_type: "Bearer",
        expires_in: accessToken.expiresIn
      }
    } catch (error) {
      this.logger.error(`Method: jwt.verify, signedJwt: ${signedJwt}`, error.stack)
      throw new UnauthorizedException()
    }
  }

  /* ------------- BELOW THIS LINE FOR TESTING PURPOSES. MUST BE REMOVED IF NOT NEEDED ------------- */

  async replicatePartnerAuthorizationJwt(
    data: ReplicatePartnerJwtDto
  ): Promise<{ accessToken: string }> {
    const { clientId, applicationId, scopes } = data
    const partner = await this.partnersRepository.findOne(clientId)
    const credentials = await this.credRepo.find({
      where: { clientId, applicationId }
    })

    const jwtPayload = {
      clientId: credentials[0].clientId,
      applicationId: credentials[0].applicationId,
      scopes,
      key: credentials[0].privateKey,
      passphrase: partner.secret
    }

    const accessToken = await this.jwtService.sign(jwtPayload)

    return { accessToken }
  }
}
