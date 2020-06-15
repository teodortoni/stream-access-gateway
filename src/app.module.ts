import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { ApplicationsModule } from './applications/applications.module';
import { CredentialsModule } from './credentials/credentials.module';
import { ScopesModule } from './scopes/scopes.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { EncryptionKeypairModule } from './encryptionkeypair/encryptionkeypair.module';
import { ContentmetadataModule } from './contentmetadata/contentmetadata.module';
import defaultconfigs from '../config/defaultconfigs';

@Module({
  imports: [
    AuthModule,
    PartnersModule,
    ApplicationsModule,
    CredentialsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultconfigs]
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ScopesModule,
    AccessTokenModule,
    EncryptionKeypairModule,
    ContentmetadataModule,
  ],
  providers: [],
})
export class AppModule {}
