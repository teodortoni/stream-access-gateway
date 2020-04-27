import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PartnersService } from 'src/partners/partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersRepository } from 'src/partners/partners.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnersRepository]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PartnersService,
  ]
})
export class AuthModule {}
