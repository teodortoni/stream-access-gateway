import * as crypto from "crypto";
import { InternalServerErrorException } from "@nestjs/common";

export const generatePublicPrivateKeyPair = async (secret: string): Promise<object> => {
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