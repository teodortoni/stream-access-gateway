import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersRepository } from 'src/partners/partners.repository';

// import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PartnersRepository)
        private partnersRepository: PartnersRepository,
    ) {}
    async signIn(authCredentialsDto: AuthCredentialsDto) {
        const username = await this.partnersRepository.validatePartnerPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
