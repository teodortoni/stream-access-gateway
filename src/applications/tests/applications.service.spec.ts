import { ApplicationDataDto } from "../dto/application-data.dto";
import { Test } from "@nestjs/testing";
import { ApplicationsService } from "../applications.service";
import { ApplicationRepository } from "../application.repository";
import { ApplicationScopesDto } from "../dto/application-scopes.dto";

describe('Applications Service', () => { 
    let applicationsService, repository;

    const applicationDataDto: ApplicationDataDto = {
        name: 'testApplicationName',
        clientId: 'testClientUuid',
        scopes: 'test_scopes_get'
    };

    const applicationScopesDto: ApplicationScopesDto = {
        applicationId: 'testApplicationUuid',
        scopes: 'test_scopes_get'
    };

    const mockApplicationRepository = () => ({
        createApplication: jest.fn(),
        createApplicationScopesRelationship: jest.fn(),
        getApplicationScopesNames: jest.fn()
    });

    beforeEach(async () => { 
        const module = await Test.createTestingModule({ 
            providers: [
                ApplicationsService,
                { provide: ApplicationRepository, useFactory: mockApplicationRepository },
            ]
        }).compile();

        applicationsService = module.get<ApplicationsService>(ApplicationsService);
        repository = module.get<ApplicationRepository>(ApplicationRepository);
    });

    describe('createApplication', () => { 
        it('Create application was successful', async () => { 
            const mockApplication = {
                id: 'testApplicationUuid',
                clientId: 'testClientUuid',
                name: 'testApplicationName',
                revokedAt: null
            };

            // Mock createApplication of applicationRepository
            repository.createApplication.mockResolvedValue(mockApplication);

            expect(repository.createApplication).not.toHaveBeenCalled();
            const result = await applicationsService.createApplication(applicationDataDto);
            expect(repository.createApplication).toHaveBeenCalled();
            expect(result).toMatchObject(mockApplication);
        });
    });

    describe('createApplicationScopesRelationship', () => { 
        it('Create application scopes relationship was successful', async () => { 
            const mockApplicationScopes = ['test_scopes_get'];

            // Mock createApplicationScopesRelationship of applicationRepository
            repository.createApplicationScopesRelationship.mockResolvedValue(mockApplicationScopes);

            expect(repository.createApplicationScopesRelationship).not.toHaveBeenCalled();
            const result = await applicationsService.createApplicationScopesRelationship(applicationScopesDto);
            expect(repository.createApplicationScopesRelationship).toHaveBeenCalled();
            expect(result).toMatchObject(mockApplicationScopes);
        });
    });

    describe('getApplicationScopesNames', () => { 
        it('Get application\'s scopes names as an array', async () => { 
            const mockScopesNames = ['test_scopes_all', 'test_scopes_get', 'test_scopes_read'];

            // Mock createApplicationScopesRelationship of applicationRepository
            repository.getApplicationScopesNames.mockResolvedValue(mockScopesNames);

            expect(repository.getApplicationScopesNames).not.toHaveBeenCalled();
            const result = await applicationsService.getApplicationScopesNames('testApplicationUuid');
            expect(repository.getApplicationScopesNames).toHaveBeenCalled();
            expect(result).toMatchObject(mockScopesNames);
        });
    });
});