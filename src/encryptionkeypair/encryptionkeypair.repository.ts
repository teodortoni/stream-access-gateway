import { Repository, EntityRepository, EntityManager, getManager } from "typeorm";
import { EncryptionKeypair } from "../entities/encryption-keypair.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { CreateKeypairDataDto } from "./dto/create-keypair-data.dto";
import { generatePublicPrivateKeyPair } from "../../scripts/helpers";

@EntityRepository(EncryptionKeypair)
export class EncryptionKeypairRepository extends Repository<EncryptionKeypair> {
    private logger = new Logger('EncryptionKeypairRepository');

    constructor(
        public manager: EntityManager = getManager(),
    ){ super() }

    async createKeypair(createKeypairDataDto: CreateKeypairDataDto): Promise<EncryptionKeypair> {
        const { clientId, secret } = createKeypairDataDto;

        try {
            const keyPair = await generatePublicPrivateKeyPair(secret);

            const encryptionKeypair = this.manager.create(EncryptionKeypair);
            encryptionKeypair.clientId = clientId;
            encryptionKeypair.publicKey = keyPair['publicKey'];
            encryptionKeypair.privateKey = keyPair['privateKey'];
            await encryptionKeypair.save();

            return encryptionKeypair;
        } catch (error) {
            this.logger.error(`Method: createKeypair, data: ${JSON.stringify(createKeypairDataDto)}, error code: ${error.code}`, error.stack)
            throw new InternalServerErrorException();
        }
    }
}