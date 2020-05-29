import * as crypto from "crypto";
import { InternalServerErrorException } from "@nestjs/common";
import configs from "../config/defaultconfigs";

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
        this.logger.debug(`Method: generatePublicPrivateKeyPair, error code: ${error.code}`, error.stack);
        throw new InternalServerErrorException();
    }
}

export const generateHmacSignature = async (secret: string): Promise<string> => {
    try {
        const hmac = crypto.createHmac(configs().app.crypto.hmac.algorithm, secret);
        return hmac.digest('hex');
    } catch (error) {
        this.logger.debug(`Method: generateHmacSignature, error code: ${error.code}`, error.stack);
        throw new InternalServerErrorException();
    }
}