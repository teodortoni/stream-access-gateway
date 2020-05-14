import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationRepository } from './application.repository';
import { ApplicationDataDto } from './dto/application-data.dto';
import { Applications } from 'src/entities/applications.entity';
import { ApplicationScopesDto } from './dto/application-scopes.dto';
import { Scopes } from 'src/entities/scopes.entity';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(ApplicationRepository)
        private repository: ApplicationRepository,
    ) { }
    
    createApplication(applicationDataDto: ApplicationDataDto): Promise<Applications> {
        return this.repository.createApplication(applicationDataDto);
    }

    createApplicationScopesRelationship(applicationScopesDto: ApplicationScopesDto): Promise<Scopes[]> {
        return this.repository.createApplicationScopesRelationship(applicationScopesDto);
    }

    getApplicationScopesNames(applicationId: string): Promise<any[]> {
        return this.repository.getApplicationScopesNames(applicationId);
    }
}
