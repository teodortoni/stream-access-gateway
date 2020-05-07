import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationRepository } from './application.repository';
import { ApplicationDataDto } from './dto/application.data.dto';
import { Applications } from 'src/entities/applications.entity';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(ApplicationRepository)
        private repository: ApplicationRepository,
    ) { }
    
    createApplication(applicationDataDto: ApplicationDataDto): Promise<Applications> {
        return this.repository.createApplication(applicationDataDto);
    }
}
