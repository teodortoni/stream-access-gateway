import { CredentialDataDto } from "../dto/credential-data.dto";
import { Test } from "@nestjs/testing";
import { CredentialsRepository } from "../credentials.repository";
import { EntityManager } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

describe('Credentials Repository', () => {
    let credentialsRepository, save;

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

            const result = await credentialsRepository.createCredentials(credentialDataDto);
            expect(result).toHaveProperty('clientId', 'testClientUuid');
            expect(result).toHaveProperty('applicationId', 'testApplicationUuid');
            expect(result).toHaveProperty('publicKey');
            expect(result).toHaveProperty('privateKey');
            expect(result).toHaveProperty('active', true);
        });

        it('Credentials failed with InternalServerErrorException', () => { 
            // Mock save to return InternalServerErrorException
            save.mockRejectedValue({ code: undefined });

            expect(credentialsRepository.createCredentials(credentialDataDto)).rejects.toThrow(new InternalServerErrorException);
        });
    });
});