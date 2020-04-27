import { Controller, Get, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { PartnersService } from 'src/partners/partners.service';

@Controller('v1/authorization')
export class AuthController {
    constructor(
        private authService: AuthService,
        private partnersService: PartnersService,
    ) { }

    @Get('/signup/partners')
    partnerSignUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        return this.partnersService.signUp(authCredentialsDto);
    }
}
