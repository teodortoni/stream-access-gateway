import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PartnersRepository } from "src/partners/partners.repository";
import { CredentialsRepository } from "src/credentials/credentials.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { PartnerAuthJwt } from "./dto/partner-auth-jwt.dto";
import * as jwt from "jsonwebtoken";
import * as config from "config";
import { Connection } from "typeorm";

@Injectable()
export class AuthService {
    logger = new Logger("AuthService");

    private credRepo: CredentialsRepository;

    constructor(
        @InjectRepository(PartnersRepository)
        private partnersRepository: PartnersRepository,
        private jwtService: JwtService,
        private readonly connection: Connection,
    ) { 
        /**
         * Defined like so to avoid the Repository.findOne undefined issue
         * that gets thrown if injected the same way as PartnersRepository
         */
        this.credRepo = this.connection.getCustomRepository(CredentialsRepository);
    }

    async handleAuthorization(req): Promise<object> {
        // Get JWT from Bearer
        const bearerArray = req.headers.authorization.split('Bearer');
        const signedJwt = bearerArray[1].trim();
        const decoded = jwt.decode(signedJwt, {json: true});
        const { clientId, applicationId } = decoded;
        
        // Validate Partner
        const partner = await this.partnersRepository.findOne({ clientId });
        if (!partner) {
            this.logger.debug(`Method: handleAuthorization, Partner not found, decoded data: ${JSON.stringify(decoded)}`);
            throw new UnauthorizedException();
        }

        // Validate Credentials
        const credentials = await this.credRepo.find({ where: { clientId, applicationId } });
        if (credentials.length < 1) {
            this.logger.debug(`Method: handleAuthorization, creedentials not found, decoded data: ${JSON.stringify(decoded)}`);
            throw new UnauthorizedException();
        }

        // Verify JWT
        try {
            const options: jwt.VerifyOptions = {
                algorithms: [config.get('app.jwt.algorithm')],
            };

            const decoded = await jwt.verify(signedJwt, credentials[0].publicKey, options);
            this.logger.log(`Partner with clientId (${decoded['clientId']}) has made a request for authorization. JWT verified successfully.`);

            // Create access token
            const accessToken = "someaccesstoken";

            // Return access token
            return {
                "access_token": accessToken,
                "token_type": "Bearer",
                "expires_in": config.get('app.jwt.expiresIn')
            };
        } catch (error) {
            // this.logger.debug(`Method: jwt.verify, signedJwt: ${signedJwt}, publickey: ${partner.publickey}`, error.stack);
            throw new UnauthorizedException();
        }
    }

    async handleAuthorizationWithHmac(req): Promise<object> {
        // Get JWT from Bearer
        const bearerArray = req.headers.authorization.split('Bearer');
        const signedJwt = bearerArray[1].trim();
        const decoded = jwt.decode(signedJwt, {json: true});
        const { clientId, applicationId } = decoded;
        
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
                "expires_in": config.get('app.jwt.expiresIn')
            };
        } catch (error) {
            // this.logger.debug(`Method: jwt.verify, signedJwt: ${signedJwt}, publickey: ${partner.publickey}`, error.stack);
            throw new UnauthorizedException();
        }
    }

    async replicatePartnerAuthorizationJwt(clientId: string, applicationId: string): Promise<{ accessToken: string }> {
        const partner = await this.partnersRepository.findOne(clientId);
        const credentials = await this.credRepo.find({ where: [clientId, applicationId] });

        const jwtPayload = {
            clientId: credentials[0].clientId,
            applicationId: credentials[0].applicationId,
            key: credentials[0].privateKey,
            passphrase: partner.secret
        };

        const accessToken = await this.jwtService.sign(jwtPayload);

        return { accessToken };
    }

    async replicatePartnerAuthorizationJwtWithHmac(clientId: string, applicationId: string): Promise<{ accessToken: string }> {
        const credentials = await this.credRepo.find({ where: [clientId, applicationId] });

        const jwtPayload = {
            clientId: credentials[0].clientId,
            applicationId: credentials[0].applicationId,
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
