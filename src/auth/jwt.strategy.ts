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
        private credRepo: CredentialsRepository,
        private readonly connection: Connection,
    ) {
        super({
            ignoreExpiration: false,
            secretOrKeyProvider: async (request, jwtToken, done) => {
                try {
                    const decodedToken: any = jwt.decode(jwtToken);
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
    }

    async validate(payload: any) {
        return payload;
    }
}