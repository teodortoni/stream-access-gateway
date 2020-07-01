import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { CredentialsRepository } from 'src/credentials/credentials.repository';
import { Connection } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private credRepo: CredentialsRepository,
    private readonly connection: Connection,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        const decodedToken: any = jwt.decode(jwtToken)
        const { clientId, applicationId } = decodedToken
        const credentials = await this.credRepo.find({ where: { clientId, applicationId } });
        done(null, credentials[0].publicKey)
      },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.credRepo = this.connection.getCustomRepository(CredentialsRepository);
  }

  async validate(payload: any) {
    return payload;
  }
}