import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PartnersService } from 'src/partners/partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersRepository } from 'src/partners/partners.repository';
import { PassportModule } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import * as config from 'config';
import { PartnerAuthJwtStrategy } from './partner-auth-jwt.strategy';
import { ApplicationsService } from 'src/applications/applications.service';
import { ApplicationRepository } from 'src/applications/application.repository';
import { CredentialsService } from 'src/credentials/credentials.service';
import { CredentialsRepository } from 'src/credentials/credentials.repository';
import { CredentialsModule } from 'src/credentials/credentials.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrKeyProvider: (
        requestType: JwtSecretRequestType,
        tokenOrPayload: string | object | Buffer,
        verifyOrSignOrOptions?: jwt.VerifyOptions | jwt.SignOptions
      ) => {
        switch (requestType) {
          case JwtSecretRequestType.SIGN:
            // retrieve signing key dynamically
            const key = tokenOrPayload['key'];
            const passphrase = tokenOrPayload['passphrase'];
            delete tokenOrPayload['key'];
            delete tokenOrPayload['passphrase'];
            // In case of a private key with passphrase an object { key, passphrase } can be used (based on crypto documentation), 
            // In this case be sure you pass the algorithm option.
            return passphrase === 'hmacsignature' ? key : { key, passphrase };
          case JwtSecretRequestType.VERIFY:
            // retrieve verify key dynamically
            return null;
          default:
            // retrieve secret dynamically
            return null;
        }
      },
      signOptions: {
        expiresIn: config.get('app.jwt.expiresIn'),
        algorithm: config.get('app.jwt.algorithm')
      },
      verifyOptions: {
        algorithms: [config.get('app.jwt.algorithm')]
      }
    }),
    TypeOrmModule.forFeature([PartnersRepository, CredentialsRepository]),
    CredentialsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PartnersService,
    PartnerAuthJwtStrategy,
    ApplicationsService,
    ApplicationRepository,
    CredentialsService,
    CredentialsRepository,
  ],
  exports: [
    PassportModule,
    PartnerAuthJwtStrategy,
  ]
})
export class AuthModule {}
