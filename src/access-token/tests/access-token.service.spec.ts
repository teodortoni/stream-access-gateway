import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenService } from '../access-token.service';
import { AccessTokenRepository } from '../access-token.repository';
import { AccessTokenDataDto } from '../dto/access-token.data.dto';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';


describe('AccessTokenService', () => {
  let accessTokenRepository, accessTokenService;

  const accessTokenDataDto: AccessTokenDataDto = {
    clientId: 'testClientUuid',
    applicationId: 'testApplicationUuid',
    credentialsId: 'testCredentialsUuid',
    privateKey: 'testPrivateKey',
    iat: 6000,
    exp: 32000
  }

  const scopes = ['video_stream', 'video_edit', 'video_create']
  const accessTokenInstance = {
    clientId: accessTokenDataDto.clientId,
    applicationId: accessTokenDataDto.applicationId,
    credentialsId: accessTokenDataDto.credentialsId,
    privateKey: accessTokenDataDto.privateKey,
    iat: accessTokenDataDto.iat,
    exp: accessTokenDataDto.exp,
    scopes: scopes
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenService,
        AccessTokenRepository,
        EntityManager,
        ConfigService,
      ],
    }).compile();

    accessTokenRepository = await module.get<AccessTokenRepository>(AccessTokenRepository);
    accessTokenService = await module.get<AccessTokenService>(AccessTokenService);
  });

  it('should be defined', async () => {
    accessTokenRepository.createAccessToken = jest.fn().mockResolvedValue(accessTokenInstance);
    expect(accessTokenRepository.createAccessToken).not.toHaveBeenCalled();
    const result = await accessTokenService.createAccessToken(accessTokenDataDto, scopes);
    expect(accessTokenRepository.createAccessToken).toHaveBeenCalled();
    expect(result).toMatchObject(accessTokenInstance);
  });
});
