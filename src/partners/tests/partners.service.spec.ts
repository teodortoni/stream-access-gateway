import { Test } from "@nestjs/testing";
import { PartnersService } from "../partners.service";
import { PartnersRepository } from "../partners.repository";
import { v4 as uuid } from "uuid";

describe('PartnerService', () => { 
    let partnersService;
    let partnersRepository;

    const mockAuthCredentialsDto = { 
        name: 'testName',
        username: 'testUsername',
        password: 'Th1s1sat3stpwd',
    };

    const mockPartnersRepository = () => ({
        signUp: jest.fn(),
    });

    beforeEach(async () => { 
        const module = await Test.createTestingModule({
            providers: [
                PartnersService,
                { provide: PartnersRepository, useFactory: mockPartnersRepository },
            ]
        }).compile();

        partnersService = await module.get<PartnersService>(PartnersService);
        partnersRepository = await module.get<PartnersRepository>(PartnersRepository);
    });

    describe('signUp', () => { 
        it('Username and password received successfully', async () => { 
            const mockIss = uuid();
            
            // Mock partners.repository signUp
            partnersRepository.signUp.mockResolvedValue(mockIss);

            const result = await partnersService.signUp(mockAuthCredentialsDto);

            expect(result).toEqual(mockIss);
        });
    });
});