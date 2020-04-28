import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { PartnersRepository } from './partners.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersRepository)
        private partnersRepository: PartnersRepository,
    ) { }

    signUp(authCredentialsDto: AuthCredentialsDto) {
        return this.partnersRepository.signUp(authCredentialsDto);
    }
}
