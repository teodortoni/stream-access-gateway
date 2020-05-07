import { EntityRepository, Repository } from 'typeorm';
import { Credentials } from 'src/entities/credentials.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { CredentialDataDto } from './dto/credential-data.dto';
import * as crypto from "crypto";
import * as config from "config";

@EntityRepository(Credentials)
export class CredentialsRepository extends Repository<Credentials> {
    private logger = new Logger('CredentialsRepository');

    async createCredentials(credentialDataDto: CredentialDataDto): Promise<Credentials> {
        const { clientId, applicationId, secret } = credentialDataDto;

        try {
            const credentials = new Credentials();
            credentials.clientId = clientId;
            credentials.applicationId = applicationId;
            const keyPair = await this.generatePublicPrivateKeyPair(secret);
            credentials.publicKey = keyPair['publicKey'];
            credentials.privateKey = keyPair['privateKey'];
            credentials.hmacSignature = await this.generateHmacSignature(secret);
            credentials.active = true;
            credentials.revoked = false;
            credentials.save();
            return credentials;
        } catch (error) {
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
            const hmac = crypto.createHmac(config.get('app.crypto.hmac.algorithm'), secret);
            return hmac.digest('hex');
        } catch (error) {
            this.logger.debug(`Method: generateHmacSignature, secret: ${secret}, error code: ${error.code}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
