import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenRepository } from './access-token.repository';
import { AccessTokenDataDto } from './dto/access-token.data.dto';
import { AccessTokens } from 'src/entities/access-tokens.entity';

@Injectable()
export class AccessTokenService {
    constructor(
        @InjectRepository(AccessTokenRepository)
        private repository: AccessTokenRepository
    ) {}

    createAccessToken(accessTokenDataDto: AccessTokenDataDto, scopes: []): Promise<AccessTokens> {
        return this.repository.createAccessToken(accessTokenDataDto ,scopes);
    }
}
