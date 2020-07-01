import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { CredentialsRepository } from 'src/credentials/credentials.repository';
import { Connection } from 'typeorm';
import { ApplicationRepository } from 'src/applications/application.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger("JwtStrategy");
  constructor(
    private readonly authService: AuthService,
    private credRepo: CredentialsRepository,
    private applicationRepo: ApplicationRepository,
    private readonly connection: Connection,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        try {
          const decodedToken: any = jwt.decode(jwtToken)
          const { clientId, applicationId } = decodedToken;
          const credentials = await this.credRepo.find({ where: { clientId, applicationId } });
          if (credentials.length < 1) {
            this.logger.debug(`Method: secretOrKeyProvider, credentials not found`);
            throw new UnauthorizedException();
          }
          done(null, credentials[0].publicKey);
        } catch (error) {
          this.logger.error(`Method: secretOrKeyProvider, error code: ${error.code}`, error.stack);
          done(error);
        }
      },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.credRepo = this.connection.getCustomRepository(CredentialsRepository);
    this.applicationRepo = this.connection.getCustomRepository(ApplicationRepository);
  }

  async validate(payload: any) {
    const { applicationId, scopes } = payload;

    // Validate scopes
    const scopeNames = await this.applicationRepo.getApplicationScopesNames(applicationId);
    scopes.split(',').forEach(inputScope => {
      if (!scopeNames.includes(inputScope.trim())) {
        this.logger.debug(`Method: validate, scopes do not match, application scopes: ${JSON.stringify(scopeNames)}`);
        throw new UnauthorizedException();
      }
    });

    return payload;
  }
}