import { Controller, Body, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as config from 'config';
import { ReplicatePartnerJwtDto } from './dto/replicate-partner-jwt.dto';

const versionTag = config.get('api.version');

@Controller(versionTag)
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    // Handle Authorization Request With RSA (Public/Private Key Pair)
    @Post('/authorization')
    handleAuthorization(@Req() req): Promise<object> {
        return this.authService.handleAuthorization(req);
    }

    // Handle Authorization Request With Hmac Signature
    @Post('/authorization/hmac')
    handleAuthorizationWithHmac(@Req() req): Promise<object> {
        return this.authService.handleAuthorizationWithHmac(req);
    }

    // Replicate Partner Authorization JWT With RSA (Public/Private Key Pair) (for testing purposes)
    @Post('/replicate/partner/jwt')
    replicatePartnerAuthorizationJwt(@Body() data: ReplicatePartnerJwtDto): Promise<{ accessToken: string }> {
        return this.authService.replicatePartnerAuthorizationJwt(data);
    }

    // Replicate Partner Authorization JWT With Hmac Signature (for testing purposes)
    @Post('/replicate/partner/jwt/hmac')
    replicatePartnerAuthorizationJwtWithHmac(@Body() data: ReplicatePartnerJwtDto): Promise<{ accessToken: string }> {
        return this.authService.replicatePartnerAuthorizationJwtWithHmac(data);
    }
}
