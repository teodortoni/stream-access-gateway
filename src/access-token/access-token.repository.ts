import { Repository, EntityRepository, getManager, EntityManager } from "typeorm"
import { AccessTokens } from "../entities/access-tokens.entity"
import { AccessTokenDataDto } from "./dto/access-token.data.dto"
import { InternalServerErrorException, Logger } from "@nestjs/common"
import * as jwt from "jsonwebtoken"
import { ConfigService } from "@nestjs/config"

@EntityRepository(AccessTokens)
export class AccessTokenRepository extends Repository<AccessTokens> {
  private logger = new Logger("AccessTokenRepository")

  constructor(public manager: EntityManager = getManager(), private configService: ConfigService) {
    super()
  }

  async createAccessToken(accessTokenDataDto: AccessTokenDataDto): Promise<AccessTokens> {
    const { clientId, applicationId, credentialsId, exp } = accessTokenDataDto
    try {
      const accessToken = this.manager.create(AccessTokens)
      accessToken.clientId = clientId
      accessToken.applicationId = applicationId
      accessToken.credentialsId = credentialsId
      accessToken.signature = this.generateSignature(accessTokenDataDto)
      accessToken.expiresAt = new Date(exp * 1000)
      accessToken.expiresIn = this.configService.get<number>("app.jwt.expiresIn")
      await accessToken.save()
      return accessToken
    } catch (error) {
      this.logger.debug(
        `Method: createAccessToken, data: ${JSON.stringify(accessTokenDataDto)}, error code: ${
          error.code
        }`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  private generateSignature(accessTokenDataDto: AccessTokenDataDto): string {
    const jwtPayload = {
      clientId: accessTokenDataDto.clientId,
      applicationId: accessTokenDataDto.applicationId,
      credentialsId: accessTokenDataDto.credentialsId,
      scopes: accessTokenDataDto.scopes,
      iat: accessTokenDataDto.iat,
      exp: accessTokenDataDto.exp
    }

    const signature = jwt.sign(
      jwtPayload,
      {
        key: accessTokenDataDto.privateKey,
        passphrase: accessTokenDataDto.passphrase
      },
      {
        algorithm: this.configService.get<jwt.Algorithm>("app.jwt.algorithm")
      }
    )
    return signature
  }

  async getPartnerAccessTokens(clientId: string): Promise<AccessTokens[]> {
    try {
      return await this.manager.find(AccessTokens, { where: { clientId } })
    } catch (error) {
      this.logger.debug(`Method: getPartnerAccessTokens, clientId: ${clientId}`, error.stack)
      throw new InternalServerErrorException()
    }
  }
}
