import { Test } from "@nestjs/testing";
import { PartnersService } from "../partners.service";
import { PartnersRepository } from "../partners.repository";
import { v4 as uuid } from "uuid";
import { ApplicationsService } from "../../applications/applications.service";
import { CredentialsService } from "../../credentials/credentials.service";
import { ApplicationRepository } from "../../applications/application.repository";
import { CredentialsRepository } from "../../credentials/credentials.repository";

describe('PartnerService', () => { 
    let partnersService;
    let partnersRepository;

    const mockAuthCredentialsDto = { 
        name: 'testName',
        username: 'testUsername',
        password: 'Th1s1sat3stpwd',
    };

    const mockPartnersRepository = () => ({
        register: jest.fn(),
    });

    const mockApplicationRepository = () => ({});

    const mockCredentialsRepository = () => ({});

    beforeEach(async () => { 
        const module = await Test.createTestingModule({
            providers: [
                PartnersService,
                { provide: PartnersRepository, useFactory: mockPartnersRepository },
                ApplicationsService,
                { provide: ApplicationRepository, useFactory: mockApplicationRepository },
                CredentialsService,
                { provide: CredentialsRepository, useFactory: mockCredentialsRepository },
            ]
        }).compile();

        partnersService = await module.get<PartnersService>(PartnersService);
        partnersRepository = await module.get<PartnersRepository>(PartnersRepository);
    });

    describe('register', () => { 
        it('Partner and Application registration with Scopes', async () => { 
            const clientId = uuid();
            const applciationId = uuid();
            const clientSecret = '"-----BEGIN ENCRYPTED PRIVATE KEY-----\n"';
            const mockRegisterResults = {
                clientId,
                applciationId,
                clientSecret
            };
            
            // Mock partners.repository register
            partnersRepository.register.mockResolvedValue(mockRegisterResults);

            const result = await partnersService.register(mockAuthCredentialsDto);

            expect(result).toEqual({clientId, applciationId, clientSecret});
        });
    });
});