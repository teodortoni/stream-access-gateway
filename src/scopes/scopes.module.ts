import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScopesService } from './scopes.service';
import { ScopesRepository } from './scopes.repository';
import { ScopesController } from './scopes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScopesRepository]),
  ],
  providers: [ScopesService, ScopesRepository],
  exports: [ScopesService],
  controllers: [ScopesController]
})
export class ScopesModule {}
