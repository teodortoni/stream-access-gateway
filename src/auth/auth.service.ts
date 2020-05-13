import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PartnersRepository } from "src/partners/partners.repository";
import { CredentialsRepository } from "src/credentials/credentials.repository";
import { InjectRepository } from "@nestjs/typeorm";
import * as jwt from "jsonwebtoken";
import { Connection } from "typeorm";
import { ReplicatePartnerJwtDto } from "./dto/replicate-partner-jwt.dto";
import { ApplicationRepository } from "src/applications/application.repository";
<<<<<<< HEAD
import { ConfigService } from "@nestjs/config";
=======
import { AccessTokenService } from "src/access-token/access-token.service";
import { AccessTokenDataDto } from "src/access-token/dto/access-token.data.dto";
>>>>>>> Implements AccessTokenService with the auth service to return access token

@Injectable()
export class AuthService {
    logger = new Logger("AuthService");

    private credRepo: CredentialsRepository;
    private applicationRepo: ApplicationRepository;

    constructor(
        private configService: ConfigService,
        @InjectRepository(PartnersRepository)
        private partnersRepository: PartnersRepository,
        private accessTokenService: AccessTokenService,
        private jwtService: JwtService,
        private readonly connection: Connection,
    ) { 
        /**
         * Defined like so to avoid the Repository.findOne undefined issue
         * that gets thrown if injected the same way as PartnersRepository
         */
        this.credRepo = this.connection.getCustomRepository(CredentialsRepository);
        this.applicationRepo = this.connection.getCustomRepository(ApplicationRepository);
    }

    async handleAuthorization(req): Promise<object> {
        // Get JWT from Bearer
        const bearerArray = req.headers.authorization.split('Bearer');
        const signedJwt = bearerArray[1].trim();
        const decoded = jwt.decode(signedJwt, {json: true});
        const { clientId, applicationId, scopes } = decoded;
        
        // Validate Partner
        const partner = await this.partnersRepository.findOne({ clientId });
        if (!partner) {
            this.logger.debug(`Method: handleAuthorization, Partner not found, decoded data: ${JSON.stringify(decoded)}`);
            throw new UnauthorizedException();
        }

        // Validate Credentials
        const credentials = await this.credRepo.find({ where: { clientId, applicationId } });
        if (credentials.length < 1) {
            this.logger.debug(`Method: handleAuthorization, credentials not found, decoded data: ${JSON.stringify(decoded)}`);
            throw new UnauthorizedException();
        }

        // Validate Scopes
        const scopeNames = await this.applicationRepo.getApplicationScopesNames(applicationId);
        scopes.split(',').forEach(inputScope => {
            if (!scopeNames.includes(inputScope.trim())) {
                this.logger.debug(`Method: handleAuthorization, scopes do not match, decoded data: ${JSON.stringify(decoded)}, application scopes: ${JSON.stringify(scopeNames)}`);
                throw new UnauthorizedException();
            }
        });

        // Verify JWT
        try {
            const options: jwt.VerifyOptions = {
                algorithms: [this.configService.get<string>('app.jwt.algorithm') as jwt.Algorithm],
            };

            const decodeVerified = await jwt.verify(signedJwt, credentials[0].publicKey, options);
            this.logger.log(`Partner with clientId (${decoded['clientId']}) has made a request for authorization. JWT verified successfully.`);

            // Create access token
            const accessTokenData: AccessTokenDataDto = {
                clientId: decoded.clientId,
                applicationId: decoded.applicationId,
                credentialsId: decoded.id,
                iat: decoded.iat,
                exp: decoded.exp
            };

            const accessToken = await this.accessTokenService.createAccessTokens(accessTokenData, credentials[0].privateKey);

            // Return access token
            return {
                "access_token": accessToken.signature,
                "token_type": "Bearer",
<<<<<<< HEAD
                "expires_in": this.configService.get<string>('app.jwt.expiresIn')
=======
                "expires_in": accessToken.expiresIn
>>>>>>> Implements AccessTokenService with the auth service to return access token
            };
        } catch (error) {
            this.logger.error(`Method: jwt.verify, signedJwt: ${signedJwt}, publickey: ${credentials[0].publicKey}`, error.stack);
            throw new UnauthorizedException();
        }
    }

