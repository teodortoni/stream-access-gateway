import { Controller, Body, ValidationPipe, Post, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { PartnersService } from 'src/partners/partners.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/authorization')
export class AuthController {
    constructor(
        private authService: AuthService,
        private partnersService: PartnersService,
    ) { }

    @Post('/signup/partners')
    partnerSignUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        return this.partnersService.signUp(authCredentialsDto);
    }

    @Post('/signin/partners')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    // For testing purposes. Will be removed.
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req) {
        console.log(req);
    }
}
