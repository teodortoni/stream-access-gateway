import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenRepository } from './access-token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenRepository])
  ],
  providers: [AccessTokenService, AccessTokenRepository],
  exports: [AccessTokenService, AccessTokenRepository]
})
export class AccessTokenModule {}
