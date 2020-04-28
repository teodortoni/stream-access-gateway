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

    async signIn(authCredentialsDto: AuthCredentialsDto) {
        const username = await this.partnersRepository.validatePartnerPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
