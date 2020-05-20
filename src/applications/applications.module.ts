import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationRepository } from './application.repository';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { ScopesRepository } from 'src/scopes/scopes.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([ApplicationRepository]),
    ],
    providers: [
        ApplicationsService,
        ApplicationRepository,
        ScopesRepository
    ],
    controllers: [ApplicationsController],
    exports: [
        ApplicationsService,
        ApplicationRepository
    ]
})
export class ApplicationsModule {}
