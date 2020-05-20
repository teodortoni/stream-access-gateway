import { EntityRepository, Repository, EntityManager, getManager } from 'typeorm';
import { Credentials } from '../entities/credentials.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { CredentialDataDto } from './dto/credential-data.dto';
import * as crypto from "crypto";
import { ConfigService } from '@nestjs/config';

@EntityRepository(Credentials)
export class CredentialsRepository extends Repository<Credentials> {
    private logger = new Logger('CredentialsRepository');

    constructor(
        public manager: EntityManager = getManager(),
        private configService: ConfigService
    ) {
        super();
    }

    async createCredentials(credentialDataDto: CredentialDataDto): Promise<Credentials> {
        const { clientId, applicationId, secret } = credentialDataDto;

        try {
            const credentials = this.manager.create(Credentials);
            credentials.clientId = clientId;
            credentials.applicationId = applicationId;
            const keyPair = await this.generatePublicPrivateKeyPair(secret);
            credentials.publicKey = keyPair['publicKey'];
            credentials.privateKey = keyPair['privateKey'];
            credentials.hmacSignature = await this.generateHmacSignature(secret);
            credentials.active = true;
            await credentials.save();
            return credentials;
        } catch (error) {
            this.logger.error(`Method: createCredentials, clientId: ${clientId}, applicationId: ${applicationId}, secret: ${secret} error code: ${error.code}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    private async generatePublicPrivateKeyPair(secret: string): Promise<object> {
        try {
            return crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: secret
                }
            });
        } catch (error) {
            this.logger.debug(`Method: generatePublicPrivateKeyPair, secret: ${secret}, error code: ${error.code}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    private async generateHmacSignature(secret: string): Promise<string> {
        try {
            const hmac = crypto.createHmac(this.configService.get<string>('app.crypto.hmac.algorithm'), secret);
            return hmac.digest('hex');
        } catch (error) {
            this.logger.debug(`Method: generateHmacSignature, secret: ${secret}, error code: ${error.code}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
