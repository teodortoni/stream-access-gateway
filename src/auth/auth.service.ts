import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersRepository } from 'src/partners/partners.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PartnersRepository)
        private partnersRepository: PartnersRepository,
        private jwtService: JwtService
    ) {}
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string }> {
        const username = await this.partnersRepository.validatePartnerPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
