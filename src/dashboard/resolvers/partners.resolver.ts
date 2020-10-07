import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { PartnersService } from "src/partners/partners.service"
import { DashboardService } from "../dashboard.service"
import { ActionMessageType } from "../types/action-message.type"
import { PartnersType } from "../types/partners.type"

@Resolver((of) => PartnersType)
export class PartnersResolver {
  constructor(
    private partnerService: PartnersService,
    private dashboardService: DashboardService
  ) {}

  @Query((returns) => PartnersType)
  getPartnerObject(@Args("clientId") clientId: string) {
    return this.partnerService.partner(clientId)
  }

  @Mutation((returns) => ActionMessageType)
  deletePartnerObject(@Args("clientId") clientId: string) {
    return this.dashboardService.deletePartnerObject(clientId)
  }
}
