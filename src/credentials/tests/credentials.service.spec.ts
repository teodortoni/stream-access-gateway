import { Test } from "@nestjs/testing";
import { CredentialsRepository } from "../credentials.repository";
import { CredentialDataDto } from "../dto/credential-data.dto";
import { CredentialsService } from "../credentials.service";
import { EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";

describe('Credentials Service', () => { 
    let credentialsRepository, credentialsService;

    const credentialDataDto: CredentialDataDto = {
        clientId: 'testClientUuid',
        applicationId: 'testApplicationUuid',
        secret: 'testClientSecret'
    };

    const credentialsInstance = {
        id: 'testUuid',
        clientId: credentialDataDto.clientId,
        applicationId: credentialDataDto.applicationId,
        publicKey: 'testPublicKey',
        privateKey: 'testPrivateKey',
        active: true
    };

    beforeEach(async () => { 
        const module = await Test.createTestingModule({
            providers: [
                CredentialsRepository,
                CredentialsService,
                EntityManager,
                ConfigService,
            ]
        }).compile();

        credentialsRepository = await module.get<CredentialsRepository>(CredentialsRepository);
        credentialsService = await module.get<CredentialsService>(CredentialsService);
    });

    it('createCredentials', async () => { 
        credentialsRepository.createCredentials = jest.fn().mockResolvedValue(credentialsInstance);
        expect(credentialsRepository.createCredentials).not.toHaveBeenCalled();
        const result = await credentialsService.createCredentials(credentialDataDto);
        expect(credentialsRepository.createCredentials).toHaveBeenCalled();
        expect(result).toMatchObject(credentialsInstance);
    });
});