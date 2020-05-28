import { CredentialDataDto } from "../dto/credential-data.dto";
import { Test } from "@nestjs/testing";
import { CredentialsRepository } from "../credentials.repository";
import { EntityManager } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

describe('Credentials Repository', () => {
    let credentialsRepository, save, configService;

    const credentialDataDto: CredentialDataDto = {
        clientId: 'testClientUuid',
        applicationId: 'testApplicationUuid',
        secret: 'testClientSecret'
    };

    beforeEach(async () => { 
        const module = await Test.createTestingModule({
            providers: [
                CredentialsRepository,
                EntityManager,
                ConfigService
            ]
        }).compile();

        credentialsRepository = await module.get<CredentialsRepository>(CredentialsRepository);
        configService = await module.get<ConfigService>(ConfigService);

        save = jest.fn();
        credentialsRepository.manager.create = jest.fn().mockReturnValue({ save });
    });

    describe('createCredentials', () => { 
        beforeEach(() => {
            // Mock generatePublicPrivateKeyPair
            credentialsRepository.generatePublicPrivateKeyPair = jest.fn().mockResolvedValue({
                publicKey: 'testPublicKey',
                privateKey: 'testPrivateKey'
            });
        });

        it('Credentials created successfully', async () => { 
            // Mock save
            save.mockResolvedValue(true);

            expect(credentialsRepository.generatePublicPrivateKeyPair).not.toHaveBeenCalled();
            const result = await credentialsRepository.createCredentials(credentialDataDto);
            expect(credentialsRepository.generatePublicPrivateKeyPair).toHaveBeenCalled();
            expect(result).toMatchObject({
                clientId: 'testClientUuid',
                applicationId: 'testApplicationUuid',
                publicKey: 'testPublicKey',
                privateKey: 'testPrivateKey',
                active: true
            });
        });

        it('Credentials failed with InternalServerErrorException', () => { 
            // Mock save to return InternalServerErrorException
            save.mockRejectedValue({ code: undefined });

            expect(credentialsRepository.generatePublicPrivateKeyPair).not.toHaveBeenCalled();
            expect(credentialsRepository.createCredentials(credentialDataDto)).rejects.toThrow(new InternalServerErrorException);
            expect(credentialsRepository.generatePublicPrivateKeyPair).toHaveBeenCalled();
        });
    });

    describe('generatePublicPrivateKeyPair', () => {
        it('Public/Private key pair is generated successfully', async () => { 
            const result = await credentialsRepository.generatePublicPrivateKeyPair('testClientSecret');
            expect(result).toHaveProperty('publicKey');
            expect(result).toHaveProperty('privateKey');
        });

        it('Public/Private key pair generation failed with InternalServerErrorException', () => {
            expect(credentialsRepository.generatePublicPrivateKeyPair()).rejects.toThrow(new InternalServerErrorException);
        });
    });
});