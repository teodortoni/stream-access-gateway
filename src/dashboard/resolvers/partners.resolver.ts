import { ParseUUIDPipe } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { DashboardService } from "../dashboard.service"
import { PartnersType } from "../types/partners.type"

@Resolver((of) => PartnersType)
export class PartnersResolver {
  constructor(private dashboardService: DashboardService) {}

  @Query((returns) => PartnersType)
  getPartnerObject(@Args("clientId") clientId: string) {
    return this.dashboardService.getPartnerObject(clientId)
  }
}
