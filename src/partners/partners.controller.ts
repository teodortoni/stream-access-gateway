import { Controller, Body, ValidationPipe, Post, Get, Param, ParseUUIDPipe } from "@nestjs/common"
import { PartnersService } from "./partners.service"
import { PartnerApplicationRegisterData } from "./dto/partner-application-register.data.dto"

@Controller(`v1/partners`)
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get("")
  getAll() {
    return this.partnersService.getAll()
  }

  @Get(":clientId/applications")
  getApplications(@Param("clientId", ParseUUIDPipe) clientId: string) {
    return this.partnersService.getApplications(clientId)
  }

  @Post("/register")
  handleRegistration(@Body(ValidationPipe) registerData: PartnerApplicationRegisterData) {
    return this.partnersService.register(registerData)
  }
}
