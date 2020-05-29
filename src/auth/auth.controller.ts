import { Controller, Body, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReplicatePartnerJwtDto } from './dto/replicate-partner-jwt.dto';

@Controller('v1')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    // Handle Authorization Request With RSA (Public/Private Key Pair)
    @Post('/authorization')
    handleAuthorization(@Req() req): Promise<object> {
        return this.authService.handleAuthorization(req);
    }

    // Replicate Partner Authorization JWT With RSA (Public/Private Key Pair) (for testing purposes)
    @Post('/replicate/partner/jwt')
    replicatePartnerAuthorizationJwt(@Body() data: ReplicatePartnerJwtDto): Promise<{ accessToken: string }> {
        return this.authService.replicatePartnerAuthorizationJwt(data);
    }
}
