import { Test } from "@nestjs/testing";
import { PartnersRepository } from "../partners.repository";
import { v4 as uuid } from "uuid";
import * as bcrypt from "bcryptjs";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ApplicationsService } from "../../applications/applications.service";
import { CredentialsService } from "../../credentials/credentials.service";
import { EncryptionKeypairService } from "../../encryptionkeypair/encryptionkeypair.service";

// Mocks the uuid() methood to generate clientId
jest.mock('uuid');

describe('PartnersRepository', () => {
    let partnersRepository, applicationsService, credentialsService, encryptionKeypairService, salt;

    const mockAuthCredentialsDto = {
        clientName: 'testClientName',
        clientApplicationName: 'testApplicationName',
        scopes: 'test_scope_get',
    };

    const mockApplicationsService = () => ({
        createApplication: jest.fn()
    });

    const mockCredentialsService = () => ({
        createCredentials: jest.fn()
    });

    const mockEncryptionKeypairService = () => ({
        createKeypair: jest.fn()
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PartnersRepository,
                { provide: ApplicationsService, useFactory: mockApplicationsService },
                { provide: CredentialsService, useFactory: mockCredentialsService },
                { provide: EncryptionKeypairService, useFactory: mockEncryptionKeypairService },
            ]
        }).compile();

        partnersRepository = await module.get<PartnersRepository>(PartnersRepository);
        applicationsService = await module.get<ApplicationsService>(ApplicationsService);
        credentialsService = await module.get<CredentialsService>(CredentialsService);
        encryptionKeypairService = await module.get<EncryptionKeypairService>(EncryptionKeypairService);

        salt = await bcrypt.genSalt();
    });

    describe('hashedPassword', () => {
        it('Generate hashed password', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testhash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await partnersRepository.hashedPassword('testpassword', salt);
            expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', salt);
            expect(result).toEqual('testhash');
        });
    });

    describe('register', () => {
        let save, clientId, applicationId, clientSecret, encryptionPublicKey, hash;

        beforeEach(async () => {
            // Mock variables
            clientId = 'testClientUuid';
            applicationId = 'testApplicationUuid';
            clientSecret = 'testClientSecret';
            encryptionPublicKey = 'testEncryptionPublicKey';

            save = jest.fn();
            partnersRepository.create = jest.fn().mockReturnValue({ clientId, save });

            // Mock generation of clientId
            uuid.mockReturnValue(clientId);
            
            // Mock hashedPassword
            partnersRepository.hashedPassword = jest.fn().mockResolvedValue(hash);
        });

        it('Partner and application with scopes was successful', async () => {
            // Mock partners entity save method
            save.mockResolvedValue(true);

            // Mock createApplication method of applicationsService
            applicationsService.createApplication.mockResolvedValue({ id: applicationId });

            // Mock createCredentials method of credentialsService
            credentialsService.createCredentials.mockResolvedValue({ privateKey: clientSecret });

            // Mock createKeypair method of encryptionKeypairService
            encryptionKeypairService.createKeypair.mockResolvedValue({ publicKey: encryptionPublicKey });

            expect(applicationsService.createApplication).not.toHaveBeenCalled();
            expect(credentialsService.createCredentials).not.toHaveBeenCalled();
            expect(encryptionKeypairService.createKeypair).not.toHaveBeenCalled();
            const result = await partnersRepository.register(
                mockAuthCredentialsDto,
                applicationsService,
                credentialsService,
                encryptionKeypairService
            );
            expect(applicationsService.createApplication).toHaveBeenCalled();
            expect(credentialsService.createCredentials).toHaveBeenCalled();
            expect(encryptionKeypairService.createKeypair).toHaveBeenCalled();
            expect(result).toMatchObject({
                clientId,
                applicationId,
                clientSecret,
                encryptionPublicKey
            });
        });

        it('Partner and application with scopes failed because of partner name conflict', () => {
            // Mock partners entity save method
            save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });
            expect(partnersRepository.register(mockAuthCredentialsDto)).rejects.toThrow(new ConflictException('Partner name entered is already taken.'));
        });

        it('Partner and application with scopes failed with InternalServerErrorException', () => {
            save.mockRejectedValue({ code: 'any' });
            expect(partnersRepository.register(mockAuthCredentialsDto)).rejects.toThrow(new InternalServerErrorException);
        });
    });
});