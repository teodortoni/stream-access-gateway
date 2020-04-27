import { Repository, EntityRepository } from "typeorm";
import { Partners } from "./partners.entity";
import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException, Logger, ConflictException } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import * as crypto from "crypto";

@EntityRepository(Partners)
export class PartnersRepository extends Repository<Partners> {
    private logger = new Logger('PartnersRepository');
    private publicKey: string;
    private privateKey: string;

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<object> {
        const { name, username, password } = authCredentialsDto;

        try {
            const partner = this.create();
            partner.iss = uuid();
            partner.name = name;
            partner.username = username;
            partner.salt = await bcrypt.genSalt();
            partner.password = await this.hashedPassword(password, partner.salt);
            const keyPair = await this.generatePublicPrivateKeyPair(partner.salt);
            if (Object.keys(keyPair).length > 0) {
                partner.publickey = keyPair['publicKey'];
                partner.privatekey = keyPair['privateKey'];
            }
            partner.active = false;
        
            await partner.save();

            return {
                "client_id": partner.iss,
                "public_key": partner.publickey,
                "private_key": partner.privatekey
            };
        } catch (error) {
            this.logger.debug(`Method: signUp, data: ${JSON.stringify(authCredentialsDto)}, error code: ${error.code}`, error.stack);
            if (error.code === '23505') {
                throw new ConflictException('Username entered is already taken.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    private async hashedPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    private async generatePublicPrivateKeyPair(secret: string): Promise<object> {

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
    }
}