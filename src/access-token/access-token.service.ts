import { Injectable } from "@nestjs/common"
import { AccessTokenRepository } from "./access-token.repository"
import { AccessTokenDataDto } from "./dto/access-token.data.dto"
import { AccessTokens } from "../entities/access-tokens.entity"

@Injectable()
export class AccessTokenService {
  constructor(private repository: AccessTokenRepository) {}

  createAccessToken(accessTokenDataDto: AccessTokenDataDto): Promise<AccessTokens> {
    return this.repository.createAccessToken(accessTokenDataDto)
  }

  getPartnerAccessTokens(clientId: string): Promise<AccessTokens[]> {
    return this.repository.getPartnerAccessTokens(clientId)
  }
}
