import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsRepository } from './credentials.repository';
import { Credentials } from 'src/entities/credentials.entity';
import { CredentialDataDto } from './dto/credential-data.dto';

@Injectable()
export class CredentialsService {
    constructor(
        @InjectRepository(CredentialsRepository)
        private repository: CredentialsRepository,
    ) { }
    
    createCredentials(credentialDataDto: CredentialDataDto): Promise<Credentials> {
        return this.repository.createCredentials(credentialDataDto);
    }
}
