import { Test } from '@nestjs/testing';
import { AccessTokenService } from '../access-token.service';
import { AccessTokenRepository } from '../access-token.repository';
import { AccessTokenDataDto } from '../dto/access-token.data.dto';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';

describe('Access Token Service', () => {
    let accessTokenRepository, accessTokenService;

    const accessTokenDataDto: AccessTokenDataDto = {
        clientId: 'testClientUuid',
        applicationId: 'testApplicationUuid',
        credentialsId: 'testCredentialsUuid',
        privateKey: 'testPrivateKey',
        passphrase: 'testPassphrase',
        iat: 6000,
        exp: 32000,
        scopes: 'test_scopes_all'
    }

    const accessTokenInstance = {
        clientId: accessTokenDataDto.clientId,
        applicationId: accessTokenDataDto.applicationId,
        credentialsId: accessTokenDataDto.credentialsId,
        privateKey: accessTokenDataDto.privateKey,
        passphrase: accessTokenDataDto.passphrase,
        iat: accessTokenDataDto.iat,
        exp: accessTokenDataDto.exp,
        scopes: accessTokenDataDto.scopes
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AccessTokenService,
                AccessTokenRepository,
                EntityManager,
                ConfigService
            ],
        }).compile();

        accessTokenRepository = await module.get<AccessTokenRepository>(AccessTokenRepository);
        accessTokenService = await module.get<AccessTokenService>(AccessTokenService);
    });

    it('Create Access Token', async () => {
        accessTokenRepository.createAccessToken = jest.fn().mockResolvedValue(accessTokenInstance);
        expect(accessTokenRepository.createAccessToken).not.toHaveBeenCalled();
        const result = await accessTokenService.createAccessToken(accessTokenDataDto);
        expect(accessTokenRepository.createAccessToken).toHaveBeenCalled();
        expect(result).toMatchObject(accessTokenInstance);
    });
});
