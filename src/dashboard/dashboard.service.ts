import { Injectable } from "@nestjs/common"
import { PartnersService } from "src/partners/partners.service"

@Injectable()
export class DashboardService {
  constructor(private partnersService: PartnersService) {}

  async getPartnerObject(clientId: string) {
    return await this.partnersService.partner(clientId)
  }

  async deletePartnerObject(clientId: string) {
    const partnerObject = await this.getPartnerObject(clientId)
    const { applications } = partnerObject
    for (const idx in Object.keys(applications)) {
      console.log(applications[idx].scopes)
    }
    // Delete application scopes relationships

    // Delete application access tokens

    // Delete application credentials

    // Delete application(s)

    // Delete partner encryption keypair

    // Delete partner
    return applications
  }
}
