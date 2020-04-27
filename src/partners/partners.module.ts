import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersRepository } from './partners.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnersRepository]),
  ],
  controllers: [PartnersController],
  providers: [PartnersService]
})
export class PartnersModule {}
