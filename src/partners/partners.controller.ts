import { Controller, Body, ValidationPipe, Post } from "@nestjs/common";
import { PartnersService } from "./partners.service";
import { PartnerApplicationRegisterData } from "./dto/partner-application-register.data.dto";

@Controller(`v1/partners`)
export class PartnersController {
    constructor(
        private partnersService: PartnersService,
    ) { }

    // Handle Partner Registration
    @Post('/register')
    handleRegistration(@Body(ValidationPipe) registerData: PartnerApplicationRegisterData) {
        return this.partnersService.register(registerData);
    }
}
