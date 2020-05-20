import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialsService } from './credentials.service';
import { CredentialsRepository } from './credentials.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([CredentialsRepository]),
    ],
    providers: [CredentialsService, CredentialsRepository],
    exports: [CredentialsService, CredentialsRepository],
})
export class CredentialsModule {}
