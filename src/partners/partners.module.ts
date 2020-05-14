import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersRepository } from './partners.repository';
import { ApplicationsModule } from 'src/applications/applications.module';
import { ApplicationsService } from 'src/applications/applications.service';
import { CredentialsService } from 'src/credentials/credentials.service';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { ScopesRepository } from 'src/scopes/scopes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnersRepository]),
    ApplicationsModule,
    CredentialsModule,
  ],
  controllers: [PartnersController],
  providers: [
    PartnersService,
    ApplicationsService,
    CredentialsService,
    ScopesRepository,
  ]
})
export class PartnersModule {}
