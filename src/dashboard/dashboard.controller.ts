import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common"
import { DashboardService } from "./dashboard.service"

@Controller("v1/dashboard")
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get("/partner/:clientId")
  getPartnerObject(@Param("clientId", ParseUUIDPipe) clientId: string) {
    return this.dashboardService.getPartnerObject(clientId)
  }
}
