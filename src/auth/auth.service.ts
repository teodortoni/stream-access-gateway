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
        const partner = await this.partnersRepository.validatePartnerPassword(authCredentialsDto);

        if (!partner.username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const privatekey = partner.privatekey;
        console.log(privatekey);
        const payload = { username: partner.username };
        const accessToken = await this.jwtService.sign(payload, { expiresIn: 3600 });

        return { accessToken };
    }
}
