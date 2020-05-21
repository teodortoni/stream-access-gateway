import { Repository, EntityRepository } from "typeorm";
import { AccessTokens } from "src/entities/access-tokens.entity";
import { AccessTokenDataDto } from "./dto/access-token.data.dto";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import configs from "../../config/defaultconfigs";

@EntityRepository(AccessTokens)
export class AccessTokenRepository extends Repository<AccessTokens> {
    private logger = new Logger('AccessTokenRepository');

    async createAccessToken(accessTokenDataDto: AccessTokenDataDto, scopes: []): Promise<AccessTokens> {
        const { clientId, applicationId, credentialsId, exp } = accessTokenDataDto;
        try {
            const accessToken = new AccessTokens();
            accessToken.clientId = clientId;
            accessToken.applicationId = applicationId;
            accessToken.credentialsId = credentialsId;
            accessToken.signature = await this.generateSignature(accessTokenDataDto, scopes);
            accessToken.expiresAt = new Date(exp);
            accessToken.expiresIn = configs().app.jwt.expiresIn;
            accessToken.save();
            return accessToken;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    private async generateSignature(accessTokenDataDto: AccessTokenDataDto, scopes: []): Promise<string> {
        const jwtPayload = {
            clientId: accessTokenDataDto.clientId,
            applicationId: accessTokenDataDto.applicationId,
            credentialsId: accessTokenDataDto.credentialsId,
            scopes: scopes,
            iat: accessTokenDataDto.iat,
            exp: accessTokenDataDto.exp
        };
        const accessToken = await jwt.sign(jwtPayload, accessTokenDataDto.privateKey);
        return accessToken;
    }
}