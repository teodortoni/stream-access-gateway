import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ApplicationsModule } from './applications/applications.module';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  imports: [
    AuthModule,
    PartnersModule,
    ApplicationsModule,
    CredentialsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig(ConfigService)),
  ],
  providers: [],
})
export class AppModule {}
