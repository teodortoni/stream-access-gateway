import { Injectable } from '@nestjs/common';
import { PartnersRepository } from './partners.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerApplicationRegisterData } from './dto/partner-application-register.data.dto';
import { ApplicationsService } from 'src/applications/applications.service';
import { CredentialsService } from 'src/credentials/credentials.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersRepository)
        private partnersRepository: PartnersRepository,
        private applicationsService: ApplicationsService,
        private credentialsService: CredentialsService,
    ) { }

    register(registerData: PartnerApplicationRegisterData) {
        return this.partnersRepository.register(registerData, this.applicationsService, this.credentialsService);
    }
}
