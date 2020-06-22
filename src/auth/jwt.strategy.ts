import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccessTokenRepository } from 'src/access-token/access-token.repository';
import * as jwt from 'jsonwebtoken';
import { AccessTokens } from 'src/entities/access-tokens.entity';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private accessTokenRepository: AccessTokenRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        const options= { 
          json: true
        }
        console.log(request)
        const decodedToken: any = jwt.decode(jwtToken, options)
        const { clientId } = decodedToken
        const accessToken = await this.accessTokenRepository.manager.findOne(AccessTokens, {
          where: { clientId: clientId }});
        console.log(accessToken, 'here')
        done(null, accessToken.signature)
      }
    });
  }

  async validate(payload: any) {
    console.log(payload)
    return payload;
  }
}