    async handleAuthorizationWithHmac(req): Promise<object> {
        // Get JWT from Bearer
        const bearerArray = req.headers.authorization.split('Bearer');
        const signedJwt = bearerArray[1].trim();
        const decoded = jwt.decode(signedJwt, {json: true});
        const { clientId, applicationId, scopes } = decoded;
        
        // Validate Partner
        const partner = await this.partnersRepository.findOne({ clientId });
        if (!partner) {
            this.logger.debug(`Method: handleAuthorization, decoded data: ${JSON.stringify(decoded)}`);
            throw new UnauthorizedException();
        }

        // Validate Credentials
        const credentials = await this.credRepo.find({ where: { clientId, applicationId } });
        if (credentials.length < 1) {
            this.logger.debug(`Method: handleAuthorization, creedentials not found, decoded data: ${JSON.stringify(decoded)}`);
            throw new UnauthorizedException();
        }

        // Validate Scopes
        const scopeNames = await this.applicationRepo.getApplicationScopesNames(applicationId);
        scopes.split(',').forEach(inputScope => {
            if (!scopeNames.includes(inputScope.trim())) {
                this.logger.debug(`Method: handleAuthorization, scopes do not match, decoded data: ${JSON.stringify(decoded)}, application scopes: ${JSON.stringify(scopeNames)}`);
                throw new UnauthorizedException();
            }
        });

        // Verify JWT
        try {
            const options: jwt.VerifyOptions = {
                algorithms: ['HS256'],
            };

            const decoded = await jwt.verify(signedJwt, credentials[0].hmacSignature, options);
            this.logger.log(`Partner with clientId (${decoded['clientId']}) has made a request for authorization. JWT verified successfully.`);

            // Create access token
            const accessToken = "someaccesstoken";

            // Return access token
            return {
                "access_token": accessToken,
                "token_type": "Bearer",
                "expires_in": this.configService.get<string>('app.jwt.expiresIn')
            };
        } catch (error) {
            this.logger.error(`Method: jwt.verify, signedJwt: ${signedJwt}, publickey: ${credentials[0].publicKey}`, error.stack);
            throw new UnauthorizedException();
        }
    }

    /* ------------- BELOW THIS LINE FOR TESTING PURPOSES. MUST BE REMOVED IF NOT NEEDED ------------- */

    async replicatePartnerAuthorizationJwt(data: ReplicatePartnerJwtDto): Promise<{ accessToken: string }> {
        const { clientId, applicationId, scopes } = data;
        console.log(applicationId);
        const partner = await this.partnersRepository.findOne(clientId);
        const credentials = await this.credRepo.find({ where: { clientId, applicationId } });

        const jwtPayload = {
            clientId: credentials[0].clientId,
            applicationId: credentials[0].applicationId,
            scopes,
            key: credentials[0].privateKey,
            passphrase: partner.secret
        };

        const accessToken = await this.jwtService.sign(jwtPayload);

        return { accessToken };
    }

    async replicatePartnerAuthorizationJwtWithHmac(data: ReplicatePartnerJwtDto): Promise<{ accessToken: string }> {
        const { clientId, applicationId, scopes } = data;
        const credentials = await this.credRepo.find({ where: { clientId, applicationId } });

        const jwtPayload = {
            clientId: credentials[0].clientId,
            applicationId: credentials[0].applicationId,
            scopes,
            key: credentials[0].hmacSignature,
            passphrase: "hmacsignature"
        };

        const signOptions: jwt.SignOptions = {
            algorithm: 'HS256'
        };

        const accessToken = await this.jwtService.sign(jwtPayload, signOptions);

        return { accessToken };
    }
}
