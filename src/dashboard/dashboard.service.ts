import { Injectable } from "@nestjs/common"
import { AccessTokenService } from "src/access-token/access-token.service"
import { ApplicationsService } from "src/applications/applications.service"
import { CredentialsService } from "src/credentials/credentials.service"
import { EncryptionKeypairService } from "src/encryptionkeypair/encryptionkeypair.service"
import { PartnersService } from "src/partners/partners.service"

@Injectable()
export class DashboardService {
  constructor(
    private partnersService: PartnersService,
    private applicationsService: ApplicationsService,
    private credentialsService: CredentialsService,
    private accessTokensService: AccessTokenService,
    private encryptionKeypairService: EncryptionKeypairService
  ) {}

  async getPartnerObject(clientId: string) {
    const partner = await this.partnersService.partner(clientId)
    const applications = await this.applicationsService.getPartnerApplications(clientId)
    const credentials = await this.credentialsService.getPartnerCredentials(clientId)
    const accessTokens = await this.accessTokensService.getPartnerAccessTokens(clientId)
    const encryptionkeypair = await this.encryptionKeypairService.getPartnerEncryptionKeypairs(
      clientId
    )
    Object.assign(partner, { applications, credentials, accessTokens, encryptionkeypair })
    return partner
  }
}
