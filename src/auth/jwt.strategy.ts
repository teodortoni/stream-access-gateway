import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersRepository } from 'src/partners/partners.repository';
import { Partners } from 'src/partners/partners.entity';
import { JwtSecretRequestType } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(PartnersRepository)
    private partnersRepository: PartnersRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: ( JwtSecretRequestType ),
    })
  }

  async validate(payload: JwtPayload): Promise<Partners> {
    const { username } = payload;
    const partner = await this.partnersRepository.findOne({ username });

    if (!partner) {
      throw new UnauthorizedException();
    }

    return partner
  }
}