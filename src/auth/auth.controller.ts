import { Controller, Body, ValidationPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as config from 'config';
import { AuthGuard } from '@nestjs/passport';
import { PartnerAuthJwt } from './dto/partner-auth-jwt.dto';

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
    replicatePartnerAuthorizationJwt(@Body() clientId: string, @Body() applicationId: string): Promise<{ accessToken: string }> {
        return this.authService.replicatePartnerAuthorizationJwt(clientId, applicationId);
    }

    // Replicate Partner Authorization JWT With Hmac Signature (for testing purposes)
    @Post('/replicate/partner/jwt/hmac')
    replicatePartnerAuthorizationJwtWithHmac(@Body() clientId: string, @Body() applicationId: string): Promise<{ accessToken: string }> {
        return this.authService.replicatePartnerAuthorizationJwtWithHmac(clientId, applicationId);
    }

    // Refresh access token

    /**
     *  1.  We have an endpoint that is used internally to register a partner.
     *      Here we create the CLIENT_ID, PUBLIC/PRIVATE KEY pair.
     *      We send CLIENT_ID & PUBLIC/PRIVATE_KEY to partner (manually via email)
     *      Don't save PRIVATE_KEY. Might change to HMAC signature.
     *
     *  2.  Partner receives the CLIENT_ID & PRIVATE_KEY.
     *      Generates the signature as a JWT (with scope(s)) and sends it as a request to our authorization endpoint.
     *
     *  3.  We authenticate partner with the public key and after the authentication we generate the access JWT (includes expiration)
     */

    /**
     * SCHEMA
     * 1 partner -> N applications -> N sets of credentials (but only 2 or 3 credentials can be active)?
     * 
     * 1. Partners Table
     * 
     * 2. Partner Applications Table - oneToMany
     * 
     * 3. Partner Application Credentials - oneToMany (max active credentials 3)
     */
}
