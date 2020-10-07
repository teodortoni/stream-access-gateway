import { Args, Query, Resolver } from "@nestjs/graphql"
import { PartnersService } from "src/partners/partners.service"
import { PartnersType } from "../types/partners.type"

@Resolver((of) => PartnersType)
export class PartnersResolver {
  constructor(private partnerService: PartnersService) {}

  @Query((returns) => PartnersType)
  getPartnerObject(@Args("clientId") clientId: string) {
    return this.partnerService.partner(clientId)
  }
}
