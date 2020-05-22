import { AccessTokenDataDto } from "../dto/access-token.data.dto";
import { Test } from "@nestjs/testing";
import { AccessTokenRepository } from "../access-token.repository";
import { EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InternalServerErrorException } from "@nestjs/common";

describe('Access Token Repository', () => {
  let accessTokenRepository, save, configService;

  const accessTokenDataDto: AccessTokenDataDto = {
    clientId: 'testClientUuid',
    applicationId: 'testApplicationUuid',
    credentialsId: 'testCredentialsUuid',
    privateKey: 'testPrivateKey',
    iat: 1585249057,
    exp: 1585249657,
    scopes: 'test_scopes_all'
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccessTokenRepository,
        EntityManager,
        ConfigService
      ]
    }).compile();

    accessTokenRepository = await module.get<AccessTokenRepository>(AccessTokenRepository);
    configService = await module.get<ConfigService>(ConfigService);

    save = jest.fn();
    accessTokenRepository.manager.create = jest.fn().mockReturnValue({ save });
  });

  describe('Create Access Token', () => {
    beforeEach(() => {
      // Mock generateSignature
      accessTokenRepository.generateSignature = jest.fn().mockReturnValue('testSignature');
    });

    it('Access Token created successfully', async () => {
      save.mockResolvedValue(true)
      configService.get = jest.fn().mockReturnValue(2630000);
      expect(accessTokenRepository.generateSignature).not.toHaveBeenCalled();
      const result = await accessTokenRepository.createAccessToken(accessTokenDataDto);
      expect(accessTokenRepository.generateSignature).toHaveBeenCalled();
      expect(result).toMatchObject({
        clientId: 'testClientUuid',
        applicationId: 'testApplicationUuid',
        credentialsId: 'testCredentialsUuid',
        signature: 'testSignature',
        expiresAt: new Date(1585249657),
        expiresIn: 2630000
      });

    });

    it('Access Token failed with InternalServerErrorException', () => {
      save.mockRejectedValue({ code: undefined });

      expect(accessTokenRepository.generateSignature).not.toHaveBeenCalled();
      expect(accessTokenRepository.createAccessToken(accessTokenDataDto)).rejects.toThrow(new InternalServerErrorException);
      expect(accessTokenRepository.generateSignature).toHaveBeenCalled();
    })
  });

  describe('Create Signature', () => {
    it('Signature created successfully', async () => {

      accessTokenRepository.generateSignature = jest.fn().mockReturnValue('testSignature');
      expect(accessTokenRepository.generateSignature).not.toHaveBeenCalled();

      const result = await accessTokenRepository.generateSignature(accessTokenDataDto);
      expect(accessTokenRepository.generateSignature).toHaveBeenCalled();
      expect(result).toMatch('testSignature');
    });
  }); 
});