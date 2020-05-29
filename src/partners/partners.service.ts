import { Injectable } from '@nestjs/common';
import { PartnersRepository } from './partners.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerApplicationRegisterData } from './dto/partner-application-register.data.dto';
import { ApplicationsService } from '../applications/applications.service';
import { CredentialsService } from '../credentials/credentials.service';
import { EncryptionKeypairService } from '../encryptionkeypair/encryptionkeypair.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersRepository)
        private partnersRepository: PartnersRepository,
        private applicationsService: ApplicationsService,
        private credentialsService: CredentialsService,
        private encryptionKeypairService: EncryptionKeypairService,
    ) { }

    register(registerData: PartnerApplicationRegisterData) {
        return this.partnersRepository.register(
            registerData,
            this.applicationsService,
            this.credentialsService,
            this.encryptionKeypairService
        );
    }
}
