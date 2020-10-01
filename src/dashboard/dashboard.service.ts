import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common"
import { ApplicationRepository } from "src/applications/application.repository"
import { PartnersService } from "src/partners/partners.service"

@Injectable()
export class DashboardService {
  private logger = new Logger("DashboardService")

  constructor(
    private partnersService: PartnersService,
    private applicationsRepo: ApplicationRepository
  ) {}

  async getPartnerObject(clientId: string) {
    return await this.partnersService.partner(clientId)
  }

  async deletePartnerObject(clientId: string) {
    try {
      const partnerObject = await this.getPartnerObject(clientId)
      const { applications } = partnerObject
      for (const idx in Object.keys(applications)) {
        // Delete application scopes relationships
        const scopesQuery = `DELETE FROM applications_scopes_scopes WHERE applicationsId="${applications[idx].id}"`
        await this.applicationsRepo.query(scopesQuery)

        // Delete application access tokens
        const accessTokensQuery = `DELETE FROM access_tokens WHERE clientId="${partnerObject.clientId}" AND applicationId="${applications[idx].id}"`
        await this.applicationsRepo.query(accessTokensQuery)

        // Delete application credentials
        const credentialsQuery = `DELETE FROM credentials WHERE clientId="${partnerObject.clientId}" AND applicationId="${applications[idx].id}"`
        await this.applicationsRepo.query(credentialsQuery)
      }

      // Delete application(s)
      const removedApplicationEntity = await this.applicationsRepo.manager.remove(applications)

      // Delete partner encryption keypair
      if (partnerObject.encryptionKeypair !== null) {
        const encryptionKeypairQuery = `DELETE FROM encryption_keypair WHERE clientId="${partnerObject.clientId}" AND id="${partnerObject.encryptionKeypair.id}"`
        await this.applicationsRepo.query(encryptionKeypairQuery)
      }

      // Delete partner
      const removedParterEntity = await this.partnersService.delete(partnerObject)

      return {
        status: "success",
        message: "Partner object deleted successfully",
        removedApplicationEntity,
        removedParterEntity
      }
    } catch (error) {
      this.logger.error(`Method: deletePartnerObject, `, error.stack)
      throw new InternalServerErrorException()
    }
  }
}
